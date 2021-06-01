from enum import Enum


class TransportType(Enum):
    car = "car"
    minubus = "minibus"
    bus = "bus"
    holiday = "holiday"
    ritual = "ritual"
    medical = "medical"
    animal = "animal"
    other = "other"

    @property
    def description(self):
        if self is self.car:
            return "Автомобиль до 8 мест"
        elif self is self.minubus:
            return "Автобус от 8 до 24 мест"
        elif self is self.bus:
            return "Автобус от 24 мест"
        elif self is self.holiday:
            return "Автомобиль для праздников"
        elif self is self.medical:
            return "Медицинский транспорт"
        elif self is self.animal:
            return "Транспорт для питомцев"
        elif self is self.ritual:
            return "Ритуальный транспорт"
        elif self is self.other:
            return "Другое"

    @classmethod
    def get_types(cls) -> dict:
        return {x.value: x.description for x in cls}


class DriverErrors(Enum):
    driver_already_exist = "Карточка водителя была ранее создана."
    transport_already_exist = "Транспорт с такими данными уже есть в системе."
    car_not_belong_to_driver = "Данный транспорт не принадлежит текущему пользователю."
    driver_have_debt_limit = "Превышен лимит задолженности. Необходимо оплатить задолженность."
    inn_is_already = "Данный ИНН указан у другого пользователя."


class CarrierType(Enum):
    """
    Типы перевозчиков.

    Будет использоваться для смены типа аккаунта с увеличенными возможностями.
    """
    base = "base"
    advanced = "advanced"
    pro = "pro"
