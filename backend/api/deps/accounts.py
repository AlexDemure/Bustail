from fastapi import Depends, HTTPException
from structlog import get_logger

from backend.apps.accounts.crud import account as account_crud
from backend.apps.accounts.models import Account
from backend.enums.accounts import AccountErrors
from backend.enums.system import SystemLogs
from backend.submodules.auth.deps import get_subject_from_auth_token, get_subject_from_refresh_token
from backend.submodules.permissions.enums import Permissions
from backend.submodules.permissions.utils import is_have_permission


async def current_account(subject: str = Depends(get_subject_from_auth_token)) -> Account:
    """Получение текущего аккаунта без проверки на подтвержденность."""
    current_account_id = int(subject)

    logger = get_logger().bind(account_id=current_account_id)

    account = await account_crud.get(current_account_id)
    logger = logger.bind(email=account.email, created_at=account.created_at, verified_at=account.verified_at)

    if not account:
        logger.debug(SystemLogs.account_not_found.value)
        raise HTTPException(status_code=404, detail=AccountErrors.account_not_found.value)

    is_permission = await is_have_permission(current_account_id, [Permissions.public_api_access])
    if not is_permission:
        logger.debug(SystemLogs.account_not_have_permissions.value)
        raise HTTPException(status_code=403, detail=AccountErrors.forbidden.value)

    return account


async def confirmed_account(subject: str = Depends(get_subject_from_auth_token)) -> Account:
    """Получение подтвежденного аккаунта."""
    current_account_id = int(subject)

    logger = get_logger().bind(account_id=current_account_id)

    account = await current_account(current_account_id)
    logger = logger.bind(email=account.email, created_at=account.created_at, verified_at=account.verified_at)

    if account.verified_at is None:
        logger.debug(SystemLogs.account_not_confirmed.value)
        raise HTTPException(status_code=404, detail=AccountErrors.account_not_found.value)

    return account


async def current_account_by_refresh_token(
        subject: str = Depends(get_subject_from_refresh_token)
) -> Account:
    """Получение аккаунта через refresh token."""
    current_account_id = int(subject)
    return await current_account(current_account_id)

