import os

from aiocache import Cache
from aiocache.serializers import PickleSerializer

REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = os.environ.get("REDIS_PORT", "6379")
REDIS_DB = os.environ.get("REDIS_DB", "0")
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD", "foobared")

DEFAULT_CACHE_TTL = 60 * 30
DEFAULT_CACHE_PARAMS = dict(
    cache=Cache.REDIS,
    serializer=PickleSerializer(),
    port=REDIS_PORT,
    password=REDIS_PASSWORD
)
