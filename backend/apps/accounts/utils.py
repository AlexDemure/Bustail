from backend.utils import get_current_api


def get_change_password_link(security_token: str) -> str:
    """Получение ссылки на смену пароля для пользователей."""
    return f"{get_current_api()}/accounts/change_password/?token={security_token}"
