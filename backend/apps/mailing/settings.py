import os
from pydantic import BaseSettings


class MailingSettings(BaseSettings):

    MAILING_SECRET_KEY: str = os.environ.get("MAILING_SECRET_KEY", "NOT_SET")
    MAILING_EMAIL: str = os.environ.get("MAILING_EMAIL", "NOT_SET")
    MAILING_NAME: str = os.environ.get("MAILING_NAME", "NOT_SET")


SUPPORT_EMAIL = "support@bustail.online"
SERVICE_NAME = "MAILING"
