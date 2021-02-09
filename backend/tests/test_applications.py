import pytest
from backend.apps.mailing.service import service_mailing
from tortoise import Tortoise

from backend.db.database import sqlite_db_init
from backend.submodules.permissions.fixtures import setup_permissions_and_roles
from backend.submodules.redis.service import redis
from backend.tests.data import BaseTest, TestApplicationData, TestAccountData

pytestmark = pytest.mark.asyncio


class TestApplications(BaseTest):

    application_data = TestApplicationData()
    account_data = TestAccountData()

    async def test_applications(self):
        await redis.redis_init()
        await redis.register_service(service_mailing)

        await sqlite_db_init()
        await setup_permissions_and_roles()

        await self.get_user()

        for app in self.application_data.get_applications():
            async with self.client as ac:
                response = await ac.post(
                    "/applications/", headers=self.headers, json=app
                )
            assert response.status_code == 201

        await Tortoise.close_connections()
        assert "X"
