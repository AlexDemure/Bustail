from typing import Optional

from tortoise.query_utils import Prefetch, Q

from backend.apps.accounts.models import Account
from backend.apps.drivers.models import Transport, TransportPhoto, Company
from backend.schemas.drivers import CompanyCreate
from backend.submodules.common.crud import CRUDBase
from backend.submodules.common.schemas import UpdatedBase


class CRUDCompany(CRUDBase[Company, CompanyCreate, UpdatedBase]):

    async def get(self, company_id: int) -> Optional[Company]:
        return await (
            self.model.filter(id=company_id).first()
                .prefetch_related(
                Prefetch(
                    'transports',
                    queryset=Transport.all().filter(is_active=True).prefetch_related(
                        Prefetch(
                            'transport_covers',
                            queryset=TransportPhoto.all()
                        ),
                        Prefetch('company', queryset=Company.all()),
                    )
                ),
                Prefetch('account', queryset=Account.all())
            )
        )

    async def find_by_account_id(self, account_id: int) -> Optional[Company]:
        return await (
            self.model.filter(account_id=account_id).first()
            .prefetch_related(
                Prefetch(
                    'transports',
                    queryset=Transport.all().filter(is_active=True).prefetch_related(
                        Prefetch(
                            'transport_covers',
                            queryset=TransportPhoto.all()
                        ),
                        Prefetch('company', queryset=Company.all()),
                    )
                ),
                Prefetch('account', queryset=Account.all())
            )
        )

    async def find_by_url(self, page_url: str) -> Optional[Company]:
        return await (
            self.model.filter(page_url=page_url).first()
                .prefetch_related(
                Prefetch(
                    'transports',
                    queryset=Transport.all().filter(is_active=True).prefetch_related(
                        Prefetch(
                            'transport_covers',
                            queryset=TransportPhoto.all()
                        ),
                        Prefetch('company', queryset=Company.all()),
                    )
                ),
                Prefetch('account', queryset=Account.all())
            )
        )

    async def find_by_params(
        self, inn: str, ogrn: str, license_number: str, page_url: str = None
    ) -> Optional[Company]:
        filers = [
            Q(inn=inn), Q(ogrn=ogrn), Q(license_number=license_number),
        ]

        if page_url:
            filers.append(Q(page_url=page_url))

        return await self.model.filter(Q(*filers, join_type="OR")).first()


company = CRUDCompany(Company)
