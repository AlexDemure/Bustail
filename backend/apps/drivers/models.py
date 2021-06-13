from decimal import Decimal

from tortoise import models, fields

from backend.core.config import settings
from backend.enums.drivers import TransportType, CarrierType
from backend.submodules.object_storage.enums import FileMimetypes


class Company(models.Model):
    id = fields.IntField(pk=True)
    account = fields.ForeignKeyField('models.Account', related_name='company', on_delete=fields.CASCADE)
    carrie_type = fields.CharEnumField(CarrierType, max_length=64, default=CarrierType.base)

    created_at = fields.DatetimeField(auto_now_add=True)

    inn = fields.CharField(max_length=32, unique=True)
    company_name = fields.CharField(max_length=255)
    license_number = fields.CharField(max_length=64, unique=True)
    ogrn = fields.CharField(max_length=32, unique=True)

    page_url = fields.CharField(max_length=64, unique=True)
    socials = fields.JSONField(null=True)

    total_amount = fields.DecimalField(max_digits=20, decimal_places=3, default=Decimal("0"))
    debt = fields.DecimalField(max_digits=10, decimal_places=3, default=Decimal("0"))
    commission = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_COMMISSION_IN_RUBLS)
    limit = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_DEBT_LIMIT_FOR_COMPANY_IN_RUBLS)


class Driver(models.Model):
    id = fields.IntField(pk=True)
    account = fields.ForeignKeyField('models.Account', related_name='drivers', on_delete=fields.CASCADE)
    carrie_type = fields.CharEnumField(CarrierType, max_length=64, default=CarrierType.base)

    created_at = fields.DatetimeField(auto_now_add=True)

    inn = fields.CharField(max_length=32, unique=True)
    company_name = fields.CharField(max_length=255, null=True)
    license_number = fields.CharField(max_length=64, null=True)

    total_amount = fields.DecimalField(max_digits=20, decimal_places=3, default=Decimal("0"))
    debt = fields.DecimalField(max_digits=10, decimal_places=3, default=Decimal("0"))
    limit = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_DEBT_LIMIT_FOR_DRIVER_IN_RUBLS)
    commission = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_COMMISSION_IN_RUBLS)


class Transport(models.Model):
    id = fields.IntField(pk=True)
    driver = fields.ForeignKeyField('models.Driver', related_name='transports', on_delete=fields.CASCADE, null=True)
    company = fields.ForeignKeyField('models.Company', related_name='transports', on_delete=fields.CASCADE, null=True)
    brand = fields.CharField(max_length=255)
    model = fields.CharField(max_length=255)
    count_seats = fields.IntField(default=1)
    price = fields.IntField(default=0)
    city = fields.CharField(max_length=255)
    state_number = fields.CharField(max_length=16)
    description = fields.CharField(max_length=1024, null=True)
    transport_type = fields.CharEnumField(TransportType, max_length=128)
    is_active = fields.BooleanField(default=True)

    # updated_at = fields.DatetimeField(auto_now_add=True, default=datetime.utcnow())


class WithFile:
    """Миксин для файлов"""
    file_uri = fields.CharField(max_length=255)
    file_hash = fields.CharField(max_length=255)
    media_type = fields.CharEnumField(FileMimetypes, max_length=128)
    created_at = fields.DatetimeField(auto_now_add=True)


class TransportPhoto(models.Model, WithFile):
    id = fields.IntField(pk=True)
    transport = fields.ForeignKeyField('models.Transport', related_name='transport_covers', on_delete=fields.CASCADE)


class CompanyFile(models.Model):
    id = fields.IntField(pk=True)
    company = fields.ForeignKeyField('models.Company', related_name='files', on_delete=fields.CASCADE)

