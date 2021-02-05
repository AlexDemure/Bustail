from tortoise.transactions import in_transaction

from backend.applications.crud import application as application_crud
from backend.common.schemas import UpdatedBase
from backend.enums.applications import ApplicationStatus
from backend.billing.utils import get_commission_sum_from_application, add_amount_to_debt
from backend.drivers.views import get_driver
from backend.drivers.crud import driver as driver_crud


async def completed_applications():
    async with in_transaction():
        applications = await application_crud.completed_applications()

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.completed)
            )
            await application_crud.update(app_up)

            commission = get_commission_sum_from_application(application.price)

            driver = await get_driver(application.driver_id)
            if not driver:
                continue

            driver_up = UpdatedBase(
                id=driver.id,
                updated_fields=dict(debt=add_amount_to_debt(driver.debt, commission))
            )
            await driver_crud.update(driver_up)

