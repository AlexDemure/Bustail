from decimal import Decimal, ROUND_DOWN
from typing import Union

from pydantic import validate_arguments

from backend.core.config import settings
from backend.enums.billing import PaymentErrors


@validate_arguments
def concat_card_number(first6: str, last4: str) -> str:
    assert len(first6) == 6, PaymentErrors.card_is_wrong_format.value
    assert len(last4) == 4, PaymentErrors.card_is_wrong_format.value

    mask_card = 6 * "*"
    return f"{first6}{mask_card}{last4}"


@validate_arguments
def get_commission_sum_from_application(
        application_sum: Decimal,
        commission: Decimal = settings.DEFAULT_COMMISSION_IN_PERCENT
) -> Decimal:
    """Получение суммы за услуги сервиса от стоимости заявки."""
    return convert_number_to_decimal(application_sum * commission)


@validate_arguments
def add_amount_to_current_value(current_value: Decimal, additional_sum: Decimal) -> Decimal:
    """Добавление значения к текущей сумме."""
    return convert_number_to_decimal(current_value + additional_sum)


@validate_arguments
def write_off_debt(current_debt: Decimal, write_off_sum: Decimal) -> Decimal:
    return convert_number_to_decimal(current_debt - write_off_sum)


@validate_arguments
def convert_number_to_decimal(num: Union[int, float, Decimal]) -> Decimal:
    """
    Конвертация всех числовых значений в Decimal с округлением вниз.

    На выходе получаем Decimal в формате 0.00
    """
    return Decimal(num).quantize(Decimal('0.00'), rounding=ROUND_DOWN)
