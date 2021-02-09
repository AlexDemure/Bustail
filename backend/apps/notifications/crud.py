from typing import Optional

from tortoise.query_utils import Q

from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase
from backend.enums.notifications import NotificationTypes
from backend.apps.notifications.models import Notification
from backend.schemas.notifications import NotificationCreate


class CRUDNotification(CRUDBase[Notification, NotificationCreate, UpdatedBase]):

    async def find_notification_without_decision(
            self, application_id: int, transport_id: int, notification_type: NotificationTypes
    ) -> Optional[Notification]:
        return await self.model.get_or_none(
            Q(
                Q(application_id=application_id),
                Q(transport_id=transport_id),
                Q(notification_type=notification_type),
                Q(decision__isnull=True), join_type="AND"
            )
        )


notification = CRUDNotification(Notification)

