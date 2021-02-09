import os

# openssl rand -hex 16
SECRET_KEY: str = os.environ.get("SECRET_KEY", "5f8d0ff68f7fb0818355a76c58418312")
DOMAIN: str = os.environ.get("DOMAIN", "localhost")

API_URL: str = "/api/v1"

ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12  # 60 minutes * 12 hours = 0.5day
