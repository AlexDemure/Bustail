import os
import secrets

from backend.apps.billing.settings import BillingSettings
from backend.apps.mailing.settings import MailingSettings
from backend.db.settings import PostgresDBSettings, SQLiteDBSettings
from backend.submodules.object_storage.settings import YandexObjectStorage
from backend.submodules.auth.settings import AuthSettings
from backend.submodules.security.settings import SecuritySettings
from backend.submodules.redis.settings import RedisSettings

# INCLUDE SETTINGS
configs = [
    PostgresDBSettings, SQLiteDBSettings, AuthSettings,
    YandexObjectStorage, MailingSettings, BillingSettings,
    SecuritySettings, RedisSettings
]


class Settings(*configs):
    ENV: str = os.environ.get("ENV", "DEV")
    SERVER: str = os.environ.get("SERVER", "http")
    DOMAIN: str = os.environ.get("DOMAIN", "127.0.0.1")
    API_URL: str = "/api/v1"

    SECRET_KEY: str = secrets.token_hex(16)

    class Config:
        case_sensitive = True


settings = Settings()

