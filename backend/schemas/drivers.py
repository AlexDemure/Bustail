from decimal import Decimal
from enum import Enum
from typing import List

from pydantic import BaseModel, validator, constr

from backend.enums.drivers import TransportType
from backend.schemas.notifications import NotificationData
from backend.utils import get_cities
from backend.submodules.object_storage.enums import FileMimetypes


class CoverData(BaseModel):
    id: int
    file_hash: constr(min_length=1, max_length=255)
    file_uri: constr(min_length=1, max_length=255)
    media_type: Enum
    transport_id: int


class DriverBase(BaseModel):
    company_name: constr(min_length=3, max_length=255)
    inn: constr(min_length=11, max_length=12)
    license_number: constr(min_length=6, max_length=255)


class DriverCreate(DriverBase):
    account_id: int


class TransportBase(BaseModel):
    brand: constr(min_length=1, max_length=255)
    model: constr(min_length=1, max_length=255)
    count_seats: int = 1
    price: int = 0
    city: constr(min_length=1, max_length=255)
    state_number: constr(min_length=3, max_length=32)
    description: constr(min_length=1, max_length=1024) = None

    @validator('city')
    def check_values(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value


class TransportUpdate(BaseModel):
    description: constr(min_length=1, max_length=1024) = None
    price: int = 0


class TransportCreate(TransportBase):
    driver_id: int
    transport_type: TransportType


class TransportData(TransportBase):
    id: int
    driver_id: int
    transport_type: TransportType
    transport_cover: int = None
    notifications: List[NotificationData] = None


class ListTransports(BaseModel):
    transports: List[TransportData]


class TransportPhotoBase(BaseModel):
    transport_id: int
    file_uri: constr(min_length=1, max_length=255)
    file_hash: constr(min_length=1, max_length=255)
    media_type: FileMimetypes


class TransportPhotoCreate(TransportPhotoBase):
    pass


class TransportPhotoData(TransportPhotoBase):
    id: int


class DriverData(DriverBase):
    id: int
    account_id: int
    transports: List[TransportData] = []
    total_amount: Decimal
    commission: Decimal
    debt: Decimal
    limit: Decimal
