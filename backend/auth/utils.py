from datetime import timedelta

from fastapi import status
from starlette.responses import Response

from backend.auth import security


def get_token(account_id: int, token_expire_minutes: int = 60) -> str:
    return security.create_access_token(
        subject=str(account_id),
        expires_delta=timedelta(minutes=token_expire_minutes)
    )


def response_auth_cookie(account_id: int) -> Response:
    """Получение респонса с токеном-авторизации"""
    response = security.create_cookie(get_token(account_id))
    response.status_code = status.HTTP_204_NO_CONTENT

    return response
