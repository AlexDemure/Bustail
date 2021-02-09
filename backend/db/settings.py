import os
from typing import Any, Optional

from pydantic import BaseSettings, PostgresDsn, validator


class PostgresDBSettings(BaseSettings):

    POSTGRESQL_URI: Optional[PostgresDsn] = None

    @validator("POSTGRESQL_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str]) -> Any:
        if isinstance(v, str):
            return v
        # Return URL-connect 'postgresql://postgres:bustail@postgres/bustail'
        return PostgresDsn.build(
            scheme="postgres",
            user=os.environ.get("POSTGRES_USER", "postgres"),
            password=os.environ.get("POSTGRES_PASSWORD", "bustail"),
            host=os.environ.get("POSTGRES_SERVER", "127.0.0.1"),
            path=f"/{os.environ.get('POSTGRES_DB', 'bustail')}",
        )


class SQLiteDBSettings(BaseSettings):

    SQLITE_URI = "sqlite://db.sqlite3"
