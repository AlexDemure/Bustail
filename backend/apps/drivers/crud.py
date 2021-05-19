from typing import Optional, List, Tuple

from tortoise.query_utils import Q, Prefetch

from backend.apps.accounts.models import Account
from backend.apps.drivers.models import Driver, Transport, TransportPhoto, Company

from backend.schemas.drivers import DriverCreate, TransportCreate, TransportPhotoCreate
from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase


class CRUDDriver(CRUDBase[Driver, DriverCreate, UpdatedBase]):

    async def get(self, driver_id: int) -> Optional[Driver]:
        return await (
            self.model.filter(id=driver_id).first()
                .prefetch_related(
                Prefetch(
                    'transports',
                    queryset=Transport.all().filter(is_active=True).prefetch_related(
                        Prefetch(
                            'transport_covers',
                            queryset=TransportPhoto.all()
                        )
                    )
                ),
                Prefetch('account', queryset=Account.all())
            )
        )

    async def find_by_account_id(self, account_id: int) -> Optional[Driver]:
        return await (
            self.model.filter(account_id=account_id).first()
            .prefetch_related(
                Prefetch(
                    'transports',
                    queryset=Transport.all().filter(is_active=True).prefetch_related(
                        Prefetch(
                            'transport_covers',
                            queryset=TransportPhoto.all()
                        )
                    )
                ),
                Prefetch('account', queryset=Account.all())
            )
        )

    async def find_by_params(self, inn: str) -> Optional[Driver]:
        return await self.model.filter(inn=inn).first()


driver = CRUDDriver(Driver)


class CRUDTransport(CRUDBase[Transport, TransportCreate, UpdatedBase]):

    async def get(self, object_id: int):
        return await (
            self.model.filter(id=object_id).first()
            .prefetch_related(
                Prefetch(
                    'transport_covers',
                    queryset=TransportPhoto.all()
                ),
                Prefetch('company', queryset=Company.all()),
                Prefetch('driver', queryset=Driver.all())
            )
        )

    async def get_by_company_id(self, transport_id: int, company_id: int):
        return await (
            self.model.get_or_none(
                Q(
                    Q(company_id=company_id), Q(transport_id=transport_id), join_type="AND"
                )
            )
        )

    async def find_by_params(self, brand: str, model: str, state_number: str) -> Optional[Transport]:
        return await self.model.get_or_none(
            Q(
                Q(brand=brand), Q(model=model), Q(state_number=state_number), Q(is_active=True), join_type="AND"
            )
        )

    async def get_driver_transports(self, driver_id: int):
        return await (
            self.model.filter(
                    Q(
                        Q(driver_id=driver_id), Q(is_active=True), join_type="AND"
                    )
            ).all()
            .prefetch_related(
                Prefetch(
                    'transport_covers',
                    queryset=TransportPhoto.all()
                )
            )
        )

    async def get_all_transports(
        self,
        limit: int = 10,
        offset: int = 0,
        transport_type: list = None,
        city: str = "",
        order_by: str = 'price',
        order_type: str = 'asc',
    ) -> Tuple[List[Transport], int]:

        filters = [Q(city__icontains=city), Q(is_active=True)]

        if transport_type:
            filters.append(
                Q(transport_type__in=transport_type)
            )

        rows = await (
            self.model.all()
            .filter(
                Q(*filters, join_type="AND")
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .limit(limit=limit)
            .offset(offset=offset)
            .prefetch_related(Prefetch('transport_covers', queryset=TransportPhoto.all()))
            .prefetch_related(Prefetch('company', queryset=Company.all()))
        )

        total_rows = await (
            self.model.all()
                .filter(
                Q(*filters, join_type="AND")
            )
            .order_by(f'{"-" if order_type == "desc" else ""}{order_by}')
            .count()
        )

        return rows, total_rows

    async def deactivate(self, object_id: int):
        object_model = await self.model.filter(id=object_id).first()
        setattr(object_model, 'is_active', False)
        await object_model.save(update_fields=["is_active"])


transport = CRUDTransport(Transport)


class CRUDTransportCovers(CRUDBase[TransportPhoto, TransportPhotoCreate, UpdatedBase]):

    async def find_transport_by_hash(self, transport_id: int, file_hash: str) -> Optional[TransportPhoto]:
        return await self.model.get_or_none(
            Q(
                Q(transport_id=transport_id), Q(file_hash=file_hash), join_type="AND"
            )
        )


transport_covers = CRUDTransportCovers(TransportPhoto)
