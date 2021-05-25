import random
from typing import Optional

from httpx import AsyncClient

from backend.apps.accounts.crud import account as account_crud
from backend.apps.accounts.models import Account
from backend.apps.mailing.models import SendVerifyCodeEvent
from backend.core.application import app
from backend.enums.applications import ApplicationTypes
from backend.enums.drivers import TransportType
from backend.enums.notifications import NotificationTypes
from backend.utils import get_cities, get_cars
from backend.submodules.security.utils import generate_random_code

ASYNC_CLIENT = AsyncClient(app=app, base_url="http://localhost/api/v1")


class TestAccountData:

    email = None
    fullname = None
    phone = None
    hashed_password = "string"
    city = "Челябинск"

    def __init__(self):
        self.email = f"{generate_random_code(only_digits=False)}@gmail.com"
        self.fullname = f"{generate_random_code(only_digits=False)}"
        self.phone = f"+7{generate_random_code(size=10, only_digits=True)}"

    def get_personal_data(self) -> dict:
        return dict(
            email=self.email,
            phone=self.phone,
            hashed_password=self.hashed_password,
            city=self.city
        )

    async def get_account_by_email(self) -> Optional[Account]:
        return await account_crud.find_by_email(self.email)

    def get_auth_data(self) -> dict:
        return dict(
            username=self.email,
            password=self.hashed_password
        )


class TestCarrierData:
    company_name = generate_random_code(size=8, only_digits=False)
    inn = generate_random_code(size=12, only_digits=True)
    license_number = generate_random_code(size=16, only_digits=False)
    ogrn = generate_random_code(size=13, only_digits=True)

    @staticmethod
    def me_transports() -> list:
        transports = list()
        for _ in range(5):
            cars = get_cars()
            brand = random.choice(list(cars.keys()))

            transport_data = {
                "brand": brand,
                "model": random.choice(cars[brand]),
                "count_seats": random.randint(1, 50),
                "price": random.randint(1000, 10000),
                "city": random.choice(get_cities()),
                "state_number": generate_random_code(size=6, only_digits=False),
                "transport_type": random.choice([x.value for x in TransportType])
            }
            transports.append(transport_data)

        return transports


class TestApplicationData:

    @staticmethod
    def get_applications() -> list:
        applications = list()
        for _ in range(5):
            app = {
                "application_type": random.choice([x.value for x in ApplicationTypes]),
                "to_go_from": random.choice(get_cities()),
                "to_go_to": random.choice(get_cities()),
                "to_go_when": "2021-10-01",
                "count_seats": random.randint(1, 50),
                "description": "string",
                "price": random.randint(10000, 50000)
            }
            applications.append(app)

        return applications


class BaseTest:

    client = ASYNC_CLIENT

    headers = None
    access_token = None
    refresh_token = None

    account_data = None

    def update_auth_data(self, data: dict):
        self.access_token = data['access_token']
        self.refresh_token = data['refresh_token']
        self.headers = {"Authorization": f"Bearer {data['access_token']}"}

    async def login(self):
        async with ASYNC_CLIENT as ac:
            response = await ac.post("/login/access-token/", data=self.account_data.get_auth_data())

        assert response.status_code == 200
        self.update_auth_data(response.json())

    async def update_token(self):
        async with self.client as ac:
            response = await ac.post("/login/refresh-token/", json={"token": self.refresh_token})
            assert response.status_code == 200

        self.update_auth_data(response.json())

    async def create_account(self):
        async with self.client as ac:
            response = await ac.post("/accounts/", json=self.account_data.get_personal_data())

        assert response.status_code == 201

        self.update_auth_data(response.json())
        await self.confirm_account()
        await self.change_account_data()

    async def change_account_data(self):
        async with self.client as ac:
            response = await ac.put(
                "/accounts/",
                headers=self.headers,
                json={
                    "city": self.account_data.city,
                    "phone": self.account_data.phone,
                    "fullname": self.account_data.fullname,
                }
            )

        assert response.status_code == 200

    @staticmethod
    async def get_verify_code(account_id: int) -> Optional[SendVerifyCodeEvent]:
        return await SendVerifyCodeEvent.get_or_none(account_id=account_id)

    async def confirm_account(self):
        account_object = await self.account_data.get_account_by_email()
        verify_code = await self.get_verify_code(account_object.id)

        async with self.client as ac:
            response = await ac.get(f"/accounts/confirm?code={verify_code.message}", headers=self.headers)

        assert response.status_code == 200

    async def get_user(self):
        try:
            await self.login()
        except AssertionError:
            await self.create_account()

        async with self.client as ac:
            response = await ac.get("/accounts/me/", headers=self.headers)
        assert response.status_code == 200


class AccountProfile(BaseTest):

    account_data = None
    application_data = None

    def __init__(self):
        self.account_data = TestAccountData()
        self.application_data = TestApplicationData()

    async def create_client_account(self):
        await self.create_account()

    async def create_applications(self):
        await self.get_user()

        applications_id = list()

        for app in self.application_data.get_applications():
            async with self.client as ac:
                response = await ac.post(
                    "/applications/", headers=self.headers, json=app
                )
            assert response.status_code == 201
            response_json = response.json()
            applications_id.append(response_json['id'])

        return applications_id


