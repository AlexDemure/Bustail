from backend.apps.accounts.utils import get_change_password_link
from backend.apps.mailing import crud
from backend.apps.mailing.settings import SERVICE_NAME, SUPPORT_EMAIL
from backend.enums.mailing import MailingTypes
from backend.schemas.mailing import (
    SendVerifyCodeEventCreate, ChangePasswordEventCreate, MailingTask
)
from backend.submodules.redis.service import redis
from backend.submodules.security.utils import generate_random_code, encode_token


async def send_verify_code(account_id: int, email: str) -> None:
    """Отправка кода подтверждения аккаунта."""
    verify_code = generate_random_code()

    task = MailingTask(
        message_type=MailingTypes.send_verify_code.value,
        data=dict(email=email, message=verify_code)
    )
    await redis.append_task(SERVICE_NAME, task.dict())

    create_schema = SendVerifyCodeEventCreate(
        account_id=account_id,
        message=verify_code
    )
    await crud.send_verify_code_event.create(create_schema)


async def is_verify_code(account_id: int, code: str) -> bool:
    """Проверка наличие подтвержденного кода."""
    code = await crud.send_verify_code_event.find_code(account_id, code)
    return True if code else False


async def send_change_password_message(account_id: int, email: str) -> None:
    """Отправка письма со сменой пароля."""
    context = dict(account_id=account_id, email=email)
    security_token = encode_token(context)

    # Ссылка на страницу со сменой пароля.
    confirm_url = get_change_password_link(security_token)

    task = MailingTask(
        message_type=MailingTypes.send_change_password_message.value,
        data=dict(email=email, message=confirm_url)
    )
    await redis.append_task(SERVICE_NAME, task.dict())

    create_schema = ChangePasswordEventCreate(
        email=email,
        message=security_token
    )
    await crud.change_password_event.create(create_schema)


async def is_verify_token(email: str, security_token: str) -> bool:
    """Проверка наличие токена."""
    token = await crud.change_password_event.find_token(email, security_token)
    return True if token else False


async def send_feedback_message(email: str, message: str, file: dict) -> None:
    """Отправка письма по обратной связи."""
    task = MailingTask(
        message_type=MailingTypes.send_feedback_message.value,
        data=dict(
            email=SUPPORT_EMAIL,
            email_from=email,
            message=message,
            file=file
        )
    )
    await redis.append_task(SERVICE_NAME, task.dict())
