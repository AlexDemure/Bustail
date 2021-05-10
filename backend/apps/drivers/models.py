from tortoise import models, fields

from decimal import Decimal
from backend.enums.drivers import TransportType
from backend.submodules.object_storage.enums import FileMimetypes

from backend.core.config import settings


class Driver(models.Model):
    id = fields.IntField(pk=True)
    account = fields.ForeignKeyField('models.Account', related_name='drivers', on_delete=fields.CASCADE)
    created_at = fields.DatetimeField(auto_now_add=True)
    company_name = fields.CharField(max_length=255)
    inn = fields.CharField(max_length=32)
    license_number = fields.CharField(max_length=64, null=True)

    #PAYMENT DATA
    total_amount = fields.DecimalField(max_digits=20, decimal_places=3, default=Decimal("0"))
    debt = fields.DecimalField(max_digits=10, decimal_places=3, default=Decimal("0"))
    commission = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_COMMISSION_IN_RUBLS)
    limit = fields.DecimalField(max_digits=10, decimal_places=3, default=settings.DEFAULT_DEBT_LIMIT_IN_RUBLS)


class Transport(models.Model):
    id = fields.IntField(pk=True)
    driver = fields.ForeignKeyField('models.Driver', related_name='transports', on_delete=fields.CASCADE)
    brand = fields.CharField(max_length=255)
    model = fields.CharField(max_length=255)
    count_seats = fields.IntField(default=1)
    price = fields.IntField(default=0)
    city = fields.CharField(max_length=255)
    state_number = fields.CharField(max_length=16)
    description = fields.CharField(max_length=1024, null=True)
    transport_type = fields.CharEnumField(TransportType, max_length=128)
    is_active = fields.BooleanField(default=True)


class TransportPhoto(models.Model):
    id = fields.IntField(pk=True)
    transport = fields.ForeignKeyField('models.Transport', related_name='transport_covers', on_delete=fields.CASCADE)
    file_uri = fields.CharField(max_length=255)
    file_hash = fields.CharField(max_length=255)
    media_type = fields.CharEnumField(FileMimetypes, max_length=128)
    created_at = fields.DatetimeField(auto_now_add=True)

