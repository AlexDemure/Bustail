from fastapi import APIRouter, status, Response, Depends, HTTPException
from structlog import get_logger
from decimal import Decimal

from backend.accounts.models import Account
from backend.drivers.views import get_driver_by_account_id
from backend.drivers.crud import driver as crud_driver

from backend.billing.logic import Payment, PaymentNotification
from backend.billing.crud import payment_operation as crud_payment_operation
from backend.billing.utils import write_off_debt
from backend.schemas.billing import PaymentLink
from backend.enums.billing import PaymentOperationEvents
from backend.common.deps import confirmed_account
from backend.common.enums import BaseMessage
from backend.common.schemas import UpdatedBase


router = APIRouter()


@router.post("/yandex/payments/")
async def payment_url(account: Account = Depends(confirmed_account)):
    """Прием уведомления об платежной операции из яндекс кассы."""
    driver = await get_driver_by_account_id(account.id)
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    if driver.debt == Decimal("0"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Amount is 0"
        )

    payment_data = await Payment(account=account, amount=driver.debt).create_payment_operation()
    return PaymentLink(url=payment_data['payment_url'])


@router.post("/yandex/payments/notifications/")
async def payment_notification(payment_data: dict):
    """Прием уведомления об платежной операции из яндекс кассы."""
    logger = get_logger()
    logger.debug("Payment notification", notification_json=payment_data)

    if payment_data['event'] == PaymentOperationEvents.payment_success.value:
        payment_operation_id = await PaymentNotification(payment_data).receiving_notification()

        payment_operation = await crud_payment_operation.get(payment_operation_id)

        driver = await get_driver_by_account_id(payment_operation.account_id)
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

        driver_up = UpdatedBase(
            id=driver.id,
            updated_fields=dict(debt=write_off_debt(driver.debt, payment_operation.sum))
        )
        await crud_driver.update(driver_up)

    return Response(status_code=200)
