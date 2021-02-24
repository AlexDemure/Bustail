from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from structlog import get_logger

from backend.api.deps.accounts import current_account_by_refresh_token
from backend.apps.accounts.crud import account as account_crud
from backend.apps.accounts.models import Account
from backend.core.config import settings
from backend.enums.accounts import AccountErrors
from backend.enums.system import SystemLogs
from backend.submodules.auth.responses import responses
from backend.submodules.auth.schemas import Token
from backend.submodules.auth.security import generate_token

router = APIRouter()


@router.post(
    f"{settings.AUTH_ACCESS_URL}",
    response_model=Token,
    responses=responses
)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """Авторизация"""
    logger = get_logger().bind(email=form_data.username)

    account = await account_crud.authenticate(form_data.username, form_data.password)
    if not account:
        logger.debug(SystemLogs.account_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=AccountErrors.account_not_found.value
        )

    return generate_token(account.id)


@router.post(
    f"{settings.AUTH_REFRESH_URL}",
    response_model=Token,
    responses=responses
)
async def refresh_token(account: Account = Depends(current_account_by_refresh_token)) -> Token:
    """Обновление токена."""
    return generate_token(account.id)
