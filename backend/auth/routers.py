from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from structlog import get_logger

from backend.accounts.crud import account as account_crud
from backend.auth.schemas import Token
from backend.auth.utils import get_token
from backend.common.enums import BaseMessage, SystemLogs
from backend.enums.accounts import AccountErrors

router = APIRouter()


@router.post(
    "/login/access-token/",
    response_model=Token,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value}
    }
)
async def login_access_cookie(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    logger = get_logger().bind(payload=form_data.__dict__)

    account = await account_crud.authenticate(form_data.username, form_data.password)
    if not account:
        logger.debug(SystemLogs.account_not_found.value)
        raise HTTPException(status_code=404, detail=AccountErrors.account_not_found.value)

    return Token(access_token=get_token(account.id))
