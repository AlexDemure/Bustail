import random
import string
from typing import Optional, Any

import itsdangerous.exc
from itsdangerous import URLSafeTimedSerializer

from backend.core.config import settings

signer = URLSafeTimedSerializer(settings.SECRET_KEY)


def generate_security_token(context: dict):
    """Генерирование токена с помощью библиотеки ItsDangerous."""
    return signer.dumps(context)


def verify_security_token(token: str) -> Optional[Any]:
    """Проверка токена с помощью библиотеки ItsDangerous."""
    try:
        return signer.loads(token, max_age=settings.SECURITY_TOKEN_EXPIRE_MINUTES)
    except (itsdangerous.exc.SignatureExpired, itsdangerous.exc.BadSignature):
        return None


def generate_random_code(size=6, only_digits: bool = True):
    if only_digits:
        chars = string.digits
    else:
        chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(size))
