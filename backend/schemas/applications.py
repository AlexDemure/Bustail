from datetime import date, datetime
from typing import List, Union

from pydantic import BaseModel, constr, validator

from backend.enums.applications import ApplicationStatus, ApplicationTypes, ApplicationErrors

from backend.utils import get_cities


class ApplicationBase(BaseModel):
    to_go_from: constr(min_length=1, max_length=255)
    to_go_to: constr(min_length=1, max_length=255) = None
    to_go_when: date
    count_seats: int = 1
    description: constr(min_length=1, max_length=1024) = None
    price: int = 0
    application_type: ApplicationTypes = ApplicationTypes.other.value
    application_status: ApplicationStatus = ApplicationStatus.waiting.value

    @validator('to_go_from', 'to_go_to')
    def check_city(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value

    @validator('to_go_when')
    def check_to_go_when_is_expired(cls, value):
        assert value >= datetime.utcnow().date(), ApplicationErrors.to_go_when_wrong_format.value
        return value


class ApplicationCreate(ApplicationBase):
    account_id: int


class ApplicationUpdate(BaseModel):
    description: constr(min_length=1, max_length=1024) = None
    price: int = 0


class ApplicationData(BaseModel):
    id: int
    account_id: int
    driver_id: int = None
    to_go_from: constr(min_length=1, max_length=255)
    to_go_to: constr(min_length=1, max_length=255) = None
    to_go_when: date
    count_seats: int = 1
    description: constr(min_length=1, max_length=1024) = None
    price: int = 0
    application_status: ApplicationStatus = ApplicationStatus.waiting.value
    created_at: datetime
    confirmed_at: datetime = None
    application_type: Union[str, ApplicationTypes]


class ListApplications(BaseModel):
    total_rows: int = None
    applications: List[ApplicationData]


class HistoryApplication(BaseModel):
    transport_id: int = None
    transport_name: str = None
    to_go_from: str
    to_go_to: str
    to_go_when: date
    price: int = 0
    application_status: ApplicationStatus
