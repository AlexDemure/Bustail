from decimal import Decimal

from fastapi import APIRouter, Depends, status, HTTPException, File, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.api.deps.uploads import valid_image_content_length
from backend.apps.accounts.models import Account
from backend.apps.drivers.logic import (
    get_driver_by_account_id, update_driver, download_transport_cover,
    get_driver as logic_get_driver,
    is_transport_belongs_driver, upload_transport_cover,
    create_driver as logic_create_driver,
    create_transport as logic_create_transport,
    get_transports as logic_get_transports,
    get_transport as logic_get_transport,
    change_transport_data as logic_change_transport_data,
    delete_transport as logic_delete_transport,
    get_transport_cover as logic_get_transport_cover,
)
from backend.enums.drivers import DriverErrors
from backend.enums.system import SystemLogs
from backend.schemas.drivers import (
    DriverBase, DriverCreate, DriverData,
    TransportData, TransportBase, TransportCreate, ListTransports, TransportUpdate,
    TransportPhotoData
)
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message, UpdatedBase
from backend.submodules.object_storage.enums import UploadErrors, FileMimetypes
from backend.submodules.object_storage.utils import check_file_type, check_file_size

router = APIRouter()


@router.post(
    "/transports/{transport_id}/covers/",
    response_model=TransportPhotoData,
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
        file: UploadFile = File(...),
        file_size_to_mb: Decimal = Depends(valid_image_content_length),
        account: Account = Depends(confirmed_account),
) -> JSONResponse:
    """
    Загрузка обложки к транспорту.

    - **validation №1**: Если клиент загрузил формат не подходящего типа
     или размер файла превышает лимит в системе вернется 400.
    """
    logger = get_logger().bind(transport_id=transport_id, account_id=account.id)

    # Разрешенный тип только png или jpeg
    if check_file_type(file.content_type, [FileMimetypes.png, FileMimetypes.jpeg]) is False:
        logger.debug(SystemLogs.file_is_wrong_format.value, content_type=file.content_type)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=UploadErrors.mime_type_is_wrong_format.value
        )

    # Разрешенный размер файла устанавливается в Depends/uploads.py в объекте Headers параметр lt=value_to_bytes
    if check_file_size(file.file, file_size_to_mb) is False:
        logger.debug(SystemLogs.file_is_large.value)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=UploadErrors.file_is_large.value
        )

    driver, transport = await is_transport_belongs_driver(account.id, transport_id)

    cover = await upload_transport_cover(transport, file)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(cover)
    )


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

    - **returned**: Возвращает транспорт без уведомлений т.к. эта картачка доступна для всех пользователей системы.
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
        payload: TransportBase,
        account: Account = Depends(confirmed_account)
) -> Message:
    """Изменение данных в карточке транспорта."""
    driver, transport = await is_transport_belongs_driver(account.id, transport_id)

    transport_up = TransportUpdate(driver_id=driver.id, **payload.dict())
    await logic_change_transport_data(transport, transport_up)

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

    driver, transport = await is_transport_belongs_driver(account.id, transport_id)

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

    driver = await get_driver_by_account_id(account.id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    create_schema = TransportCreate(driver_id=driver.id, **payload.dict())
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
        limit: int = 10, offset: int = 0,
        city: str = "", order_by: str = 'price', order_type: str = 'asc'
) -> ListTransports:
    """
    Получение списка всех предложений аренды транспорта.

    - **returned**: Возвращает список транспорта без уведомлений
     т.к. эта информация доступна для всех пользователей системы.
    """

    query_params = dict(
        limit=limit, offset=offset, city=city,
        order_by=order_by, order_type=order_type
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

    - **returned**: Возвращает карточка водителя со списком транспортов, обложек к ним и уведомлениями.
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
        license_number=payload.license_number
    )
    driver = await logic_create_driver(create_schema, account)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(driver)
    )
