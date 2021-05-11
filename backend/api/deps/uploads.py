from fastapi import Header
from decimal import Decimal
from backend.submodules.object_storage.settings import IMAGE_LIMIT_SIZE_TO_BYTES, FILE_LIMIT_SIZE_TO_BYTES
from backend.submodules.object_storage.utils import convert_bytes_to_mb


async def valid_image_content_length(content_length: int = Header(..., lt=IMAGE_LIMIT_SIZE_TO_BYTES)) -> Decimal:
    return convert_bytes_to_mb(content_length)


async def valid_file_content_length(content_length: int = Header(..., lt=FILE_LIMIT_SIZE_TO_BYTES)) -> Decimal:
    return convert_bytes_to_mb(content_length)