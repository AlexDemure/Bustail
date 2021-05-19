from typing import List

from backend.apps.drivers.models import Transport, TransportPhoto, Driver
from backend.schemas.accounts import AccountData
from backend.schemas.drivers import TransportPhotoData, DriverData, TransportData
from backend.submodules.object_storage.uploader import object_storage


def prepare_driver_data(driver: Driver, transports: List[TransportData] = None) -> DriverData:
    return DriverData(
        transports=transports if transports else [],
        account=AccountData(**driver.account.__dict__),
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
    data = TransportPhotoData(**transport_photo.__dict__)
    data.file_uri = object_storage.get_url(data.file_uri)
    return data
