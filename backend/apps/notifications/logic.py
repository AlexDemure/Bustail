from typing import Optional

from structlog import get_logger

from backend.apps.applications.logic import confirm_application
from backend.apps.applications.serializer import prepare_application
from backend.apps.drivers.serializer import prepare_transport_with_photos
from backend.apps.notifications.crud import notification as notification_crud
from backend.enums.notifications import NotificationErrors
from backend.enums.system import SystemLogs
from backend.schemas.notifications import NotificationCreate, NotificationData, MeNotifications
from backend.submodules.common.enums import BaseSystemErrors
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


async def set_decision(notification: NotificationData, decision: bool) -> None:
    logger = get_logger().bind(notification_id=notification.id, decision=decision)

    if decision is True:
        await confirm_application(notification.application_id, notification.transport_id, notification.price)

    notify_up = UpdatedBase(
        id=notification.id,
        updated_fields=dict(decision=decision)
    )
    await notification_crud.update(notify_up)
    logger.debug(SystemLogs.notification_is_updated.value, payload=notify_up.dict())


async def delete_notification(notification_id: int) -> None:
    """Удаление уведомления."""
    logger = get_logger().bind(notification_id=notification_id)
    await notification_crud.remove(notification_id)
    logger.debug(SystemLogs.notification_is_deleted.value)

    notification = await notification_crud.get(notification_id)
    assert notification is None, "Notification is not deleted"
    logger.debug(SystemLogs.notification_not_found.value)


async def get_me_notifications(applications_id: list, transports_id: list) -> MeNotifications:
    """Получение списка уведомлений по аккаунту и списку транспорта."""
    if len(applications_id) == 0 and len(transports_id) == 0:
        return MeNotifications()

    rows, count_rows = await notification_crud.get_me_notifications(applications_id, transports_id)

    for row in rows:
        row.transport = prepare_transport_with_photos(row.transport)
        row.application = prepare_application(row.application)

    return MeNotifications(
        count_notifications=count_rows,
        driver=[x for x in rows if x.transport_id in transports_id],
        client=[x for x in rows if x.application_id in applications_id],
    )
