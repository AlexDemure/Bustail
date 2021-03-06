from typing import Optional

from tortoise.query_utils import Q

from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase
from backend.apps.mailing.models import SendVerifyCodeEvent, ChangePasswordEvent
from backend.schemas.mailing import SendVerifyCodeEventCreate, ChangePasswordEventCreate


class CRUDSendVerifyCode(CRUDBase[SendVerifyCodeEvent, SendVerifyCodeEventCreate, UpdatedBase]):

    async def find_code(self, account_id: int, code: str) -> Optional[SendVerifyCodeEvent]:
        return await self.model.filter(
            Q(
                Q(message=code),
                Q(account_id=account_id),
                join_type="AND"
            )
        ).first()


send_verify_code_event = CRUDSendVerifyCode(SendVerifyCodeEvent)


class CRUDChangePassword(CRUDBase[ChangePasswordEvent, ChangePasswordEventCreate, UpdatedBase]):

    async def find_token(self, email: str, token: str) -> Optional[dict]:
        return await self.model.filter(
            Q(
                Q(message=token),
                Q(email=email),
                join_type="AND"
            )
        ).first()


change_password_event = CRUDChangePassword(ChangePasswordEvent)
