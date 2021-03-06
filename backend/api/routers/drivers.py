from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException, File, UploadFile, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.responses import Response
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account
from backend.apps.company.logic import get_company_by_account_id
from backend.apps.drivers.logic import (
    download_transport_cover,
    get_driver_by_account_id, update_driver, get_driver as logic_get_driver,
    is_transport_belongs_carrie, upload_transport_cover,
    create_driver as logic_create_driver,
    create_transport as logic_create_transport,
    get_transports as logic_get_transports,
    get_transport as logic_get_transport,
    change_transport_data as logic_change_transport_data,
    delete_transport as logic_delete_transport,
    get_transport_cover as logic_get_transport_cover,
    transport_raise_in_search as logic_transport_raise_in_search
)
from backend.enums.drivers import DriverErrors, TransportType
from backend.enums.system import SystemLogs
from backend.schemas.drivers import (
    DriverBase, DriverCreate, DriverData,
    TransportData, TransportBase, TransportCreate, ListTransports, TransportUpdate
)
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message, UpdatedBase
from backend.submodules.object_storage.enums import UploadErrors, FileMimetypes
from backend.submodules.object_storage.settings import IMAGE_LIMIT_SIZE_TO_BYTES
from backend.submodules.object_storage.utils import check_file_type, check_file_size

router = APIRouter()


@router.post(
    "/transports/{transport_id}/covers/",
    response_model=Message,
    responses={
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {"description": UploadErrors.mime_type_is_wrong_format.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found},
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: {"description": UploadErrors.file_is_large.value},
        **auth_responses
    }
)
async def create_cover_transport(
        transport_id: int,
        files: List[UploadFile] = File(...),
        account: Account = Depends(confirmed_account),
) -> Message:
    """
    Загрузка обложки к транспорту.

    - **validation №1**: Если клиент загрузил формат не подходящего типа
     или размер файла превышает лимит в системе вернется 400.
    """
    logger = get_logger().bind(transport_id=transport_id, account_id=account.id)

    for file in files:
        # Разрешенный тип только png или jpeg
        if check_file_type(file.content_type, [FileMimetypes.png, FileMimetypes.jpeg]) is False:
            logger.debug(SystemLogs.file_is_wrong_format.value, content_type=file.content_type)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=UploadErrors.mime_type_is_wrong_format.value
            )

        # Разрешенный размер файла устанавливается в Depends/uploads.py в объекте Headers параметр lt=value_to_bytes
        if check_file_size(file.file, IMAGE_LIMIT_SIZE_TO_BYTES) is False:
            logger.debug(SystemLogs.file_is_large.value)
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=UploadErrors.file_is_large.value
            )

    carrier, transport = await is_transport_belongs_carrie(account.id, transport_id)

    for file in files:
        await upload_transport_cover(transport, file)

    return Message(msg=BaseMessage.obj_is_created.value)


