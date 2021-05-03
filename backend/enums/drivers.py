from enum import Enum


class TransportType(Enum):
    car = "car"
    minubus = "minibus"
    bus = "bus"
    holiday = "holiday"
    freight = "freight"
    special = "special"
    ritual = "ritual"
    other = "other"

    @property
    def description(self):
        if self is self.car:
            return "Автомобиль до 8 мест"
        elif self is self.minubus:
            return "Автобус от 8 и не более 24 мест"
        elif self is self.bus:
            return "Автобус свыше 24 мест"
        elif self is self.holiday:
            return "Автомобиль для праздников"
        elif self is self.freight:
            return "Грузовой автомобиль"
        elif self is self.special:
            return "Спецтехника"
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
