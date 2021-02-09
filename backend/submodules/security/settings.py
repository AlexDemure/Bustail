import os

# openssl rand -hex 16
SECRET_KEY: str = os.environ.get("SECRET_KEY", "5f8d0ff68f7fb0818355a76c58418312")

SECURITY_TOKEN_EXPIRE_MINUTES: int = 60 * 60 * 24  # 1 day
