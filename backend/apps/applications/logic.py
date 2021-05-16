from datetime import datetime
from typing import Optional, List

from structlog import get_logger

from backend.apps.accounts.models import Account
from backend.apps.applications.crud import application as application_crud
from backend.apps.applications.serializer import prepare_apps_for_history_table, prepare_application
from backend.apps.drivers.logic import get_transport
from backend.enums.applications import ApplicationErrors, ApplicationStatus
from backend.enums.system import SystemLogs
from backend.schemas.applications import (
    ApplicationBase, ApplicationData, HistoryApplication,
    ApplicationCreate, ListApplications, ApplicationUpdate
)
from backend.schemas.drivers import DriverData
from backend.submodules.common.enums import BaseSystemErrors, BaseMessage
from backend.submodules.common.schemas import UpdatedBase


async def create_application(account: Account, application_in: ApplicationCreate) -> ApplicationData:
    """Создание заявки клиента."""
    logger = get_logger().bind(account_id=account.id, payload=application_in.dict())
    assert isinstance(application_in, ApplicationBase), BaseSystemErrors.schema_wrong_format.value

    application = await application_crud.create(application_in)
    logger.debug(SystemLogs.application_is_created.value)
    return prepare_application(application)


async def update_application(application_id: int, app_up: ApplicationUpdate) -> None:
    """
    Обновление данных заявки.

    Используется для обновления данных заявки прайс и описание.
    """
    logger = get_logger().bind(payload=app_up.dict(), application_id=application_id)
    application = await application_crud.get(application_id)
    if not application:
        logger.debug(SystemLogs.application_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    update_schema = UpdatedBase(
        id=application.id,
        updated_fields=app_up.dict()
    )
    await application_crud.update(update_schema)
    logger.debug(SystemLogs.application_is_updated.value)


async def get_all_applications(**kwargs) -> ListApplications:
    """Получение списка всех заявок в системе с get-параметрами."""
    applications, total_rows = await application_crud.get_all_applications(**kwargs)
    return ListApplications(
        total_rows=total_rows,
        applications=[prepare_application(x) for x in applications]
    )


async def get_account_applications(account: Account) -> ListApplications:
    """
    Получение списка заявок клиента.

    Не относится к заявкам водителя.
    """
    applications = await application_crud.account_applications(account.id)
    return ListApplications(
        applications=[prepare_application(x) for x in applications]
    )


async def get_application(application_id: int) -> Optional[ApplicationData]:
    application = await application_crud.get(application_id)
    return prepare_application(application) if application else None


async def delete_application(account: Account, application_id: int) -> None:
    """Удаление заявки только в статусе ожидания."""
    logger = get_logger().bind(account_id=account.id, application_id=application_id)
    application = await application_crud.get(application_id)
    if not application:
        logger.debug(SystemLogs.application_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    assert application.account_id == account.id, ApplicationErrors.application_does_not_belong_this_user.value
    assert application.application_status == ApplicationStatus.waiting, ApplicationErrors.application_has_ended_status.value

    await application_crud.remove(application['id'])
    logger.debug(SystemLogs.application_is_deleted.value)

    application = await application_crud.get(application_id)
    assert application is None, "Application is not deleted"
    logger.debug(SystemLogs.application_not_found.value)


async def confirm_application(application_id: int, transport_id: int, change_price: int = None) -> None:
    """Подтверждение заявки, происходит после того когда клиент или водитель приняк заявку."""
    logger = get_logger().bind(application_id=application_id, transport_id=transport_id, changed_price=change_price)

    application = await application_crud.get(application_id)
    if not application:
        logger.debug(SystemLogs.application_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    transport = await get_transport(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    app_up = UpdatedBase(
        id=application.id,
        updated_fields=dict(
            confirmed_at=datetime.utcnow(),
            company_id=transport.company_id,
            driver_id=transport.driver_id,
            transport_id=transport_id,
            price=change_price if change_price else application.price,
            application_status=ApplicationStatus.confirmed
        )
    )

    await application_crud.update(app_up)
    logger.debug(SystemLogs.application_is_updated.value, payload=app_up.dict())


async def reject_application(account: Account, application_id: int) -> None:
    """Отмена заявки."""
    logger = get_logger().bind(account_id=account.id, application_id=application_id)
    application = await application_crud.get_with_not_ended_status(application_id)
    if not application:
        logger.debug(SystemLogs.application_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    assert application.account_id == account.id, ApplicationErrors.application_does_not_belong_this_user.value
    assert application.application_status != ApplicationStatus.completed, ApplicationErrors.application_has_ended_status.value

    app_up = UpdatedBase(
        id=application.id,
        updated_fields=dict(application_status=ApplicationStatus.rejected)
    )
    await application_crud.update(app_up)
    logger.debug(SystemLogs.application_is_updated.value, payload=app_up.dict())

    application = await application_crud.get(application_id)
    assert application.application_status == ApplicationStatus.rejected, "Application is not rejected"


async def get_history_applications(account: Account, driver: DriverData = None) -> List[HistoryApplication]:
    """Получение истории по заявкам которые находятся в конечном статусе."""
    history = await application_crud.get_history(account.id, getattr(driver, 'id', None))
    return [prepare_apps_for_history_table(x) for x in history]
