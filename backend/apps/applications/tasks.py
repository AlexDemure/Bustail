from structlog import get_logger
from tortoise.transactions import in_transaction

from backend.apps.applications.crud import application as application_crud
from backend.apps.billing.utils import add_amount_to_current_value
from backend.apps.company.crud import company as company_crud
from backend.apps.company.logic import get_company
from backend.apps.drivers.crud import driver as driver_crud
from backend.apps.drivers.logic import get_driver
from backend.core.config import settings
from backend.enums.applications import ApplicationStatus
from backend.submodules.common.schemas import UpdatedBase

logger = get_logger()


async def expire_applications():
    """Перевод заявок в истеченные"""
    async with in_transaction():
        applications = await application_crud.expired_applications()
        logger.debug("Scheduler 'expire application' event", count_applications=len(applications))

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.expired)
            )
            await application_crud.update(app_up)
            logger.debug("Application is expired", application_id=application.id)


async def in_progress_applications():
    """Перевод заявок из подтвержденных в процессе"""
    async with in_transaction():
        applications = await application_crud.confirmed_applications()
        logger.debug("Scheduler 'in progress application' event", count_applications=len(applications))

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.progress)
            )
            await application_crud.update(app_up)
            logger.debug("Application in progress", application_id=application.id)


async def completed_applications():
    """Перевод заявок из в процессе в завершенные."""
    async with in_transaction():
        applications = await application_crud.completed_applications()
        logger.debug("Scheduler 'completed application' event", count_applications=len(applications))

        for application in applications:
            app_up = UpdatedBase(
                id=application.id,
                updated_fields=dict(application_status=ApplicationStatus.completed)
            )
            await application_crud.update(app_up)
            logger.debug("Application in completed", application_id=application.id)

            if application.driver_id:
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
                logger.debug("Driver completed application", application_id=application.id, driver_id=driver.id)

            elif application.company_id:
                company = await get_company(application.company_id)
                if not company:
                    continue

                company_up = UpdatedBase(
                    id=company.id,
                    updated_fields=dict(
                        total_amount=add_amount_to_current_value(company.total_amount, application.price),
                        debt=add_amount_to_current_value(company.debt, settings.DEFAULT_COMMISSION_IN_RUBLS)
                    )
                )
                await company_crud.update(company_up)
                logger.debug("Company completed application", application_id=application.id, company_id=company.id)
