from uuid import uuid4

import httpx
import jinja2
from structlog import get_logger
from tenacity import retry, stop_after_attempt, wait_exponential

from backend.core.config import settings
from backend.enums.system import SystemEnvs
from backend.schemas.mailing import BaseEmail, SendVerifyCodeEvent, ChangePassword, FeedbackMessage
from backend.submodules.common.enums import BaseSystemErrors


class SenderBase:
    loader_path = "apps/mailing/templates"  # Откуда брать HTML

    sender_email = settings.MAILING_EMAIL
    sender_name = settings.MAILING_NAME

    validation_schema = BaseEmail  # Используется для проверки схемы.

    template_name = None  # HTML который будет использоваться при отправке
    schema = None
    logger = None
    cid = None

    def __init__(self, schema):
        self.schema = schema
        self.logger = get_logger()
        self.cid = str(uuid4())

    async def send_email(self):
        raise NotImplementedError

    def get_context(self) -> dict:
        raise NotImplementedError

    def prepared_html(self, context: dict) -> str:
        loader = jinja2.FileSystemLoader(self.loader_path)
        env = jinja2.Environment(loader=loader, autoescape=True)
        template = env.get_template(self.template_name)
        return template.render(**context)

    def validate_data(self):
        assert isinstance(self.schema, self.validation_schema), BaseSystemErrors.schema_wrong_format.value

    def get_send_grid_template(self, subject: str, html: str, file: dict = None) -> dict:
        data = {
            "personalizations": [
                {
                    "to": [
                        {
                            "email": self.schema.email,
                            "name": self.schema.email,
                        }
                    ],
                    "subject": subject,
                }
            ],
            "content": [
                {
                    "type": "text/html",
                    "value": html
                }
            ],
            "from": {
                "email": settings.MAILING_EMAIL,
                "name": settings.MAILING_NAME,
            }
        }

        if file:
            data['attachments'] = [
                {
                    "content": file.get("content", None),
                    "filename": file.get("filename", None)
                }
            ]

        return data

    @retry(
        wait=wait_exponential(multiplier=1),
        stop=stop_after_attempt(5),
        reraise=True,
    )
    async def send_html(self, subject: str, html: str, file: dict = None):
        data = self.get_send_grid_template(subject, html, file)

        async with httpx.AsyncClient() as client:
            if settings.ENV == SystemEnvs.prod.value:
                self.logger.debug("Send mail")
                response = await client.post(
                    url='https://api.sendgrid.com/v3/mail/send',
                    headers={"Authorization": f"Bearer {settings.MAILING_SECRET_KEY}"},
                    json=data,
                )
                assert response.status_code == 202, f"Send mail is failed: {response.text}"
                self.logger.info(f'Message: {response}')
            else:
                self.logger.debug("Message is don't send")


class SendVerifyCodeMessage(SenderBase):
    template_name = 'verify_code.html'

    validation_schema = SendVerifyCodeEvent

    async def send_email(self):
        self.validate_data()

        context = self.get_context()
        html = self.prepared_html(context)
        subject = "Подтвердите регистрацию"

        return await self.send_html(subject, html)

    def get_context(self) -> dict:
        return dict(verify_code=self.schema.message)


class ChangePasswordMessage(SenderBase):
    template_name = 'change_password.html'

    validation_schema = ChangePassword

    async def send_email(self):
        self.validate_data()

        context = self.get_context()
        html = self.prepared_html(context)
        subject = "Смена пароля"

        return await self.send_html(subject, html)

    def get_context(self) -> dict:
        return dict(url=self.schema.message)


class SendFeedbackMessage(SenderBase):

    template_name = 'feedback.html'

    validation_schema = FeedbackMessage

    async def send_email(self):
        self.validate_data()

        html = self.prepared_html(self.get_context())
        subject = "Форма обратной связи"

        return await self.send_html(subject, html, self.schema.file)

    def get_context(self) -> dict:
        return dict(
            email_from=self.schema.email_from,
            message=self.schema.message
        )
