from typing import Optional, Tuple, List
from uuid import uuid4

from fastapi import HTTPException, status
from fastapi import UploadFile
from structlog import get_logger

from backend.apps.accounts.models import Account
from backend.apps.drivers.crud import (
    driver as driver_crud,
    transport as transport_crud,
    transport_covers as transport_covers_crud
)
from backend.apps.drivers.models import Driver
from backend.apps.drivers.serializer import (
    prepare_transport_with_notifications_and_photos,
    prepare_transport_with_photos,
    prepare_driver_data
)
from backend.core.config import settings
from backend.enums.drivers import DriverErrors
from backend.enums.logs import SystemLogs
from backend.schemas.drivers import (
    DriverCreate, DriverData, TransportData, TransportCreate, CoverData,
    ListTransports, TransportUpdate, TransportPhotoData, TransportPhotoCreate
)
from backend.submodules.common.enums import BaseMessage, BaseSystemErrors
from backend.submodules.common.schemas import UpdatedBase
from backend.submodules.object_storage.enums import FileStorages, FileMimetypes
from backend.submodules.object_storage.uploader import ObjectStorage
from backend.submodules.object_storage.utils import get_file_hash, compression_image

object_storage = ObjectStorage(
    settings.YANDEX_ACCESS_KEY_ID, settings.YANDEX_SECRET_ACCESS_KEY, settings.YANDEX_BUCKET_NAME
)


async def create_driver(driver_in: DriverCreate, account: Account) -> DriverData:
    """Создание карточки водителя."""
    logger = get_logger().bind(payload=driver_in.dict(), account_id=account.id)

    assert isinstance(driver_in, DriverCreate), BaseSystemErrors.schema_wrong_format.value

    driver = await get_driver_by_account_id(account.id)
    if driver:
        return driver

    driver = await driver_crud.create(driver_in)
    logger.debug(SystemLogs.driver_is_created.value, driver_id=driver.id)
    return DriverData(**driver.__dict__)


async def get_driver_by_account_id(account_id: int) -> Optional[DriverData]:
    """Получение карточки водителя вместе с его транспортами, обложками и уведомлениями."""
    driver = await driver_crud.find_by_account_id(account_id)
    if not driver:
        return None

    transports = await get_transport_with_notifications_and_covers(driver)
    return DriverData(**driver.__dict__, transports=transports)


async def update_driver(driver_up: UpdatedBase) -> None:
    logger = get_logger().bind(payload=driver_up.dict(), driver_id=driver_up.id)
    assert isinstance(driver_up, UpdatedBase), BaseSystemErrors.schema_wrong_format.value
    await driver_crud.update(driver_up)
    logger.debug(SystemLogs.driver_is_updated.value)


async def create_transport(transport_in: TransportCreate) -> TransportData:
    """Создание карточки транспорта."""
    logger = get_logger().bind(payload=transport_in.dict())
    assert isinstance(transport_in, TransportCreate), BaseSystemErrors.schema_wrong_format.value

    transport = await transport_crud.find_by_params(
        brand=transport_in.brand,
        model=transport_in.model,
        state_number=transport_in.state_number
    )
    if transport:
        logger.debug(SystemLogs.transport_already_exist.value)
        raise ValueError(DriverErrors.transport_already_exist.value)

    transport = await transport_crud.create(transport_in)
    logger.debug(SystemLogs.transport_is_created.value)
    return TransportData(**transport.__dict__)


async def get_transport(transport_id: int) -> Optional[TransportData]:
    transport = await transport_crud.get(transport_id)
    return TransportData(**transport.__dict__) if transport else None


async def change_transport_data(transport: TransportData, transport_up: TransportUpdate) -> None:
    """Обновление карточки транспорта."""
    logger = get_logger().bind(transport_id=transport.id, payload=transport_up.dict())

    assert isinstance(transport_up, TransportUpdate), BaseSystemErrors.schema_wrong_format.value

    transport_data = await transport_crud.find_by_params(
        brand=transport_up.brand,
        model=transport_up.model,
        state_number=transport_up.state_number
    )
    if transport_data:
        logger.debug(SystemLogs.transport_already_exist.value)
        raise ValueError(DriverErrors.transport_already_exist.value)

    update_schema = UpdatedBase(
        id=transport.id,
        updated_fields=transport_up.dict()
    )
    await transport_crud.update(update_schema)
    logger.debug(SystemLogs.transport_is_updated.value)


