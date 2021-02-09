from typing import Optional

from backend.apps.accounts.models import Account
from backend.submodules.auth.security import verify_password
from backend.submodules.common.crud import CRUDBase
from backend.schemas.accounts import AccountCreate, AccountUpdate


class CRUDAccount(CRUDBase[Account, AccountCreate, AccountUpdate]):

    async def find_by_email(self, email: str) -> Optional[Account]:
        return await self.model.filter(email=email).first()

    async def find_by_phone(self, phone: str) -> Optional[Account]:
        return await self.model.filter(phone=phone).first()

    async def authenticate(self, email: str, password: str) -> Optional[Account]:
        user = await self.find_by_email(email=email)
        if user:
            if verify_password(password, user.hashed_password):
                return user

        return None


account = CRUDAccount(Account)
