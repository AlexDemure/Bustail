from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from starlette.requests import Request


from . import schemas, security, enums, settings

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_URL}/login/access-token"
)


def get_subject_from_token(token: str = Depends(reusable_oauth2)) -> int:
    """Получение объекта из токена."""

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=enums.AuthErrors.credentials_is_not_validate.value,
        )

    return token_data.sub


def get_subject_from_cookie(request: Request) -> int:
    credentials_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=enums.AuthErrors.credentials_is_not_validate.value,
    )
    cookie = request.cookies.get(security.KEY)
    if not cookie:
        raise credentials_exception

    schema, token = cookie.split(" ")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise credentials_exception

    return token_data.sub
