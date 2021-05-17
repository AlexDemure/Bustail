from typing import List

from backend.apps.drivers.models import Transport, TransportPhoto, Driver
from backend.schemas.drivers import TransportPhotoData, DriverData, TransportData
from backend.submodules.object_storage.uploader import object_storage


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
    company_page_url = None
    company_files = []

    if transport.company_id:
        if getattr(transport.company, 'page_url', None) is not None:
            company_page_url = transport.company.page_url

    return TransportData(
        company_page_url=company_page_url,
        company_files=company_files,
        transport_covers=[prepare_transport_photo(x) for x in transport.transport_covers.related_objects],
        **transport.__dict__
    )


def prepare_transport_photo(transport_photo: TransportPhoto) -> TransportPhotoData:
    data = transport_photo.__dict__
    file_uri = object_storage.get_url(data.pop("file_uri"))
    return TransportPhotoData(
        file_uri=file_uri,
        **data
    )