@router.get(
    "/transports/{transport_id}/covers/{cover_id}",
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_400_BAD_REQUEST: {
            "description": f"{UploadErrors.file_is_large.value} or {UploadErrors.mime_type_is_wrong_format.value}"
        },
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found},
        **auth_responses
    }
)
async def get_transport_cover(transport_id: int, cover_id: int) -> Response:
    """
    Получение обложки к транспорту.
    - **returned**: Возвращает response с параметрами content, media_type.
    """
    logger = get_logger().bind(transport_id=transport_id, cover_id=cover_id)
    transport = await logic_get_transport(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    cover = await logic_get_transport_cover(cover_id)
    if not cover:
        logger.debug(SystemLogs.cover_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    if transport.id != cover.transport_id:
        logger.warning(f"{SystemLogs.violation_business_logic.value} {SystemLogs.cover_not_belong_to_transport.value}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    file_to_bytes, media_type = await download_transport_cover(cover_id)

    return Response(content=file_to_bytes, status_code=status.HTTP_200_OK, media_type=media_type)


@router.get(
    "/transports/types/",
    responses={
        status.HTTP_200_OK: {
            "description": "Getting a dict with of transport types in the system.",
            "content": {
                "application/json": {
                    "example": {
                        "car": "Автомобиль до 8 мест",
                        "minubus": "Автобус от 8 и не более 24 мест"
                    },
                }
            },
        },
    }
)
def get_transport_types() -> dict:
    """Получение списка типов заявок."""
    return TransportType.get_types()


@router.get(
    "/transports/{transport_id}/",
    response_model=TransportData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def get_transport(transport_id: int) -> TransportData:
    """
    Карточка транспорта.
    """
    logger = get_logger().bind(transport_id=transport_id)
    transport = await logic_get_transport(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    return transport


@router.put(
    "/transports/{transport_id}/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {"description": DriverErrors.car_not_belong_to_driver.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def change_transport_data(
        transport_id: int,
        payload: TransportUpdate,
        account: Account = Depends(confirmed_account)
) -> Message:
    """Изменение данных в карточке транспорта."""
    carrier, transport = await is_transport_belongs_carrie(account.id, transport_id)

    await logic_change_transport_data(transport, payload)

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.put(
    "/transports/{transport_id}/top_in_search/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {
            "description":
                f"{DriverErrors.car_not_belong_to_driver.value} or "
                f"{DriverErrors.raising_in_search_available_once_day.value}"
        },
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def transport_raise_in_search(
        transport_id: int,
        account: Account = Depends(confirmed_account)
) -> Message:
    """
    Поднятие транспорта в поиске.

    Доступно только 1 раз в день.
    """
    carrier, transport = await is_transport_belongs_carrie(account.id, transport_id)
    if transport.updated_at.date() == datetime.utcnow().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=DriverErrors.raising_in_search_available_once_day.value
        )

    await logic_transport_raise_in_search(transport)

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.delete(
    "/transports/{transport_id}/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_deleted.value},
        status.HTTP_400_BAD_REQUEST: {"description": DriverErrors.car_not_belong_to_driver.value},
        **auth_responses
    }
)
async def delete_transport(transport_id: int, account: Account = Depends(confirmed_account)) -> Message:
    """Удаление собственного транспорта."""

    carrier, transport = await is_transport_belongs_carrie(account.id, transport_id)

    try:
        await logic_delete_transport(transport.id)
    except AssertionError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Message(msg=BaseMessage.obj_is_deleted.value)


@router.post(
    "/transports/",
    response_model=TransportData,
    responses={
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {"description": BaseMessage.obj_is_not_created.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found},
        **auth_responses
    }
)
async def create_transport(payload: TransportBase, account: Account = Depends(confirmed_account)):
    """Создание карточки транспорта."""
    logger = get_logger().bind(account_id=account.id, payload=payload.dict())

    if payload.driver_id:
        driver = await get_driver_by_account_id(account.id)
        if not driver or payload.driver_id != driver.id:
            logger.debug(SystemLogs.driver_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

    if payload.company_id:
        company = await get_company_by_account_id(account.id)
        if not company or payload.company_id != company.id:
            logger.debug(SystemLogs.company_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

    create_schema = TransportCreate(**payload.dict())
    try:
        transport = await logic_create_transport(create_schema)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(transport)
    )


@router.get(
    "/transports/",
    response_model=ListTransports,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        **auth_responses
    }
)
async def get_transports(
        limit: int = 10, offset: int = 0, transport_type: List[TransportType] = Query(None),
        city: str = "", order_by: str = 'updated_at', order_type: str = 'desc'
) -> ListTransports:
    """
    Получение списка всех предложений аренды транспорта.

    - **returned**: Возвращает список транспорта без уведомлений
     т.к. эта информация доступна для всех пользователей системы.
    """

    query_params = dict(
        limit=limit, offset=offset, city=city,
        order_by=order_by, order_type=order_type,
        transport_type=transport_type,
    )
    return await logic_get_transports(**query_params)


@router.get(
    "/me/",
    response_model=DriverData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def read_driver_me(account: Account = Depends(confirmed_account)) -> DriverData:
    """
    Карточка водителя.

    - **returned**: Возвращает карточка водителя со списком транспортов, обложек к ним.
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
async def get_driver(driver_id: int) -> DriverData:
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
    response_model=DriverData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def change_driver_data(payload: DriverBase, account: Account = Depends(confirmed_account)) -> DriverData:
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
    driver = await update_driver(update_schema)
    return driver


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
    try:
        driver = await logic_create_driver(create_schema)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(driver)
    )
