from decimal import Decimal

from pydantic import BaseModel, validator


class PaymentOperationCreate(BaseModel):
    account_id: int
    sum: Decimal
    operation_id: str
    metadata: str = None
    transaction_id: str = None
    auth_code: str = None
    card_number: str = None
    expiry_month: str = None
    expiry_year: str = None


class PaymentLink(BaseModel):
    url: str
