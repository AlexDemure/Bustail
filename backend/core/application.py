import uvicorn
from fastapi import FastAPI
from fastapi_utils.timing import add_timing_middleware
from structlog import get_logger

from backend.apps.mailing.service import service_mailing
from backend.core import middleware
from backend.core.config import settings
from backend.core.scheduler import start
from backend.core.urls import api_router
from backend.db.database import postgres_db_init, sqlite_db_init
from backend.enums.system import SystemEnvs
from backend.submodules.permissions.fixtures import setup_permissions_and_roles
from backend.submodules.redis.service import redis
from backend.submodules.sentry.service import sentry

logger = get_logger()

app = FastAPI(
    version='2.0',
    docs_url='/api/docs',
    openapi_url='/api/openapi.json',
    middleware=middleware.utils
)
add_timing_middleware(app, record=logger.debug, prefix="app", exclude="untimed")


@app.on_event("startup")
def sentry_init():
    if settings.ENV == SystemEnvs.prod.value:
        print("Connection to Sentry...")
        sentry.senty_init(app)


@app.on_event("startup")
async def redis_init():
    print("Connection to Redis...")
    await redis.redis_init()
    await redis.register_service(service_mailing)


@app.on_event("startup")
async def fixtures():
    if settings.ENV == SystemEnvs.prod.value:
        print("Connection to PostgreSQL...")
        await postgres_db_init()
    else:
        print("Connection to SQLite3...")
        await sqlite_db_init()
    await setup_permissions_and_roles()


@app.on_event("startup")
def scheduler_init():
    print("Start scheduler...")
    start()


app.include_router(api_router, prefix=settings.API_URL)


if __name__ == '__main__':
    # Лог со всеми настройками системы
    attrs = vars(settings)
    attrs_to_str = '\n'.join("%s: %s" % item for item in attrs.items())
    logger.info(f"SETUP ENVS:\n{attrs_to_str}")

    uvicorn.run("application:app", host="127.0.0.1", port=7040, log_level="debug")
