import uvicorn
from fastapi import FastAPI
from structlog import get_logger
from backend.core.config import settings
from backend.core.urls import api_router
from backend.db.database import postgres_db_init, sqlite_db_init
from backend.mailing.service import service_mailing
from backend.permissions.fixtures import setup_permissions_and_roles
from backend.redis.service import redis

app = FastAPI()


@app.on_event("startup")
async def redis_init():
    await redis.redis_init()
    await redis.register_service(service_mailing)


@app.on_event("startup")
async def fixtures():
    if settings.ENV == "PROD":
        print("Connect to PostgreSQL DB")
        await postgres_db_init()
    else:
        print("Connect to test DB")
        await sqlite_db_init()
    await setup_permissions_and_roles()


app.include_router(api_router, prefix=settings.API_URL)


if __name__ == '__main__':
    logger = get_logger()
    # Лог со всеми настройками системы
    attrs = vars(settings)
    attrs_to_str = '\n'.join("%s: %s" % item for item in attrs.items())
    logger.info(f"SETUP ENVS:\n{attrs_to_str}")

    uvicorn.run("application:app", host="127.0.0.1", port=7040, log_level="debug")
