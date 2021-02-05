from typing import Optional

from backend.common.crud import CRUDBase
from backend.common.schemas import UpdatedBase

from backend.billing.models import PaymentOperation
from backend.schemas.billing import PaymentOperationCreate


class CRUDPaymentOperation(CRUDBase[PaymentOperation, PaymentOperationCreate, UpdatedBase]):

    async def get_by_operation_id(self, operation_id: int) -> Optional[PaymentOperation]:
        return await self.model.filter(operation_id=operation_id).first()


payment_operation = CRUDPaymentOperation(PaymentOperation)
