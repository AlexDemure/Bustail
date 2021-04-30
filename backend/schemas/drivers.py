from decimal import Decimal
from enum import Enum
from typing import List

from pydantic import BaseModel, validator, constr, conint

from backend.enums.drivers import TransportType
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
    count_seats: conint(ge=0, lt=5000) = 1
    price: conint(ge=0, lt=1000000) = 0
    city: constr(min_length=1, max_length=255)
    state_number: constr(min_length=3, max_length=32)
    description: constr(min_length=1, max_length=1024) = None
    transport_type: TransportType

    @validator('city')
    def check_values(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value


class TransportUpdate(BaseModel):
    description: constr(min_length=1, max_length=1024) = None
    price: conint(ge=0, lt=1000000) = 0


class TransportCreate(TransportBase):
    driver_id: int


class TransportData(TransportBase):
    id: int
    driver_id: int
    transport_type: TransportType
    transport_covers: list = []


class ListTransports(BaseModel):
    total_rows: int
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