class DriverProfile(BaseTest):

    account_data = None
    driver_data = None

    def __init__(self):
        self.account_data = TestAccountData()
        self.driver_data = TestCarrierData()

    async def create_driver_account(self):
        await self.create_account()

        async with self.client as ac:
            response = await ac.post(
                "/drivers/",
                headers=self.headers,
                json={
                    "company_name": self.driver_data.company_name,
                    "inn": self.driver_data.inn,
                    "license_number": self.driver_data.license_number
                }
            )
        assert response.status_code == 201

    async def create_driver_transports(self):
        transports_id = list()

        async with self.client as ac:
            driver_response = await ac.get("/drivers/me/", headers=self.headers)
            assert driver_response.status_code == 200

        for transport in self.driver_data.me_transports():
            transport['driver_id'] = driver_response.json()['id']
            async with self.client as ac:
                response = await ac.post("/drivers/transports/", headers=self.headers, json=transport)
            assert response.status_code == 201

            response_json = response.json()
            transports_id.append(response_json['id'])

        return transports_id


class CompanyProfile(BaseTest):

    company_data = None
    account_data = None

    def __init__(self):
        self.company_data = TestCarrierData()
        self.account_data = TestAccountData()

    async def create_company_account(self):
        await self.create_account()

        async with self.client as ac:
            response = await ac.post(
                "/company/",
                headers=self.headers,
                json={
                    "company_name": self.company_data.company_name,
                    "inn": self.company_data.inn,
                    "license_number": self.company_data.license_number,
                    "ogrn": self.company_data.ogrn
                }
            )
        assert response.status_code == 201

    async def create_company_transports(self):
        transports_id = list()

        async with self.client as ac:
            company_response = await ac.get("/company/me/", headers=self.headers)
            assert company_response.status_code == 200

        for transport in self.company_data.me_transports():
            transport['company_id'] = company_response.json()['id']
            async with self.client as ac:
                response = await ac.post("/drivers/transports/", headers=self.headers, json=transport)
                assert response.status_code == 201

            response_json = response.json()
            transports_id.append(response_json['id'])

        return transports_id


class NotificationData(BaseTest):

    driver_profile = None
    company_profile = None
    client_profile = None

    async def create_notification(
            self, headers: dict, transport_id: int, application_id: int, notification_type: NotificationTypes
    ):
        # Создание уведомления от водителя к клиенту
        async with self.client as ac:
            response = await ac.post(
                "notifications/",
                headers=headers,
                json=dict(
                    transport_id=transport_id,
                    application_id=application_id,
                    notification_type=notification_type,
                    price=random.randint(10000, 50000),
                )
            )

        return response

    async def set_decision(self, headers: dict, notification_id: int):
        # Установка решения по заявке со стороны клиента
        async with self.client as ac:
            response = await ac.put(
                "notifications/",
                headers=headers,
                json=dict(
                    notification_id=notification_id,
                    decision=random.choice([True, False])
                )
            )

        return response

    async def generate_driver_and_client_notifications(self):
        """Генерирование уведомлений."""
        self.driver_profile = DriverProfile()
        self.client_profile = AccountProfile()

        await self.driver_profile.create_driver_account()
        transports_id = await self.driver_profile.create_driver_transports()

        await self.client_profile.create_client_account()
        applications_id = await self.client_profile.create_applications()

        notification_driver_to_client = [(transports_id[i], applications_id[i]) for i in range(5)]
        notification_client_to_driver = [(applications_id[i], transports_id[i]) for i in range(5)]

        for notification in notification_driver_to_client:
            response = await self.create_notification(
                headers=self.driver_profile.headers,
                transport_id=notification[0],
                application_id=notification[1],
                notification_type=NotificationTypes.driver_to_client.value,
            )

            assert response.status_code == 201
            response_json = response.json()

            await self.set_decision(self.client_profile.headers, response_json['id'])

        for notification in notification_client_to_driver:
            response = await self.create_notification(
                headers=self.driver_profile.headers,
                transport_id=notification[1],
                application_id=notification[0],
                notification_type=NotificationTypes.client_to_driver.value,
            )
            if response.status_code == 400:
                continue

            assert response.status_code == 201
            response_json = response.json()

            await self.set_decision(self.driver_profile.headers, response_json['id'])

    async def generate_company_and_client_notifications(self):
        """Генерирование уведомлений."""
        self.company_profile = CompanyProfile()
        self.client_profile = AccountProfile()

        await self.company_profile.create_company_account()
        transports_id = await self.company_profile.create_company_transports()

        await self.client_profile.create_client_account()
        applications_id = await self.client_profile.create_applications()

        notification_driver_to_client = [(transports_id[i], applications_id[i]) for i in range(5)]
        notification_client_to_driver = [(applications_id[i], transports_id[i]) for i in range(5)]

        for notification in notification_driver_to_client:
            response = await self.create_notification(
                headers=self.company_profile.headers,
                transport_id=notification[0],
                application_id=notification[1],
                notification_type=NotificationTypes.driver_to_client.value,
            )

            assert response.status_code == 201
            response_json = response.json()

            await self.set_decision(self.client_profile.headers, response_json['id'])

        for notification in notification_client_to_driver:
            response = await self.create_notification(
                headers=self.client_profile.headers,
                transport_id=notification[1],
                application_id=notification[0],
                notification_type=NotificationTypes.client_to_driver.value,
            )
            if response.status_code == 400:
                continue

            assert response.status_code == 201
            response_json = response.json()

            await self.set_decision(self.company_profile.headers, response_json['id'])