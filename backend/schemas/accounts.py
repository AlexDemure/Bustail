from pydantic import BaseModel, validator, root_validator, constr, EmailStr

from backend.utils import get_cities


class AccountBase(BaseModel):
    email: EmailStr
    city: constr(min_length=1, max_length=255) = None


class AccountCreate(AccountBase):
    hashed_password: constr(min_length=6, max_length=255)

    @validator('city')
    def check_city(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value


class AccountUpdate(BaseModel):
    phone: constr(min_length=11, max_length=12) = None
    fullname: constr(min_length=1, max_length=255) = None
    city: constr(min_length=1, max_length=255)

    @validator('city')
    def check_city(cls, value):
        if value not in get_cities():
            raise ValueError("City is not found")

        return value


class AccountData(AccountBase):
    id: int
    fullname: constr(min_length=1, max_length=255) = None
    phone: constr(min_length=11, max_length=12) = None


class ConfirmAccount(BaseModel):
    code: constr(min_length=4, max_length=16)


class ChangePassword(BaseModel):
    password: constr(min_length=6, max_length=255)
