from datetime import datetime
from typing import List, Tuple

from tortoise.query_utils import Prefetch, Q

from backend.apps.applications.models import Application
from backend.apps.notifications.models import Notification
from backend.enums.applications import ApplicationStatus
from backend.schemas.applications import ApplicationCreate
from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase


class CRUDApplication(CRUDBase[Application, ApplicationCreate, UpdatedBase]):

    async def account_applications(self, account_id: int) -> List[Application]:
        return await (
            self.model.filter(account_id=account_id).all()
            .prefetch_related(
                Prefetch(
                    'notifications',
                    queryset=Notification.filter(decision__isnull=True).all()
                ),
            )
        )

    async def completed_applications(self) -> List[Application]:
        """Заявки которые были подтверждены но у них не проставлен статус 'Выполнено'."""
        return await (
            self.model.filter(
                Q(
                    Q(application_status=ApplicationStatus.confirmed),
                    Q(to_go_when__lt=datetime.utcnow().date())
                )
            ).all()
        )

    async def driver_applications(self, driver_id: int) -> List[Application]:
        return await self.model.filter(driver_id=driver_id).all()

    async def get_all_applications(
        self,
        limit: int = 10,
        offset: int = 0,
        city: str = "",
        order_by: str = 'to_go_when',
        order_type: str = 'asc',
    ) -> Tuple[List[Application], int]:
        rows = await (
            self.model.all()
                .filter(
                Q(
                    Q(to_go_from__icontains=city),
                    Q(to_go_to__icontains=city),
                    join_type="OR"
                )
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .limit(limit=limit)
            .offset(offset=offset)
        )
        total_rows = await (
            self.model.all()
                .filter(
                Q(
                    Q(to_go_from__icontains=city),
                    Q(to_go_to__icontains=city),
                    join_type="OR"
                )
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .count()
        )
        return rows, total_rows


application = CRUDApplication(Application)
