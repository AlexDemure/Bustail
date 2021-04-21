from enum import Enum


class TransportType(Enum):
    car = "car"
    minubus = "minibus"
    bus = "bus"
    other = "other"

    @property
    def description(self):
        if self is self.car:
            return "Транспорт до 8 мест."
        elif self is self.minubus:
            return "Транспорт свыше 8 и не более 24 мест."
        elif self is self.bus:
            return "Транспорт свыше 24 мест."
        elif self is self.other:
            return "Другое."

    @classmethod
    def define_type(cls, count_seats):
        if 1 <= count_seats <= 8:
            return cls.car
        elif 9 <= count_seats <= 24:
            return cls.minubus
        elif 25 <= count_seats <= 128:
            return cls.bus
        else:
            return cls.other


class DriverErrors(Enum):
    driver_already_exist = "Карточка водителя была ранее создана."
    transport_already_exist = "Транспорт с такими данными уже есть в системе."
    car_not_belong_to_driver = "Данный транспорт не принадлежит текущему пользователю."
    driver_have_debt_limit = "Превышен лимит задолженности. Необходимо оплатить задолженность."
