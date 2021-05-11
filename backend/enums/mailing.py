from enum import Enum


class MailingTypes(Enum):
    """Типы отправок писем используется для определения таска в редисе."""
    send_verify_code = "send_verify_code"
    send_change_password_message = "send_change_password_message"
    send_feedback_message = "send_feedback_message"
