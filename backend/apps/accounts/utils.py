from backend.utils import get_current_domain


def get_change_password_link(security_token: str) -> str:
    """Получение ссылки на смену пароля для пользователей."""
    return f"{get_current_domain()}/recovery/password?token={security_token}"
