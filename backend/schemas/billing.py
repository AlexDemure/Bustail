from decimal import Decimal

from pydantic import BaseModel, validator
from backend.enums.billing import PaymentCardType


class PaymentOperationCreate(BaseModel):
    account_id: int
    payment_card: PaymentCardType
    sum: Decimal
    operation_id: str
    metadata: str = None
    transaction_id: str = None
    auth_code: str = None
    card_number: str = None
    expiry_month: str = None
    expiry_year: str = None


class PaymentLink(BaseModel):
    payment_url: int
    payment_operation_id: str
