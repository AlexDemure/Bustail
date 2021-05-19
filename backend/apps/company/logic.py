from typing import Optional

from structlog import get_logger
from backend.core.config import settings
from backend.apps.drivers.models import Company
from backend.apps.company.crud import company as company_crud
from backend.apps.drivers.serializer import prepare_transport_with_photos
from backend.apps.company.serializer import prepare_company_data
from backend.enums.system import SystemLogs
from backend.enums.company import CompanyErrors
from backend.schemas.drivers import CompanyData, CompanyCreate, CompanyUpdate
from backend.submodules.common.schemas import UpdatedBase
from backend.submodules.common.enums import BaseSystemErrors


async def get_company(company_id: int) -> Optional[CompanyData]:
    company = await company_crud.get(company_id)
    if not company:
        return None

    transports = [
        prepare_transport_with_photos(x) for x in company.transports
    ]

    return prepare_company_data(company, transports)


async def get_company_by_account_id(account_id: int) -> Optional[CompanyData]:
    """Получение карточки компании вместе с его транспортами, обложками и уведомлениями."""
    company = await company_crud.find_by_account_id(account_id)
    if not company:
        return None

    transports = [
        prepare_transport_with_photos(x) for x in company.transports
    ]

    return prepare_company_data(company, transports)


async def get_company_by_url(page_url: str) -> Optional[CompanyData]:
    """Получение карточки компании вместе с его транспортами, обложками и уведомлениями."""
    company = await company_crud.find_by_url(page_url)
    if not company:
        return None

    transports = [
        prepare_transport_with_photos(x) for x in company.transports
    ]

    return prepare_company_data(company, transports)


async def create_company(company_in: CompanyCreate) -> CompanyData:
    """Создание карточки компании."""
    logger = get_logger().bind(payload=company_in.dict())
    assert isinstance(company_in, CompanyCreate), BaseSystemErrors.schema_wrong_format.value

    company = await company_crud.find_by_params(
        inn=company_in.inn,
        ogrn=company_in.ogrn,
        license_number=company_in.license_number,
    )
    if company:
        logger.debug(SystemLogs.company_already_exist.value)
        check_not_unique_field(company, company_in)

    company = await company_crud.create(company_in)
    logger.debug(SystemLogs.company_is_created.value, company_id=company.id)
    return prepare_company_data(company)


def check_not_unique_field(company: Company, schema):
    check_values = ["inn", "ogrn", "license_number", "page_url"]
    for value in check_values:
        if getattr(company, value) == getattr(schema, value, None):
            if value == "inn":
                raise ValueError(CompanyErrors.inn_is_already.value)
            elif value == "ogrn":
                raise ValueError(CompanyErrors.ogrn_is_already.value)
            elif value == "license_number":
                raise ValueError(CompanyErrors.license_number_is_already.value)
            elif value == "page_url":
                raise ValueError(CompanyErrors.page_url_is_already.value)


async def change_company_data(company: CompanyData, company_up: CompanyUpdate) -> CompanyData:
    """Обновление карточки компании."""
    logger = get_logger().bind(company_id=company.id, payload=company_up.dict())
    assert isinstance(company_up, CompanyUpdate), BaseSystemErrors.schema_wrong_format.value

    is_company = await company_crud.find_by_url(company_up.page_url)
    if is_company and is_company.id != company.id:
        logger.debug(SystemLogs.company_already_exist.value)
        raise ValueError(CompanyErrors.page_url_is_already.value)

    update_schema = UpdatedBase(
        id=company.id,
        updated_fields=company_up.dict()
    )
    await company_crud.update(update_schema)
    logger.debug(SystemLogs.company_is_updated.value)

    return await get_company(company.id)


async def update_company(company_up: UpdatedBase) -> CompanyData:
    logger = get_logger().bind(payload=company_up.dict(), company_id=company_up.id)
    assert isinstance(company_up, UpdatedBase), BaseSystemErrors.schema_wrong_format.value

    await company_crud.update(company_up)
    logger.debug(SystemLogs.company_is_updated.value)

    return await get_company(company_up.id)


def is_company_debt_exceeded(company: CompanyData):
    return True if company.debt >= settings.DEFAULT_DEBT_LIMIT_FOR_COMPANY_IN_RUBLS else False
