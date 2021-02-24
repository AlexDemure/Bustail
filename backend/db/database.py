from tortoise import Tortoise

from backend.core.config import settings

MODELS_LIST = [
    "backend.apps.accounts.models", "backend.apps.mailing.models", "backend.apps.drivers.models",
    "backend.apps.applications.models", "backend.apps.notifications.models", "backend.apps.billing.models",
    "backend.submodules.permissions.models", "aerich.models"
]


# Необходимо для мигратора aerich
TORTOISE_ORM = {
    "connections": {"default": settings.POSTGRESQL_URI},
    "apps": {
        "models": {
            "models": MODELS_LIST,
            "default_connection": "default",
        },
    },
}


async def sqlite_db_init():
    await Tortoise.init(
        db_url=settings.SQLITE_URI,
        modules={'models': MODELS_LIST}
    )
    # Generate the schema
    await Tortoise.generate_schemas()


async def postgres_db_init():
    await Tortoise.init(
        db_url=settings.POSTGRESQL_URI,
        modules={'models': MODELS_LIST}
    )
    # Generate the schema
    await Tortoise.generate_schemas()

