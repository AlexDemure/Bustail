import mmap
from decimal import Decimal
from decimal import ROUND_UP
from hashlib import sha512
from typing import IO

from .enums import FileMimetypes


def get_file_size_to_mb(file: IO) -> Decimal:
    file.seek(0)
    file_size_to_bytes = len(file.read())
    file_size_to_mb = Decimal(file_size_to_bytes) / Decimal("1024") / Decimal("1024")

    return file_size_to_mb.quantize(Decimal('0.00'), rounding=ROUND_UP)


def check_file_size(file: IO, max_file_size_mb: int = 100) -> bool:
    file_size_to_mb = get_file_size_to_mb(file)
    return True if Decimal(max_file_size_mb) >= file_size_to_mb else False


def check_file_type(content_type: str) -> bool:
    try:
        FileMimetypes(content_type)
    except ValueError:
        return False

    return True


def get_file_hash(file: IO) -> str:
    """Получение хэш-суммы файла для дальнейшей проверки файла на уникальность"""
    h = sha512()

    """
    Memory map - это такая абстракция, позволяющая работать с файлами как с обычными строками.
    Появился после замены base64-строк на файлы обьектов при загрузке файлов в систему.
    Необходим, чтобы взять от файла хэш, как это делалось со строкой.

    mmap.mmap - конструктор, а не функция. Создает обьект типа mmap - "карту памяти"

    fileno: "integer file descriptor"
    length: длина mmap'а. Равна 0, т.к. при нулевой длине длина memory map принимает значение длины файла
    prot: (от слова protection) если указана, устанавливает ограничение на использование выделенной памяти,
          давая плюшки, связанные с этим (например, "только на чтение" => скорость на чтение больше).
          В некоторых PyCharm'ах может подсвечиваться как Unexpected argument, не знаю почему
    """

    with mmap.mmap(fileno=file.fileno(), length=0, prot=mmap.PROT_READ) as mm:
        h.update(mm)

    return h.hexdigest()

