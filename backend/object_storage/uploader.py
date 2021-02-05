import os
import tempfile
from typing import IO

import boto3

from .callback import ProgressPercentage
from .enums import FileMimetypes


class ObjectStorage:

    aws_access_key_id = None
    aws_secret_access_key = None
    bucket_name = None

    aws_type = "s3"
    endpoint_url = 'https://storage.yandexcloud.net'

    client = None

    def __init__(self, aws_access_key_id: str, aws_secret_access_key: str, bucket_name: str):
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        self.bucket_name = bucket_name

        self.init_client()

    def init_client(self):
        self.client = boto3.client(
            self.aws_type,
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
        )

    def upload(self, file: IO, content_type: str, file_url: str) -> None:
        """Загрузка файлов в бакет."""

        tempFileIO = tempfile.mkstemp(suffix=FileMimetypes(content_type).file_format)

        with open(tempFileIO[1], "wb") as temp_file:
            file.seek(0)
            temp_file.write(file.read())

            self.client.upload_file(
                Filename=temp_file.name,
                Bucket=self.bucket_name,
                Key=file_url,
                Callback=ProgressPercentage(temp_file.name)
            )

        # Отвязка от временных файлах
        os.unlink(tempFileIO[1])

    def download(self, file_uri: str) -> bytes:
        with tempfile.NamedTemporaryFile() as temp_file:
            self.client.download_fileobj(self.bucket_name, file_uri, temp_file)
            temp_file.seek(0)
            return temp_file.file.read()