async def get_transports(**kwargs) -> ListTransports:
    """Получение списка всех предложений аренды транспорта."""
    transports = await transport_crud.get_all_transports(**kwargs)
    return ListTransports(
        transports=[prepare_transport_with_photos(x, x.transport_covers.related_objects) for x in transports]
    )


async def delete_transport(transport_id: int) -> None:
    logger = get_logger().bind(transport_id=transport_id)
    await transport_crud.remove(transport_id)
    logger.debug(SystemLogs.transport_is_deleted.value)

    transport = await transport_crud.get(transport_id)
    assert transport is None, "Transport is not deleted"
    logger.debug(SystemLogs.transport_not_found.value)


async def upload_transport_cover(transport: TransportData, file: UploadFile) -> TransportPhotoData:
    """Загрузка обложки к транспорту через бакет."""
    logger = get_logger().bind(transport_id=transport.id)

    file_hash = get_file_hash(file.file)  # Получение хеша файла с передачей SpooledTempFile.
    file_media_type = FileMimetypes(file.content_type)

    # Попытка найти файл в БД по хешу и айди транспорта
    file_object = await transport_covers_crud.find_transport_by_hash(transport.id, file_hash)
    if file_object:
        return TransportPhotoData(**file_object)

    # Путь где файл будет храниться covers/uuid.file_format
    file_uri = f"{FileStorages.covers.path}{str(uuid4())}{file_media_type.file_format}"

    compression_file = compression_image(file.file, file_media_type) # Сжатие изображения

    # Загрузка файла в облако.
    if settings.ENV == "PROD":
        object_storage.upload(
            file_content=compression_file,
            content_type=file.content_type,
            file_url=file_uri
        )
        logger.debug(SystemLogs.cover_is_uploaded.value, file_uri=file_uri)

    transport_cover_in = TransportPhotoCreate(
        transport_id=transport.id,
        file_uri=file_uri,
        file_hash=file_hash,
        media_type=file_media_type
    )

    transport_cover = await transport_covers_crud.create(transport_cover_in)
    logger.debug(SystemLogs.cover_is_created.value, cover_id=transport_cover.id)
    return TransportPhotoData(**transport_cover.__dict__)


async def get_transport_cover(transport_cover_id: int) -> Optional[CoverData]:
    cover = await transport_covers_crud.get(transport_cover_id)
    return CoverData(**cover.__dict__) if cover else None


async def download_transport_cover(transport_cover_id: int) -> Tuple[bytes, str]:
    """Получение облокжи транспорта со скачиванием обложки из бакета."""
    transport_cover = await transport_covers_crud.get(transport_cover_id)

    file_content = object_storage.download(transport_cover.file_uri)

    return file_content, transport_cover.media_type.value


async def is_transport_belongs_driver(account_id: int, transport_id: int) -> tuple:
    """Проверка принадлежности водителя к транспорту."""
    logger = get_logger().bind(account_id=account_id, transport_id=transport_id)

    driver = await get_driver_by_account_id(account_id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_created.value
        )

    transport = await get_transport(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    # Если транспорт не принадлежит данному водителю.
    if transport.driver_id != driver.id:
        logger.warning(f"{SystemLogs.violation_business_logic} {SystemLogs.transport_not_belong_to_driver.value}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=DriverErrors.car_not_belong_to_driver.value
        )

    return driver, transport


def is_driver_debt_exceeded(driver: DriverData):
    return True if driver.debt > settings.DEFAULT_DEBT_LIMIT_IN_RUBLS else False


async def get_driver(driver_id: int) -> Optional[DriverData]:
    driver = await driver_crud.get(driver_id)
    return prepare_driver_data(driver, driver.transports.related_objects) if driver else None


async def get_driver_by_transport_id(transport_id: int) -> Optional[DriverData]:
    logger = get_logger().bind(transport_id=transport_id)
    transport = await transport_crud.get(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    driver = await get_driver(transport.driver_id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise ValueError(BaseMessage.obj_is_not_found.value)

    return driver


async def get_transport_with_notifications_and_covers(driver: Driver) -> List[TransportData]:
    """Получение списка транспорта с уведомлениями и обложками."""
    transports = await transport_crud.get_transports_with_notifications(driver.id)
    return [
        prepare_transport_with_notifications_and_photos(
            x, x.transport_covers.related_objects, x.notifications.related_objects
        ) for x in transports
    ]
