from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import List
from uuid import uuid4

from pydantic import BaseModel, validator, constr, conint, root_validator

from backend.enums.drivers import TransportType
from backend.schemas.accounts import AccountData
from backend.submodules.object_storage.enums import FileMimetypes
from backend.utils import get_cities, get_cars


class CoverData(BaseModel):
    id: int
    file_hash: constr(min_length=1, max_length=255)
    file_uri: constr(min_length=1, max_length=255)
    media_type: Enum
    transport_id: int


class DriverBase(BaseModel):
    inn: constr(min_length=10, max_length=12)
    company_name: constr(min_length=3, max_length=255) = None
    license_number: constr(min_length=6, max_length=255) = None


class DriverCreate(DriverBase):
    account_id: int


class TransportBase(BaseModel):
    driver_id: int = None
    company_id: int = None

    brand: constr(min_length=1, max_length=255)
    model: constr(min_length=1, max_length=255)
    count_seats: conint(ge=0, lt=5000) = 1
    price: conint(ge=0, lt=1000000) = 0
    city: constr(min_length=1, max_length=255)
    state_number: constr(min_length=3, max_length=32)
    description: constr(min_length=1, max_length=1024) = None
    transport_type: TransportType

    @validator('city')
    def check_city(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value

    @validator('brand')
    def check_brand(cls, value):
        cars = get_cars()
        if value not in cars:
            raise ValueError("Brand is not found")

        return value

    @validator('model')
    def check_model(cls, value, values):
        cars = get_cars()
        brand = values.get("brand")
        if value not in cars[brand]:
            raise ValueError("Model is not found")

        return value

    @validator('transport_type')
    def check_transport_type(cls, value, values):
        transports = TransportType.get_passenger_transports()
        transport_type = TransportType(value)

        if transport_type in transports:
            if not transport_type.check_seats(values.get('count_seats')):
                raise ValueError("Wrong transport type")

        return value


class TransportUpdate(BaseModel):
    description: constr(min_length=1, max_length=1024) = None
    price: conint(ge=0, lt=1000000) = 0


class TransportCreate(TransportBase):
    pass


class TransportData(TransportBase):
    id: int
    company_page_url: str = None
    company_files: list = []
    transport_type: TransportType
    transport_covers: list = []
    updated_at: datetime


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
    account: AccountData
    transports: List[TransportData] = []
    total_amount: Decimal
    commission: Decimal
    debt: Decimal
    limit: Decimal


class CompanyBase(BaseModel):
    inn: constr(min_length=10, max_length=12)
    ogrn: constr(min_length=13, max_length=15)
    company_name: constr(min_length=3, max_length=255)
    license_number: constr(min_length=6, max_length=255)
    socials: dict = None
    page_url: constr(min_length=6, max_length=64) = None

    @root_validator
    def set_page_url(cls, values):
        if values.get('page_url', None) is None:
            values['page_url'] = uuid4().hex

        return values


class CompanyUpdate(CompanyBase):
    pass


class CompanyCreate(CompanyBase):
    account_id: int


class CompanyData(CompanyBase):
    id: int
    account_id: int
    account: AccountData
    company_phone: str = None
    socials: dict = None
    page_url: constr(min_length=6, max_length=64) = None

    transports: List[TransportData] = []
    company_files: list = []
    total_amount: Decimal
    commission: Decimal
    debt: Decimal
    limit: Decimal


class CompanyFileBase(BaseModel):
    company_id: int
    file_uri: constr(min_length=1, max_length=255)
    file_hash: constr(min_length=1, max_length=255)
    media_type: FileMimetypes


class CompanyFileCreate(CompanyFileBase):
    pass


class CompanyFileData(CompanyFileBase):
    id: int
