import pytest
from tortoise import Tortoise

from backend.apps.mailing.models import ChangePasswordEvent
from backend.apps.mailing.service import service_mailing
from backend.db.database import sqlite_db_init
from backend.submodules.permissions.fixtures import setup_permissions_and_roles
from backend.submodules.redis.service import redis
from backend.tests.data import BaseTest, TestAccountData

pytestmark = pytest.mark.asyncio


class TestCreateAccount(BaseTest):

    account_data = TestAccountData()

    async def test_create_account(self):
        await redis.redis_init()
        await redis.register_service(service_mailing)

        await sqlite_db_init()
        await setup_permissions_and_roles()

        await self.create_account()

        await Tortoise.close_connections()
        assert "X"


class TestChangePassword(BaseTest):

    account_data = TestAccountData()

    new_password = "123456"

    async def test_reset_password(self):
        await redis.redis_init()
        await redis.register_service(service_mailing)

        await sqlite_db_init()
        await setup_permissions_and_roles()

        await self.create_account()
        await self.send_change_email_message()
        await self.setup_new_password()

        self.account_data.hashed_password = self.new_password
        await self.login()

        await Tortoise.close_connections()
        assert "X"

    async def send_change_email_message(self):
        async with self.client as ac:
            response = await ac.post("/mailing/change_password/", json={"email": self.account_data.email})
            assert response.status_code == 200

    async def setup_new_password(self):
        security_token = await self.get_security_token()

        async with self.client as ac:
            response = await ac.put(
                f"/accounts/change_password/?security_token={security_token.message}",
                json={"password": self.new_password}
            )
            assert response.status_code == 200

    async def get_security_token(self) -> ChangePasswordEvent:
        return await ChangePasswordEvent.get_or_none(email=self.account_data.email)

