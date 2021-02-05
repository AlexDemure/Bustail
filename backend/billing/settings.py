import os

from decimal import Decimal

YANDEX_KASSA_ID = os.environ.get('YANDEX_KASSA_ID', "779715")
YANDEX_KASSA_SECRET = os.environ.get('YANDEX_KASSA_SECRET', "test_flrVnF0TXpmlBFxsfWBp0GHjMbWcEWfR98-QPvhwTsA")

DEFAULT_COMMISSION_IN_PERCENT = Decimal("0.05")
