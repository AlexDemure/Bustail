from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import current_account, confirmed_account
from backend.apps.accounts.crud import account as account_crud
from backend.apps.accounts.logic import (
    get_account,
    create_account as logic_create_account,
    confirmed_account as logic_confirmed_account,
    change_password as logic_change_password,
    update_account as logic_update_account,
)
from backend.apps.accounts.models import Account
from backend.apps.mailing.logic import is_verify_code
from backend.core.config import settings
from backend.enums.accounts import AccountErrors
from backend.enums.system import SystemLogs, SystemEnvs
from backend.schemas.accounts import AccountCreate, AccountUpdate, AccountData, ConfirmAccount, ChangePassword
from backend.submodules.auth.schemas import Token
from backend.submodules.auth.security import generate_token
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message

router = APIRouter()


@router.get(
    "/me/",
    response_model=AccountData,
    responses=auth_responses
)
async def read_user_me(account: Account = Depends(confirmed_account)) -> Optional[AccountData]:
    """Получение данных текущего пользователя."""
    return await get_account(account.id)


@router.post(
    "/confirm/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {"description": AccountErrors.account_is_confirmed.value},
        status.HTTP_404_NOT_FOUND: {"description": AccountErrors.confirmed_code_is_not_found.value}
    }
)
async def confirm_account(payload: ConfirmAccount, account: Account = Depends(current_account)) -> Message:
    """
    Подтверждение аккаунта через почту.

    - **validation №1**: Если клиент уже ранее подтвердли аккаунт - вернется 400 ошибка.
    - **validation №2**: Если клиент указал не правильный код - вернетс 404 ошибка,
     после этого не обходимо указать клиенту что необходимо повторно пройти регистрацию.
    """
    logger = get_logger().bind(
        payload=payload.dict(),
        account_id=account.id, email=account.email,
        created_at=account.created_at, verified_at=account.verified_at
    )

    if account.verified_at is not None:
        logger.debug(SystemLogs.account_confirmed.value)
        raise HTTPException(
            status_code=400,
            detail=AccountErrors.account_is_confirmed.value,
        )

    if settings.ENV == SystemEnvs.prod.value:
        if await is_verify_code(account.id, payload.code) is False:
            logger.debug(SystemLogs.wrong_verify_code.value)
            raise HTTPException(
                status_code=404,
                detail=AccountErrors.confirmed_code_is_not_found.value,
            )
    else:
        logger.warning(f"{SystemLogs.ignore_business_logic.value} Check verify code skipped.")

    await logic_confirmed_account(account)
    return Message(msg=BaseMessage.obj_is_changed.value)


@router.put(
    "/change_password/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {"description": AccountErrors.url_change_password_is_wrong.value},
        status.HTTP_404_NOT_FOUND: {"description": AccountErrors.confirmed_code_is_not_found.value}
    }
)
async def change_password(payload: ChangePassword, security_token: str) -> Message:
    """
    Смена пароля в системе.

    - **description**: Данный API используется при редиректе из почты,
     куда было отправлено письмо с ссылкой на восстановление пароля.
    """
    try:
        await logic_change_password(payload.password, security_token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.post(
    "/",
    response_model=Token,
    responses={
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {"description": AccountErrors.email_already_exist.value},
        status.HTTP_404_NOT_FOUND: {"description": AccountErrors.city_not_found.value}
    }
)
async def create_account(payload: AccountCreate) -> JSONResponse:
    """
    Создание нового пользователя.

    - **returned**: В ответ возвращается токен авторизации который необходимо передавать в каждом запросе в headers.
    """
    logger = get_logger().bind(payload=payload.dict())

    account = await account_crud.find_by_email(email=payload.email)
    if account:
        if account.verified_at is not None:
            logger.debug(SystemLogs.account_already_exist.value)
            raise HTTPException(
                status_code=400,
                detail=AccountErrors.email_already_exist.value,
            )

    account_id = await logic_create_account(payload, account)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(generate_token(account_id))
    )


@router.put(
    "/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {"description": AccountErrors.phone_already_exist.value},
        **auth_responses
    }
)
async def update_account(payload: AccountUpdate, account: Account = Depends(confirmed_account)) -> Message:
    """
    Обновление данных аккаунта.

    - **validation**: Если клиент указал телефон который уже есть в системе будет отдаваться 400 ошибка.
    """
    logger = get_logger().bind(payload=payload.dict(), account_id=account.id)

    if payload.phone:
        other_account = await account_crud.find_by_phone(phone=payload.phone)
        if other_account:
            if other_account.id != account.id:
                logger.debug(SystemLogs.account_already_exist.value)
                raise HTTPException(
                    status_code=400,
                    detail=AccountErrors.phone_already_exist.value,
                )

    await logic_update_account(account, payload)

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.get(
    "/{account_id}/",
    response_model=AccountData,
    responses=auth_responses
)
async def get_user(account_id: int, account: Account = Depends(confirmed_account)) -> Optional[AccountData]:
    """Получение данных пользователя."""
    return await get_account(account_id)
