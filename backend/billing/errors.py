from backend.enums.billing import PaymentErrors


class PaymentError(BaseException):
    """
    Исключение в логике обработки материалов
    """
    def __init__(self, error_code: PaymentErrors):
        self.error_code = error_code
