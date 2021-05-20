from enum import Enum


class CompanyErrors(Enum):
    inn_is_already = "Данный ИНН указан у другой компании"
    ogrn_is_already = "Данный ОГРН указан у другой компании"
    license_number_is_already = "Номер лицензии указан у другой компании"
    page_url_is_already = "Данный адрес занят"
    car_not_belong_to_company = "Данный транспорт не принадлежит текущей компании."
    user_not_belong_to_company = "Данная компания не принадлежит текущему пользователю."
    company_have_debt_limit = "Превышен лимит задолженности. Необходимо оплатить задолженность."
    inn_not_found = "Данный ИНН не найден в реестрах."
