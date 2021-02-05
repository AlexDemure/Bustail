import uuid
from datetime import datetime
from decimal import Decimal

from structlog import get_logger
from tortoise.transactions import in_transaction
from yandex_checkout import Configuration, Payment as YandexPaymentObject

from backend.accounts.models import Account
from backend.billing.crud import payment_operation as crud_payment_operation
from backend.billing.errors import PaymentError
from backend.billing.utils import concat_card_number
from backend.common.schemas import UpdatedBase
from backend.core.config import settings
from backend.enums.billing import PaymentErrors, PaymentOperationStatus
from backend.schemas.billing import PaymentOperationCreate

Configuration.account_id = settings.YANDEX_KASSA_ID
Configuration.secret_key = settings.YANDEX_KASSA_SECRET


class PaymentBase:

    logger = None
    account = None
    amount = None

    redirect_url = "https://bustail.online/"
    currency = "RUB"

    vat_code = "1" #  Ставка НДС https://yookassa.ru/developers/54fz/parameters-values#vat-codes
    operation_description = "Получение услуг от сервиса bustail.online"

    # Признак способа расчета. Полная предоплата  # https://yookassa.ru/developers/54fz/parameters-values#payment-mode
    payment_mode = "full_prepayment"

    # Признак предмета расчета. Платеж https://yookassa.ru/developers/54fz/parameters-values#payment-subject
    payment_subject = "payment"

    # Тип расчета. Безналичный расчет. https://yookassa.ru/developers/54fz/parameters-values#settlement-type
    settlements_type = "cashless"

    payment_method = "bank_card"

    def __init__(self, account: Account, amount: Decimal):
        self.logger = get_logger()
        self.account = account
        self.amount = amount

    async def create_payment_operation(self):
        raise NotImplementedError

    def get_payment_object(self):
        return YandexPaymentObject.create(self.get_pay_data(), uuid.uuid4())

    def get_pay_data(self) -> dict:
        return dict(
            **self.get_amount_data(),
            **self.get_confirmation_data(),
            **self.get_receipt_data(),
            **self.get_payment_data(),
            capture=True,
        )

    def get_amount_data(self) -> dict:
        return dict(
            amount=dict(
                value=str(self.amount),
                currency=self.currency
            )
        )

    def get_receipt_data(self) -> dict:
        """Данные для формирования чека в онлайн-кассе (для соблюдения 54-ФЗ ).
         Необходимо передавать, если вы отправляете данные для формирования чеков по одному из сценариев:"""
        if self.account.email:
            customer = dict(email=self.account.email)
        elif self.account.phone:
            customer = dict(phone=self.account.phone)
        else:
            raise ValueError("Customer not have email and phone")

        return dict(
            receipt=dict(
                # Информация о пользователе.
                # Необходимо указать как минимум контактные данные: электронную почту или телефон.
                customer=customer,

                #items - Список товаров в заказе (не более 100 товаров)#
                items=[
                    dict(
                        description=self.operation_description,
                        quantity="1.00",  # Количество товаров
                        **self.get_amount_data(),
                        vat_code=self.vat_code,
                        payment_subject=self.payment_subject,
                        payment_mode=self.payment_mode
                    )
                ],

                # Перечень совершенных расчетов.
                settlements=[
                    dict(
                        type=self.settlements_type,
                        **self.get_amount_data()
                    )
                ],
            )
        )

    def get_payment_data(self) -> dict:
        """
        Данные для оплаты конкретным способом  (payment_method).
        Вы можете не передавать этот объект в запросе.
        В этом случае пользователь будет выбирать способ оплаты на стороне Яндекс.Кассы.
        """
        return dict(payment_method_data=dict(type=self.payment_method))

    def get_confirmation_data(self) -> dict:
        """
        Выбранный способ подтверждения платежа. Присутствует, когда платеж ожидает подтверждения от пользователя.
        """
        return dict(
            confirmation=dict(
                type="redirect",
                return_url=self.redirect_url
            )
        )


class Payment(PaymentBase):

    async def create_payment_operation(self) -> dict:
        """
        Создание платежной операции.

        Возвращается ссылку для оплаты и id операции.
        """
        yandex_payment_object = self.get_payment_object()

        payment_operation_in = PaymentOperationCreate(
            account_id=self.account.id,
            sum=self.amount,
            operation_id=yandex_payment_object.id,
            metadata=yandex_payment_object.metadata.get('scid', None)
        )
        payment_operation = await crud_payment_operation.create(payment_operation_in)
        self.logger.debug(
            f"Create payment operation",
            operation_id=payment_operation.operation_id,
            payment_operation_id=payment_operation.id,
            payment_url=yandex_payment_object.confirmation.confirmation_url
        )

        return dict(
            payment_url=yandex_payment_object.confirmation.confirmation_url,
            payment_operation_id=payment_operation.id
        )


class PaymentNotification:

    logger = None
    notification = None

    payment_operation = None
    account = None

    def __init__(self, notification: dict):
        self.logger = get_logger()
        self.notification = notification
        self.account = None

    async def receiving_notification(self) -> int:
        """
        Прием уведомления об оплате.

        Пример уведомления можно найти в test_response.json.
        """
        async with in_transaction():
            self.payment_operation = await crud_payment_operation.get_by_operation_id(self.notification['object']['id'])
            if not self.payment_operation:
                raise PaymentError(PaymentErrors.operation_id_is_not_found.value)

            self.logger = self.logger.bind(payment_operation_id=self.payment_operation.id)
            self.account = await self.payment_operation.account

            if self.payment_operation.status is not None:
                raise PaymentError(PaymentErrors.payment_operation_have_end_status.value)

            if self.notification['object']['status'] != PaymentOperationStatus.success.value:
                raise PaymentError(PaymentErrors.operation_status_not_success.value)

            if self.notification['object']['paid'] is False:
                raise PaymentError(PaymentErrors.paid_is_not_finished.value)

            # Подтверждения оплаты
            await self.confirmed_payment(
                transaction_id=self.notification['object']['authorization_details']['rrn'],
                auth_code=self.notification['object']['authorization_details']['auth_code'],
            )

            return self.payment_operation.id

    async def confirmed_payment(self, **kwargs):
        payment_operation_up = UpdatedBase(
            id=self.payment_operation.id,
            updated_fields=dict(
                **self.get_card_data(),
                status=True,
                updated_at=datetime.utcnow(),
                transaction_id=kwargs['transaction_id'],
                auth_code=kwargs['auth_code'],
            )
        )
        await crud_payment_operation.update(payment_operation_up)
        self.logger.debug("Confirmed payment operation")

    def get_card_data(self) -> dict:
        return dict(
            card_number=concat_card_number(
                self.notification['object']['payment_method']['card']['first6'],
                self.notification['object']['payment_method']['card']['last4'],
            ),
            expiry_month=self.notification['object']['payment_method']['card']['expiry_month'],
            expiry_year=self.notification['object']['payment_method']['card']['expiry_year'],
        )
