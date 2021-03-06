from datetime import datetime
from typing import List

from pydantic import BaseModel

from backend.enums.notifications import NotificationTypes
from backend.schemas.applications import ApplicationData
from backend.schemas.drivers import TransportData


class NotificationBase(BaseModel):
    application_id: int
    transport_id: int
    notification_type: NotificationTypes
    price: int = None


class NotificationCreate(NotificationBase):
    pass


class NotificationData(NotificationBase):
    id: int
    decision: bool = None
    created_at: datetime


class NotificationDataWithRelatedObjects(BaseModel):
    id: int
    decision: bool = None
    created_at: datetime
    application: ApplicationData
    transport: TransportData
    notification_type: NotificationTypes
    price: int = None

    class Config:
        orm_mode = True


class SetDecision(BaseModel):
    notification_id: int
    decision: bool


class MeNotifications(BaseModel):
    count_notifications: int = 0
    driver: List[NotificationDataWithRelatedObjects] = []
    client: List[NotificationDataWithRelatedObjects] = []
