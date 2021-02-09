from typing import Optional

from structlog import get_logger

from backend.apps.applications.logic import confirm_application
from backend.apps.drivers.logic import get_driver_by_transport_id
from backend.apps.notifications.crud import notification as notification_crud
from backend.enums.logs import SystemLogs
from backend.enums.notifications import NotificationErrors
from backend.schemas.notifications import NotificationCreate, NotificationData
from backend.submodules.common.enums import BaseSystemErrors, BaseMessage
from backend.submodules.common.schemas import UpdatedBase


async def create_notification(notification_in: NotificationCreate) -> NotificationData:
    logger = get_logger().bind(payload=notification_in.dict())
    assert isinstance(notification_in, NotificationCreate), BaseSystemErrors.schema_wrong_format.value

    notification = await notification_crud.find_notification_without_decision(
        notification_in.application_id, notification_in.transport_id, notification_in.notification_type
    )
    if notification:
        logger.debug(SystemLogs.notification_already_exist.value)
        raise ValueError(NotificationErrors.duplicate_notification.value)

    notification = await notification_crud.create(notification_in)
    logger.debug(SystemLogs.notification_is_created.value)
    return NotificationData(**notification.__dict__)


async def get_notification(notification_id: int) -> Optional[NotificationData]:
    notification = await notification_crud.get(notification_id)
    return NotificationData(**notification.__dict__) if notification else None


async def set_decision(notification_id: int, decision: bool) -> None:
    logger = get_logger().bind(notification_id=notification_id, decision=decision)
    notification = await get_notification(notification_id)
    if not notification:
        logger.debug(SystemLogs.notification_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    if decision is True:
        driver = await get_driver_by_transport_id(notification.transport_id)
        if not driver:
            logger.warning(
                f"{SystemLogs.violation_business_logic.value} "
                f"{SystemLogs.driver_not_found.value}"
            )
            raise ValueError(BaseMessage.obj_is_not_found.value)

        await confirm_application(notification.application_id, notification.transport_id, driver.id, notification.price)

    notify_up = UpdatedBase(
        id=notification.id,
        updated_fields=dict(decision=decision)
    )
    await notification_crud.update(notify_up)
    logger.debug(SystemLogs.notification_is_updated.value, payload=notify_up.dict())

    notification = await get_notification(notification_id)
    assert notification.decision == decision, "Decision is not set"


async def delete_notification(notification_id: int) -> None:
    """Удаление уведомления."""
    logger = get_logger().bind(notification_id=notification_id)
    await notification_crud.remove(notification_id)
    logger.debug(SystemLogs.notification_is_deleted.value)

    notification = await notification_crud.get(notification_id)
    assert notification is None, "Notification is not deleted"
    logger.debug(SystemLogs.notification_not_found.value)
