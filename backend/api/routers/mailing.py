import base64

from fastapi import APIRouter, HTTPException, status, Depends, File, UploadFile, Form
from decimal import Decimal
from structlog import get_logger

from backend.api.deps.accounts import current_account
from backend.api.deps.uploads import valid_file_content_length
from backend.apps.accounts.logic import find_account_by_email
from backend.apps.accounts.models import Account
from backend.apps.mailing.logic import send_change_password_message, send_verify_code, send_feedback_message
from backend.enums.accounts import AccountErrors
from backend.enums.system import SystemLogs
from backend.schemas.mailing import BaseEmail
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.schemas import Message

router = APIRouter()


@router.post(
    '/change_password/',
    response_model=Message,
    responses={
        status.HTTP_200_OK: {'description': 'Email is sent'},
        status.HTTP_404_NOT_FOUND: {"description": AccountErrors.account_not_found.value}
    }
)
async def change_password(payload: BaseEmail):
    """Отправка email-ссылки на изменение пароля аккаунта."""
    logger = get_logger().bind(payload=payload.dict())
    account = await find_account_by_email(email=payload.email)

    if not account:
        logger.debug(SystemLogs.account_not_found.value)
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=AccountErrors.account_not_found.value
        )

    await send_change_password_message(account.id, account.email)

    return Message(msg=BaseMessage.OK.value)


@router.post(
    '/verify_code/',
    response_model=Message,
    responses={
        status.HTTP_200_OK: {'description': 'Email is sent'},
        status.HTTP_404_NOT_FOUND: {"description": AccountErrors.account_not_found.value}
    }
)
async def verify_code(payload: BaseEmail, account: Account = Depends(current_account)):
    """Отправка кода подтверждения на почту для подтверждения аккаунта."""
    logger = get_logger().bind(payload=payload.dict())

    if not await find_account_by_email(email=payload.email):
        logger.debug(SystemLogs.account_not_found.value)
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=AccountErrors.account_not_found.value
        )

    await send_verify_code(account.id, payload.email)

    return Message(msg=BaseMessage.OK.value)


@router.post(
    '/feedback/',
    response_model=Message,
    responses={
        status.HTTP_200_OK: {'description': 'Email is sent'},
    }
)
async def send_feedback(
        file: UploadFile = File(...),
        email: str = Form(...),
        text: str = Form(...),
        file_size_to_mb: Decimal = Depends(valid_file_content_length),
):
    """Отправка обратной связи."""
    if file:
        data = await file.read()

        encoded_data = base64.b64encode(data).decode()

        file_data = dict(
            content=encoded_data,
            filename=file.filename
        )
    else:
        file_data = None

    await send_feedback_message(email, text, file_data)

    return Message(msg=BaseMessage.OK.value)
