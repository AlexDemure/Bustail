from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account
from backend.apps.drivers.logic import (
    get_driver_by_account_id, update_driver, get_driver as logic_get_driver,
    create_driver as logic_create_driver,
)
from backend.enums.system import SystemLogs
from backend.schemas.company import CompanyData
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message, UpdatedBase

router = APIRouter()


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
    driver = await get_driver_by_account_id(account.id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return driver


@router.get(
    "/{driver_id}/",
    response_model=DriverData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def get_driver(driver_id: int, account: Account = Depends(confirmed_account)) -> DriverData:
    """Получение карточки водителя."""
    logger = get_logger().bind(driver_id=driver_id)
    driver = await logic_get_driver(driver_id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return driver


@router.put(
    "/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def change_driver_data(payload: DriverBase, account: Account = Depends(confirmed_account)) -> Message:
    """Смена данных в карточки водителя."""
    logger = get_logger().bind(account_id=account.id, payload=payload.dict())
    driver = await get_driver_by_account_id(account.id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    update_schema = UpdatedBase(id=driver.id, updated_fields=payload.dict())
    await update_driver(update_schema)

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.post(
    "/",
    response_model=DriverData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_already_exist.value},
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        **auth_responses
    }
)
async def create_driver(payload: DriverBase, account: Account = Depends(confirmed_account)) -> JSONResponse:
    """Создание карточки водителя."""
    driver = await get_driver_by_account_id(account.id)
    if driver:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder(driver)
        )

    create_schema = DriverCreate(
        account_id=account.id,
        **payload.dict()
    )
    driver = await logic_create_driver(create_schema, account)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(driver)
    )
