import os

from aiocache import Cache
from aiocache.serializers import PickleSerializer
from pydantic import BaseSettings, RedisDsn


class RedisSettings(BaseSettings):

    REDIS_HOST: str = os.environ.get("REDIS_HOST", "localhost")
    REDIS_PORT: str = os.environ.get("REDIS_PORT", "6379")
    REDIS_DB: str = os.environ.get("REDIS_DB", "0")
    REDIS_PASSWORD: str = os.environ.get("REDIS_PASSWORD", "foobared")

    def get_redis_uri(self) -> str:
        return RedisDsn.build(
            scheme="redis",
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            path=f"/{self.REDIS_DB}",
        )

    DEFAULT_CACHE_TTL = 60 * 30
    DEFAULT_CACHE_PARAMS = dict(
        cache=Cache.REDIS,
        serializer=PickleSerializer(),
        port=REDIS_PORT,
        password=REDIS_PASSWORD
    )
