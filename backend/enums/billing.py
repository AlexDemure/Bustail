from enum import Enum


class PaymentOperationEvents(Enum):

    payment_success = "payment.succeeded"


class PaymentOperationStatus(Enum):

    success = "succeeded"


class PaymentErrors(Enum):

    operation_id_is_not_found = "ID операции не найдено."
    operation_status_not_success = "Не успешный статус операции"
    paid_is_not_finished = "Процесс оплаты не завершен."
    payment_operation_have_end_status = "Операция была ранее завершена."
    payment_operation_is_not_found = "Платежная операция не найдена."

