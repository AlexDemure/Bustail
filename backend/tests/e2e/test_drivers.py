import random

from backend.tests.data import BaseTest, TestCarrierData, TestAccountData
from backend.tests.fixtures import *


class TestDriver(BaseTest):

    driver_data = None
    account_data = None

    def __init__(self):
        self.driver_data = TestCarrierData()
        self.account_data = TestAccountData()

    async def test_driver_account(self):
        await self.get_user()

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

        async with self.client as ac:
            response = await ac.get("/drivers/me/", headers=self.headers)
        assert response.status_code == 200

    async def test_transport(self):
        await self.get_user()

        async with self.client as ac:
            driver_response = await ac.get("/drivers/me/", headers=self.headers)
        assert driver_response.status_code == 200

        for transport in self.driver_data.me_transports():
            transport['driver_id'] = driver_response.json()['id']
            async with self.client as ac:
                response = await ac.post("/drivers/transports/", headers=self.headers, json=transport)
            assert response.status_code == 201

            response_json = response.json()

            await self.create_transport_photo(response_json['id'])

    async def create_transport_photo(self, transport_id: int):
        files = ["test_01.jpg", "test_02.jpg", "test_03.jpg", "test_04.jpg"]

        file_name = random.choice(files)
        file_content = open(f"static/test_files/covers/{file_name}", "rb")

        async with self.client as ac:
            response = await ac.post(
                f"/drivers/transports/{transport_id}/covers/",
                headers=self.headers,
                files={'files': (file_name, file_content, 'image/jpeg')}
            )

        assert response.status_code == 201
