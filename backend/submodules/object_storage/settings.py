import os
from pydantic import BaseSettings


class YandexObjectStorage(BaseSettings):

    YANDEX_ACCESS_KEY_ID: str = os.environ.get("YANDEX_ACCESS_KEY_ID", "NOT_SET")
    YANDEX_SECRET_ACCESS_KEY: str = os.environ.get("YANDEX_SECRET_ACCESS_KEY", "NOT_SET")
    YANDEX_BUCKET_NAME: str = os.environ.get("YANDEX_BUCKET_NAME", "bustail")

