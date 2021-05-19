from typing import List

from backend.apps.drivers.models import Company
from backend.schemas.accounts import AccountData
from backend.schemas.drivers import CompanyData, TransportData


def prepare_company_data(company: Company, transports: List[TransportData] = None) -> CompanyData:
    return CompanyData(
        transports=transports if transports else [],
        company_phone=company.account.phone,
        account=AccountData(**company.account.__dict__),
        **company.__dict__
    )
