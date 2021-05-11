from structlog import get_logger

from backend.enums.mailing import MailingTypes
from backend.apps.mailing import sender
from backend.apps.mailing.settings import SERVICE_NAME
from backend.submodules.redis.service import redis
from backend.schemas.mailing import SendVerifyCodeEvent, ChangePassword, FeedbackMessage

logger = get_logger()


async def service_mailing():
    while True:
        async for task in redis.get_tasks(SERVICE_NAME):
            logger.debug(
                F"Service:{SERVICE_NAME} accepted task",
                task_id=task.get("task_id"),
                email=task.get("email"),
                message_type=task.get("message_type")
            )
            try:
                if task['message_type'] == MailingTypes.send_verify_code.value:
                    schema = SendVerifyCodeEvent(**task['data'])
                    await sender.SendVerifyCodeMessage(schema).send_email()

                elif task['message_type'] == MailingTypes.send_change_password_message.value:
                    schema = ChangePassword(**task['data'])
                    await sender.ChangePasswordMessage(schema).send_email()

                elif task['message_type'] == MailingTypes.send_feedback_message.value:
                    schema = FeedbackMessage(**task['data'])
                    await sender.SendFeedbackMessage(schema).send_email()

                else:
                    logger.debug(f"Service:{SERVICE_NAME} message_type is not found")
            except Exception as e:
                logger.error(f"Service:{SERVICE_NAME} error:{str(e)}")
                continue
