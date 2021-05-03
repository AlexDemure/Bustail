from typing import Optional

from tortoise.query_utils import Q, Prefetch

from backend.apps.applications.models import Application
from backend.apps.drivers.models import Transport, TransportPhoto
from backend.apps.notifications.models import Notification
from backend.enums.notifications import NotificationTypes
from backend.schemas.notifications import NotificationCreate
from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase


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

    async def get_me_notifications(self, applications_id: list, transports_id: list) -> tuple:
        filters = list()

        if len(applications_id) > 0:
            filters.append(
                Q(application_id__in=applications_id)
            )

        if len(transports_id) > 0:
            filters.append(
                Q(transport_id__in=transports_id)
            )

        rows = await (
            self.model.filter(
                Q(decision__isnull=True),
                Q(
                    *filters, join_type="OR"
                )
            ).all()
            .prefetch_related(
                Prefetch(
                    'transport',
                    queryset=(
                        Transport.all().prefetch_related(
                            Prefetch(
                                'transport_covers',
                                queryset=TransportPhoto.all()
                            )
                        )
                    )
                ),
            )
            .prefetch_related(
                Prefetch(
                    'application',
                    queryset=Application.all()
                ),
            )
        )

        return rows, len(rows)


notification = CRUDNotification(Notification)

