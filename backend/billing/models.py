from tortoise import models, fields


class PaymentOperation(models.Model):
    id = fields.IntField(pk=True)
    account = fields.ForeignKeyField('models.Account', related_name='payment_operations', on_delete=fields.CASCADE)
    status = fields.BooleanField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(null=True)
    sum = fields.DecimalField(max_digits=10, decimal_places=3)
    operation_id = fields.CharField(max_length=255)
    metadata = fields.CharField(null=True, max_length=64)  # Любые дополнительные данные, которые нужны вам для работы с платежами
    transaction_id = fields.CharField(null=True, max_length=255)  # ID операции.
    auth_code = fields.CharField(null=True, max_length=128)  # Код авторизации банковской карты. Выдается эмитентом и подтверждает проведение авторизации
    card_number = fields.CharField(max_length=32, null=True)
    expiry_month = fields.CharField(max_length=16, null=True)
    expiry_year = fields.CharField(max_length=16, null=True)
