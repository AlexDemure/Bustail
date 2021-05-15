import os
from pydantic import BaseSettings
from decimal import Decimal


class BillingSettings(BaseSettings):

    YANDEX_KASSA_ID = os.environ.get('YANDEX_KASSA_ID', "779715")
    YANDEX_KASSA_SECRET = os.environ.get('YANDEX_KASSA_SECRET', "test_flrVnF0TXpmlBFxsfWBp0GHjMbWcEWfR98-QPvhwTsA")

    DEFAULT_COMMISSION_IN_PERCENT = Decimal("0.05")
    DEFAULT_COMMISSION_IN_RUBLS = Decimal("250")
    DEFAULT_DEBT_LIMIT_FOR_DRIVER_IN_RUBLS = Decimal("1500")
    DEFAULT_DEBT_LIMIT_FOR_COMPANY_IN_RUBLS = Decimal("7500")
