from datetime import datetime
from typing import Optional
from pydantic import EmailStr

from structlog import get_logger

from backend.apps.accounts.crud import account as account_crud
from backend.apps.accounts.models import Account
from backend.apps.mailing.logic import send_verify_code, is_verify_token
from backend.enums.accounts import AccountErrors
from backend.enums.system import SystemLogs
from backend.schemas.accounts import AccountCreate
from backend.schemas.accounts import AccountData
from backend.schemas.accounts import AccountUpdate
from backend.submodules.auth.security import get_password_hash
from backend.submodules.common.enums import BaseSystemErrors
from backend.submodules.common.schemas import UpdatedBase
from backend.submodules.permissions.enums import Roles
from backend.submodules.permissions.utils import create_account_role
from backend.submodules.security.utils import decode_token


async def get_account(account_id: int) -> Optional[AccountData]:
    account = await account_crud.get(account_id)
    if account:
        return AccountData(
            id=account.id,
            fullname=account.fullname,
            phone=account.phone,
            email=account.email,
            city=account.city,
        )
    else:
        return None


async def create_account(account_in: AccountCreate, account: Account = None) -> int:
    """
    Создание аккаунта клиента.

    Также в методе создается роль к аккаунту и отправка письма с кодом подтверждения.
    """
    logger = get_logger().bind(payload=account_in.dict(), account_id=getattr(account, 'id', None))

    assert isinstance(account_in, AccountCreate), BaseSystemErrors.schema_wrong_format.value

    account_in.hashed_password = get_password_hash(account_in.hashed_password)

    # Если аккаунт уже есть в системе но не подтвержден - делаем отправку письма занова.
    if account:

        # Если пароль изменился заменяем на более новый
        if account.hashed_password != account_in.hashed_password:
            updated_schema = UpdatedBase(
                id=account.id,
                updated_fields=dict(hashed_password=account_in.hashed_password)
            )
            await account_crud.update(updated_schema)
            logger.debug(SystemLogs.account_is_updated.value)

    else:
        account = await account_crud.create(account_in)
        logger = logger.bind(account_id=account.id)
        logger.debug(SystemLogs.account_is_created.value)

        await create_account_role(account.id, Roles.customer)
        logger.debug(SystemLogs.user_role_is_created.value)

    await send_verify_code(account.id, account_in.email)

    return account.id


async def update_account(account: Account, account_up: AccountUpdate) -> None:
    """
    Обновление данных аккаунта.

    Используется для обновления пользовательских данных такик как ФИО, телефон, город.
    """
    logger = get_logger().bind(payload=account_up.dict(), account_id=account.id)

    update_schema = UpdatedBase(
        id=account.id,
        updated_fields=account_up.dict()
    )
    await account_crud.update(update_schema)
    logger.debug(SystemLogs.account_is_updated.value)


async def confirmed_account(account: Account) -> None:
    """Подтверждение аккаунта."""
    logger = get_logger().bind(email=account.email, account_id=account.id)

    account_up = UpdatedBase(
        id=account.id,
        updated_fields=dict(verified_at=datetime.utcnow())
    )
    await account_crud.update(account_up)
    logger.debug(SystemLogs.account_confirmed.value)


async def change_password(password: str, security_token: str) -> None:
    """Изменение пароля через токен подтверждения."""
    logger = get_logger()

    context = decode_token(security_token)  # Получение данных токена.
    if context is None:
        logger.debug(SystemLogs.wrong_verify_code.value)
        raise ValueError(AccountErrors.url_change_password_is_wrong.value)

    logger = logger.bind(email=context['email'])

    if await is_verify_token(context['email'], security_token) is False:  # Чтение события о смене пароля.
        logger.debug(SystemLogs.wrong_verify_code.value)
        raise ValueError(AccountErrors.url_change_password_is_wrong.value)

    account = await account_crud.get(object_id=context['account_id'])
    if not account:
        logger.debug(SystemLogs.account_not_found.value)
        raise ValueError(AccountErrors.account_not_found.value)

    update_schema = UpdatedBase(
        id=account.id,
        updated_fields=dict(hashed_password=get_password_hash(password))
    )
    await account_crud.update(update_schema)
    logger.debug(SystemLogs.account_is_updated.value)


async def find_account_by_email(email: EmailStr) -> Optional[AccountData]:
    account = await account_crud.find_by_email(email=email)
    return AccountData(**account.__dict__) if account else None
