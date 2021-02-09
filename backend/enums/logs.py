from enum import Enum


class SystemLogs(Enum):
    account_not_found = "Account is not found."
    account_not_have_permissions = "Account is not have permissions."
    account_not_confirmed = "Account is not confirmed."
    account_confirmed = "Account is confirmed."
    account_is_updated = "Account is updated."
    account_is_created = "Account is created."
    account_already_exist = "Account already exist."

    driver_is_created = "Driver is created."
    driver_is_updated = "Driver is updated."
    driver_not_found = "Driver is not found."
    driver_is_have_debt = "Driver is have debt limit."

    transport_not_belong_to_driver = "Transport not belong to driver."
    transport_already_exist = "Transport already exist."
    transport_is_updated = "Transport is updated."
    transport_is_deleted = "Transport is deleted."
    transport_not_found = "Transport is not found."
    transport_is_created = "Transport is created."

    cover_is_uploaded = "Cover is uploaded."
    cover_is_created = "Cover is created."
    cover_not_found = "Cover not found."
    cover_not_belong_to_transport = "Cover not belong to transport."

    application_is_created = "Application is created."
    application_not_found = "Application is not found."
    application_is_deleted = "Application is deleted."
    application_is_updated = "Application is updated."
    application_have_ended_status = "Application is have ended status."
    application_not_belong_to_user = "Application not belong to current user."

    file_is_wrong_format = "File is wrong format."
    file_is_large = "File is large."

    ignore_business_logic = "Business login is ignored."
    violation_business_logic = "Violation business logic."
    wrong_verify_code = "Wrong verify code."
    user_role_is_created = "User role is created."

    payment_amount_is_less_possible = "Payment amount is less possible."
    payment_operation_is_created = "Payment operation is created."
    payment_personal_data_is_wrong_format = "Payment personal data is wrong format."
    payment_notification_is_accepted = "Payment notification is accepted."
    payment_operation_is_have_ended_status = "Payment operation is have ended status."
    payment_operation_not_found = "Payment operation is not found."
    payment_operation_is_have_not_success_status = "Payment operation is have not success status."
    payment_operation_is_not_finished = "Payment operation is not finished."
    payment_operation_is_confirmed = "Payment operation is confirmed."

    notification_already_exist = "Notification is already exist."
    notification_is_created = "Notification is created."
    notification_not_found = "Notification is not found."
    notification_is_updated = "Notification is updated."
    notification_is_deleted = "Notification is deleted."
    notification_is_have_decision = "Notification is have decision."