from tortoise.transactions import in_transaction

from backend.core.config import settings
from backend.apps.applications.crud import application as application_crud
from backend.apps.billing.utils import add_amount_to_current_value
from backend.apps.drivers.crud import driver as driver_crud
from backend.apps.drivers.logic import get_driver
from backend.enums.applications import ApplicationStatus
from backend.submodules.common.schemas import UpdatedBase


async def in_progress_applications():
    """Перевод заявок из подтвержденных в процессе"""
    async with in_transaction():
        applications = await application_crud.confirmed_applications()

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.progress)
            )
            await application_crud.update(app_up)


async def completed_applications():
    """Перевод заявок из в процессе в завершенные."""
    async with in_transaction():
        applications = await application_crud.completed_applications()

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.completed)
            )
            await application_crud.update(app_up)

            driver = await get_driver(application.driver_id)
            if not driver:
                continue

            driver_up = UpdatedBase(
                id=driver.id,
                updated_fields=dict(
                    total_amount=add_amount_to_current_value(driver.total_amount, application.price),
                    debt=add_amount_to_current_value(driver.debt, settings.DEFAULT_COMMISSION_IN_RUBLS)
                )
            )
            await driver_crud.update(driver_up)

