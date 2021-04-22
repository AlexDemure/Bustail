from tortoise.transactions import in_transaction

from backend.apps.applications.crud import application as application_crud
from backend.apps.billing.utils import get_commission_sum_from_application, add_amount_to_current_value
from backend.apps.drivers.crud import driver as driver_crud
from backend.apps.drivers.logic import get_driver
from backend.enums.applications import ApplicationStatus
from backend.submodules.common.schemas import UpdatedBase


async def completed_applications():
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

            commission = get_commission_sum_from_application(application.price, driver.commission)

            driver_up = UpdatedBase(
                id=driver.id,
                updated_fields=dict(
                    total_amount=add_amount_to_current_value(driver.total_amount, application.price),
                    debt=add_amount_to_current_value(driver.debt, commission)
                )
            )
            await driver_crud.update(driver_up)

