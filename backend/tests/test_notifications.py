import pytest
from tortoise import Tortoise

from backend.db.database import sqlite_db_init
from backend.mailing.service import service_mailing
from backend.permissions.fixtures import setup_permissions_and_roles
from backend.redis.service import redis
from backend.tests.data import BaseTest, NotificationData

pytestmark = pytest.mark.asyncio


class TestNotifications(BaseTest):

    async def test_notification(self):
        await redis.redis_init()
        await redis.register_service(service_mailing)

        await sqlite_db_init()
        await setup_permissions_and_roles()

        await NotificationData().generate_notifications()

        await Tortoise.close_connections()
        assert "X"
