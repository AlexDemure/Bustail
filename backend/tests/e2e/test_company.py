import random

from backend.tests.data import BaseTest, TestCarrierData, TestAccountData
from backend.tests.fixtures import *


class TestCompany(BaseTest):

    company_data = None
    account_data = None

    def __init__(self):
        self.company_data = TestCarrierData()
        self.account_data = TestAccountData()

    async def test_company_account(self):
        await self.get_user()

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

        async with self.client as ac:
            response = await ac.get("/company/me/", headers=self.headers)
        assert response.status_code == 200

    async def test_transport(self):
        await self.get_user()

        async with self.client as ac:
            company_response = await ac.get("/company/me/", headers=self.headers)
            assert company_response.status_code == 200

        for transport in self.company_data.me_transports():
            transport['company_id'] = company_response.json()['id']
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
                files={'file': (file_name, file_content, 'image/jpeg')}
            )

        assert response.status_code == 201
