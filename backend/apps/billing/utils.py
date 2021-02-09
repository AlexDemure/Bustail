from decimal import Decimal, ROUND_DOWN

from backend.core.config import settings


def concat_card_number(first6: str, last4: str) -> str:
    secret_elements = 6
    secret_symbol = "*"
    return f"{first6}{ secret_elements* secret_symbol}{last4}"


def get_commission_sum_from_application(application_sum: Decimal) -> Decimal:
    """Получение суммы за услуги сервиса от стоимости заявки."""
    return (application_sum * settings.DEFAULT_COMMISSION_IN_PERCENT).quantize(Decimal('0.0'), rounding=ROUND_DOWN)


def add_amount_to_debt(current_debt: Decimal, commission_sum: Decimal) -> Decimal:
    """Добавление коммисии сервиса к остаточной задолжости водителя."""
    return (current_debt + commission_sum).quantize(Decimal('0.0'), rounding=ROUND_DOWN)


def write_off_debt(current_debt: Decimal, write_off_sum: Decimal) -> Decimal:
    return (current_debt - write_off_sum).quantize(Decimal('0.0'), rounding=ROUND_DOWN)
