from datetime import datetime
from typing import List, Tuple, Optional

from tortoise.query_utils import Prefetch, Q

from backend.apps.applications.models import Application
from backend.apps.drivers.models import Transport
from backend.enums.applications import ApplicationStatus
from backend.schemas.applications import ApplicationCreate
from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase


class CRUDApplication(CRUDBase[Application, ApplicationCreate, UpdatedBase]):

    async def get_with_not_ended_status(self, object_id: int) -> Optional[Application]:
        return await self.model.get_or_none(
            id=object_id,
            application_status__not_in=ApplicationStatus.ended_status()
        )

    async def account_applications(self, account_id: int) -> List[Application]:
        return await (
            self.model.filter(
                Q(
                    Q(account_id=account_id),
                    Q(application_status__not_in=ApplicationStatus.ended_status()),
                    join_type="AND"
                )
            ).all()
        )

    async def confirmed_applications(self) -> List[Application]:
        """Заявки которые были подтверждены но у них не проставлен статус 'В процессе'."""
        return await (
            self.model.filter(
                Q(
                    Q(application_status=ApplicationStatus.confirmed),
                    Q(to_go_when__lte=datetime.utcnow().date())
                )
            ).all()
        )

    async def completed_applications(self) -> List[Application]:
        """Заявки которые были в процессе но у них не проставлен статус 'Выполнено'."""
        return await (
            self.model.filter(
                Q(
                    Q(application_status=ApplicationStatus.progress),
                    Q(to_go_when__lt=datetime.utcnow().date())
                )
            ).all()
        )

    async def expired_applications(self) -> List[Application]:
        """Заявки которые не были подтверждены но у них истекла дата исполнения."""
        return await (
            self.model.filter(
                Q(
                    Q(application_status=ApplicationStatus.waiting),
                    Q(to_go_when__gt=datetime.utcnow().date())
                )
            ).all()
        )

    async def get_history(self, account_id: int, driver_id: int = None) -> List[Application]:
        """История заявок по которым был проставлен конечный статус."""
        return await (
            self.model.filter(
                Q(
                    Q(account_id=account_id), Q(driver_id=driver_id), join_type="OR"
                ),
                Q(
                    Q(application_status__not_in=[ApplicationStatus.waiting]),
                )
            )
            .all()
            .prefetch_related(
                Prefetch(
                    'transport',
                    queryset=Transport.all()
                ),
            ).order_by("-to_go_when")
        )

    async def get_all_applications(
        self,
        limit: int = 10,
        offset: int = 0,
        application_type: list = None,
        city: str = "",
        order_by: str = 'to_go_when',
        order_type: str = 'asc',
    ) -> Tuple[List[Application], int]:

        filters_or = [Q(to_go_from__icontains=city), Q(to_go_to__icontains=city)]
        filters_req = [Q(application_status=ApplicationStatus.waiting)]

        if application_type:
            filters_req.append(
                Q(application_type__in=application_type)
            )

        rows = await (
            self.model.all()
                .filter(
                Q(*filters_or, join_type="OR"),
                Q(*filters_req),
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .limit(limit=limit)
            .offset(offset=offset)
        )

        total_rows = await (
            self.model.all()
                .filter(
                Q(*filters_or, join_type="OR"),
                Q(*filters_req)
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .count()
        )
        return rows, total_rows


application = CRUDApplication(Application)
