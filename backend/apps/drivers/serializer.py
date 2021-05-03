from typing import List

from backend.apps.drivers.models import Transport, TransportPhoto, Driver
from backend.schemas.drivers import TransportPhotoData, DriverData, TransportData
from backend.schemas.notifications import NotificationData


def prepare_driver_data(driver: Driver, transports: List[Transport]) -> DriverData:
    """
    Подготавливае данные о водителе вместе со списком транспорта и их обложек.

    Использовать только если query запрос делает prefetch transport_covers у transport иначе будет AttributeError.
    """
    serialized_transports = list()

    for transport in transports:
        serialized_transports.append(
            prepare_transport_with_photos(transport)
        )

    return DriverData(
        transports=serialized_transports,
        **driver.__dict__
    )


def prepare_transport_with_photos(transport: Transport) -> TransportData:
    return TransportData(
        transport_covers=[TransportPhotoData(**x.__dict__) for x in transport.transport_covers.related_objects],
        **transport.__dict__
    )
