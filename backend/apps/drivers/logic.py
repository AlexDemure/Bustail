from typing import Optional, Tuple, List
from uuid import uuid4

from fastapi import HTTPException, status
from fastapi import UploadFile
from structlog import get_logger

from backend.apps.drivers.crud import (
    driver as driver_crud,
    transport as transport_crud,
    transport_covers as transport_covers_crud
)
from backend.apps.drivers.models import Driver
from backend.apps.drivers.serializer import prepare_transport_with_photos, prepare_driver_data
from backend.apps.company.logic import get_company_by_account_id
from backend.core.config import settings
from backend.enums.drivers import DriverErrors
from backend.enums.system import SystemLogs, SystemEnvs
from backend.enums.company import CompanyErrors
from backend.schemas.drivers import (
    DriverCreate, DriverData, TransportData, TransportCreate, CoverData,
    ListTransports, TransportUpdate, TransportPhotoData, TransportPhotoCreate
)
from backend.submodules.common.enums import BaseMessage, BaseSystemErrors
from backend.submodules.common.schemas import UpdatedBase
from backend.submodules.object_storage.enums import FileStorages, FileMimetypes
from backend.submodules.object_storage.uploader import object_storage
from backend.submodules.object_storage.utils import get_file_hash, compression_image


async def create_driver(driver_in: DriverCreate) -> DriverData:
    """Создание карточки водителя."""
    logger = get_logger().bind(payload=driver_in.dict())
    assert isinstance(driver_in, DriverCreate), BaseSystemErrors.schema_wrong_format.value

    driver = await driver_crud.find_by_params(driver_in.inn)
    if driver:
        raise ValueError(DriverErrors.inn_is_already.value)

    driver = await driver_crud.create(driver_in)
    logger.debug(SystemLogs.driver_is_created.value, driver_id=driver.id)
    return await get_driver(driver.id)


async def get_driver_by_account_id(account_id: int) -> Optional[DriverData]:
    """Получение карточки водителя вместе с его транспортами, обложками и уведомлениями."""
    driver = await driver_crud.find_by_account_id(account_id)
    if not driver:
        return None

    transports = [
        prepare_transport_with_photos(x) for x in driver.transports
    ]

    return prepare_driver_data(driver, transports)


async def update_driver(driver_up: UpdatedBase) -> DriverData:
    logger = get_logger().bind(payload=driver_up.dict(), driver_id=driver_up.id)
    assert isinstance(driver_up, UpdatedBase), BaseSystemErrors.schema_wrong_format.value
    await driver_crud.update(driver_up)
    logger.debug(SystemLogs.driver_is_updated.value)

    return await get_driver(driver_up.id)


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
    return prepare_transport_with_photos(transport) if transport else None


async def change_transport_data(transport: TransportData, transport_up: TransportUpdate) -> None:
    """Обновление карточки транспорта."""
    logger = get_logger().bind(transport_id=transport.id, payload=transport_up.dict())

    assert isinstance(transport_up, TransportUpdate), BaseSystemErrors.schema_wrong_format.value

    update_schema = UpdatedBase(
        id=transport.id,
        updated_fields=transport_up.dict()
    )
    await transport_crud.update(update_schema)
    logger.debug(SystemLogs.transport_is_updated.value)


async def get_transports(**kwargs) -> ListTransports:
    """Получение списка всех предложений аренды транспорта."""
    transports, total_rows = await transport_crud.get_all_transports(**kwargs)
    return ListTransports(
        total_rows=total_rows,
        transports=[prepare_transport_with_photos(x) for x in transports]
    )


async def delete_transport(transport_id: int) -> None:
    logger = get_logger().bind(transport_id=transport_id)
    await transport_crud.deactivate(transport_id)
    logger.debug(SystemLogs.transport_is_deleted.value)


async def upload_transport_cover(transport: TransportData, file: UploadFile) -> TransportPhotoData:
    """Загрузка обложки к транспорту через бакет."""
    logger = get_logger().bind(transport_id=transport.id)

    file_hash = get_file_hash(file.file)  # Получение хеша файла с передачей SpooledTempFile.
    file_media_type = FileMimetypes(file.content_type)

    # Попытка найти файл в БД по хешу и айди транспорта
    file_object = await transport_covers_crud.find_transport_by_hash(transport.id, file_hash)
    if file_object:
        return TransportPhotoData(**file_object.__dict__)

    # Путь где файл будет храниться covers/uuid.file_format
    file_uri = f"{FileStorages.covers.path}{str(uuid4())}{file_media_type.file_format}"

    compression_file = compression_image(file.file, file_media_type) # Сжатие изображения

    # Загрузка файла в облако.
    if settings.ENV == SystemEnvs.dev.value:
        object_storage.upload(
            file_content=compression_file,
            content_type=file.content_type,
            file_url=file_uri
        )
        logger.debug(SystemLogs.cover_is_uploaded.value, file_uri=file_uri)
    else:
        # Загрузка файла в ОС
        import os
        if not os.path.exists(FileStorages.covers.path):
            os.makedirs(FileStorages.covers.path)

        with open(file_uri, "wb") as file:
            file.write(compression_file)

        logger.warning(f"{SystemLogs.ignore_business_logic} Upload file to object storage skipped.")

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

    if settings.ENV == SystemEnvs.prod.value:
        file_content = object_storage.download(transport_cover.file_uri)
    else:
        with open(transport_cover.file_uri, 'rb') as file:
            file_content = file.read()

    return file_content, transport_cover.media_type.value


async def is_transport_belongs_carrie(account_id: int, transport_id: int) -> tuple:
    """Проверка принадлежности водителя к транспорту."""
    logger = get_logger().bind(account_id=account_id, transport_id=transport_id)
    transport = await get_transport(transport_id)
    if not transport:
        logger.debug(SystemLogs.transport_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    if transport.driver_id:
        driver = await get_driver_by_account_id(account_id)
        if not driver:
            logger.debug(SystemLogs.driver_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

        # Если транспорт не принадлежит данному водителю.
        if transport.driver_id != driver.id:
            logger.warning(
                f"{SystemLogs.violation_business_logic} {SystemLogs.transport_not_belong_to_driver.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DriverErrors.car_not_belong_to_driver.value
            )

        return driver, transport
    else:
        company = await get_company_by_account_id(account_id)
        if not company:
            logger.debug(SystemLogs.company_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

            # Если транспорт не принадлежит данному водителю.
        if transport.company_id != company.id:
            logger.warning(
                f"{SystemLogs.violation_business_logic} {SystemLogs.transport_not_belong_to_company.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=CompanyErrors.car_not_belong_to_company.value
            )

        return company, transport


def is_driver_debt_exceeded(driver: DriverData):
    return True if driver.debt >= settings.DEFAULT_DEBT_LIMIT_FOR_DRIVER_IN_RUBLS else False


async def get_driver(driver_id: int) -> Optional[DriverData]:
    driver = await driver_crud.get(driver_id)

    transports = [prepare_transport_with_photos(x) for x in driver.transports.related_objects]
    return prepare_driver_data(driver, transports) if driver else None


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


async def get_transport_with_covers(driver: Driver) -> List[TransportData]:
    """Получение списка транспорта с уведомлениями и обложками."""
    transports = await transport_crud.get_driver_transports(driver.id)
    return [
        prepare_transport_with_photos(x) for x in transports
    ]


async def get_transport_by_company_id(transport_id: int, company_id: int) -> Optional[TransportData]:
    """Получение карточки транспорта по айди-компании и айди транспорта"""
    transport = await transport_crud.get_by_company_id(transport_id, company_id)
    return prepare_transport_with_photos(transport) if transport else None
