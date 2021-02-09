from decimal import Decimal
from enum import Enum
from typing import List

from pydantic import BaseModel, root_validator

from backend.enums.drivers import TransportType
from backend.schemas.notifications import NotificationData
from backend.utils import get_cities
from backend.submodules.object_storage.enums import FileMimetypes


class CoverData(BaseModel):
    id: int
    file_hash: str
    file_uri: str
    media_type: Enum
    transport_id: int


class DriverBase(BaseModel):
    license_number: str = None


class DriverCreate(DriverBase):
    account_id: int
    debt: Decimal = Decimal("0")


class TransportBase(BaseModel):
    transport_type: TransportType
    brand: str
    model: str
    count_seats: int = 1
    price: int = 0
    city: str
    state_number: str

    @root_validator
    def check_values(cls, values):
        if values['city'] not in get_cities():
            raise ValueError("City is not found")

        return values


class TransportUpdate(TransportBase):
    driver_id: int


class TransportCreate(TransportBase):
    driver_id: int


class TransportData(TransportBase):
    id: int
    driver_id: int
    transport_covers: List[dict] = []
    notifications: List[NotificationData] = None


class ListTransports(BaseModel):
    transports: List[TransportData]


class TransportPhotoBase(BaseModel):
    transport_id: int
    file_uri: str
    file_hash: str
    media_type: FileMimetypes


class TransportPhotoCreate(TransportPhotoBase):
    pass


class TransportPhotoData(TransportPhotoBase):
    id: int


class DriverData(DriverBase):
    id: int
    account_id: int
    transports: List[TransportData] = None
    debt: Decimal
