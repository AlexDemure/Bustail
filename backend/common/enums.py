from enum import Enum


class BaseSystemErrors(Enum):
    schema_wrong_format = "Schema is wrong format"


class BaseMessage(Enum):
    obj_is_created = "Object is created."
    obj_already_exist = "Object already exist."
    obj_is_changed = "Object is changed."
    obj_is_not_found = "Object is not found."
    obj_data = "Object data."
    obj_is_not_created = "Object is not created reason bad request."
    obj_is_deleted = "Object is deleted."
    OK = "OK"


class SystemLogs(Enum):
    account_not_found = "Account is not found"
    account_not_have_permissions = "Account is not have permissions."
    account_not_confirmed = "Account is not confirmed."
    account_confirmed = "Account is confirmed."
    account_is_updated = "Account is updated."
    account_is_created = "Account is created."
    account_already_exist = "Account already exist"
    ignore_business_logic = "Business login is ignored."
    wrong_verify_code = "Wrong verify code."
    user_role_is_created = "User role is created."
