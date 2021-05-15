from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account

from backend.apps.drivers.logic import (
    delete_transport as logic_delete_transport,
    get_transport_by_company_id,
)

from backend.apps.company.logic import (
    get_company_by_account_id,
    create_company as logic_create_company,
    get_company_by_url as logic_get_company_by_url,
    change_company_data as logic_change_company_data,
    get_company as logic_get_company
)
from backend.schemas.drivers import CompanyData, CompanyBase, CompanyCreate, CompanyUpdate
from backend.enums.system import SystemLogs
from backend.enums.company import CompanyErrors
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message

router = APIRouter()


@router.delete(
    "/transports/{transport_id}/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_deleted.value},
        status.HTTP_400_BAD_REQUEST: {"description": CompanyErrors.car_not_belong_to_company.value},
        **auth_responses
    }
)
async def delete_transport(transport_id: int, account: Account = Depends(confirmed_account)) -> Message:
    """Удаление транспорта компании."""

    company = await get_company_by_account_id(account.id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    transport = await get_transport_by_company_id(transport_id, company.id)
    if not transport:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=CompanyErrors.car_not_belong_to_company.value
        )

    try:
        await logic_delete_transport(transport.id)
    except AssertionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return Message(msg=BaseMessage.obj_is_deleted.value)


@router.get(
    "/me/",
    response_model=CompanyData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def read_company_me(account: Account = Depends(confirmed_account)) -> CompanyData:
    """
    Карточка компании.

    - **returned**: Возвращает карточку компании со списком транспортов, обложек к ним.
    """
    logger = get_logger().bind(account_id=account.id)
    company = await get_company_by_account_id(account.id)
    if not company:
        logger.debug(SystemLogs.company_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return company


@router.post(
    "/",
    response_model=CompanyData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_already_exist.value},
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        **auth_responses
    }
)
async def create_company(payload: CompanyBase, account: Account = Depends(confirmed_account)) -> JSONResponse:
    """Создание карточки компании."""
    company = await get_company_by_account_id(account.id)
    if company:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(company)
        )

    create_schema = CompanyCreate(
        account_id=account.id,
        **payload.dict()
    )
    try:
        company = await logic_create_company(create_schema)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(company)
    )


@router.get(
    "/pages/{page_url}/",
    response_model=CompanyData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def get_company_by_url(page_url: str, account: Account = Depends(confirmed_account)) -> CompanyData:
    """Получение карточки компании по поиской строке."""
    logger = get_logger().bind(account_id=account.id, page_url=page_url)

    company = await logic_get_company_by_url(page_url)
    if not company:
        logger.debug(SystemLogs.company_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return company


@router.get(
    "/{company_id}/",
    response_model=CompanyData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def get_company(company_id: int, account: Account = Depends(confirmed_account)) -> CompanyData:
    """Получение карточки компании по поиской строке."""
    logger = get_logger().bind(account_id=account.id, company_id=company_id)

    company = await logic_get_company(company_id)
    if not company:
        logger.debug(SystemLogs.company_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return company


@router.put(
    "/",
    response_model=CompanyData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {"description": CompanyErrors.user_not_belong_to_company.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def change_company_data(
        payload: CompanyUpdate,
        account: Account = Depends(confirmed_account)
) -> CompanyData:
    """Изменение данных в карточке транспорта."""
    company = await get_company_by_account_id(account.id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    try:
        company = await logic_change_company_data(company, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return company
