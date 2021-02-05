import json
from unittest.mock import patch

import pytest
from tortoise import Tortoise

from backend.applications.models import Application
from backend.applications.tasks import completed_applications
from backend.billing.crud import payment_operation as crud_payment_operation
from backend.db.database import sqlite_db_init
from backend.enums.applications import ApplicationStatus
from backend.mailing.service import service_mailing
from backend.permissions.fixtures import setup_permissions_and_roles
from backend.redis.service import redis
from backend.tests.data import BaseTest, NotificationData

pytestmark = pytest.mark.asyncio


class TestPayments(BaseTest):

    async def test_payments(self):
        await redis.redis_init()
        await redis.register_service(service_mailing)

        await sqlite_db_init()
        await setup_permissions_and_roles()

        notifications = NotificationData()
        await notifications.generate_notifications()

        with patch('backend.applications.crud.application.completed_applications') as perm_mock:
            perm_mock.return_value = await ApplicationCrud.completed_applications()
            await completed_applications()

        response = await self.get_payment_link(notifications.driver_profile.headers)

        payment_operation = await crud_payment_operation.get(response.json()['payment_operation_id'])
        payment_notification_in_json = self.get_test_json_data(payment_operation.operation_id)

        response = await self.close_debt(payment_notification_in_json)
        print(response)

        await Tortoise.close_connections()
        assert "X"

    async def get_payment_link(self, headers: dict):
        async with self.client as ac:
            response = await ac.get("payments/", headers=headers)
            assert response.status_code == 201

        return response

    async def close_debt(self, payment_notification_data: dict):
        async with self.client as ac:
            response = await ac.post(
                "payments/notifications/",
                json=payment_notification_data
            )
            assert response.status_code == 200

        return response

    @staticmethod
    def get_test_json_data(operation_id: str = None) -> dict:
        with open('static/test_response.json', 'r') as file:
            data = file.read()

        json_data = json.loads(data)
        if operation_id:
            json_data['object']['id'] = operation_id
            json_data['object']['payment_method']['id'] = operation_id

        return json_data


class ApplicationCrud:

    @staticmethod
    async def completed_applications():
        """Заявки которые были подтверждены но у них не проставлен статус 'Выполнено'."""
        return await Application.filter(application_status=ApplicationStatus.confirmed).all()


