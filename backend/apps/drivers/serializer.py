from typing import List

from backend.apps.drivers.models import Transport, TransportPhoto, Driver
from backend.schemas.drivers import TransportData, DriverData
from backend.schemas.notifications import NotificationData


def prepare_driver_data(driver: Driver, transports: List[Transport]) -> DriverData:
    """
    Подготавливае данные о водителе вместе со списком транспорта и их обложек.

    Использовать только если query запрос делает prefetch transport_covers у transport иначе будет AttributeError.
    """
    serialized_transports = list()

    for transport in transports:
        serialized_transports.append(
            prepare_transport_with_photos(transport, transport.transport_covers.related_objects)
        )

    return DriverData(
        transports=serialized_transports,
        **driver.__dict__
    )


def prepare_transport_with_photos(transport: Transport, photos: List[TransportPhoto]) -> TransportData:
    return TransportData(
        transport_cover=photos[-1].id if len(photos) > 0 else None,
        **transport.__dict__
    )


def prepare_transport_with_notifications_and_photos(
        transport: Transport,
        photos: List[TransportPhoto],
        notifications: list
) -> TransportData:
    return TransportData(
        transport_cover=photos[-1].id if len(photos) > 0 else None,
        notifications=[NotificationData(**x.__dict__) for x in notifications],
        **transport.__dict__
    )
