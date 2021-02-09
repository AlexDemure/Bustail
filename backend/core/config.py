import os

from backend.apps.billing.settings import BillingSettings
from backend.apps.mailing.settings import MailingSettings
from backend.db.settings import PostgresDBSettings, SQLiteDBSettings
from backend.submodules.object_storage.settings import YandexObjectStorage

# INCLUDE SETTINGS
configs = [
    PostgresDBSettings, SQLiteDBSettings,
    YandexObjectStorage, MailingSettings, BillingSettings,
]


class Settings(*configs):
    ENV: str = os.environ.get("ENV", "DEV")
    SERVER: str = os.environ.get("SERVER", "http")
    DOMAIN: str = os.environ.get("DOMAIN", "localhost")
    API_URL: str = "/api/v1"

    # openssl rand -hex 16
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "5f8d0ff68f7fb0818355a76c58418312")

    class Config:
        case_sensitive = True


settings = Settings()

