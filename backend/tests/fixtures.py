import asyncio
from typing import Generator

import pytest
from tortoise import Tortoise

from backend.apps.mailing.service import service_mailing
from backend.db.database import sqlite_db_init
from backend.submodules.permissions.fixtures import setup_permissions_and_roles
from backend.submodules.redis.service import redis

pytestmark = pytest.mark.asyncio


@pytest.fixture(scope="session")
def event_loop():
    yield asyncio.get_event_loop()


@pytest.fixture(scope="session", autouse=True)
async def init_connections() -> Generator:
    await redis.redis_init()
    await redis.register_service(service_mailing)

    await sqlite_db_init()
    await setup_permissions_and_roles()

    yield True

    await Tortoise.close_connections()
    assert "X"
