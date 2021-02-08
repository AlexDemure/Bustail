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
    payment_amount_must_be_gt_zero = "Сумма оплаты должны быть больше 0"
    personal_data_is_wrong_format = "Не указан телефон или email для заполнения платежных данных."
