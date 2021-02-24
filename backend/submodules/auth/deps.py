from fastapi import Depends, Body
from fastapi.security import OAuth2PasswordBearer

from backend.core.config import settings
from .enums import TokenPurpose
from .schemas import RefreshTokenParams
from .security import decode_token

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_URL}{settings.AUTH_ACCESS_URL}")


def get_subject_from_auth_token(token: str = Depends(reusable_oauth2)) -> int:
    """Получение объекта из авторизационного токена."""
    token_payload = decode_token(token, TokenPurpose.access)
    return token_payload.sub


def get_subject_from_refresh_token(params: RefreshTokenParams = Body(...)) -> int:
    """Получение объекта из refresh токена."""
    token_payload = decode_token(params.token, TokenPurpose.refresh)
    return token_payload.sub
