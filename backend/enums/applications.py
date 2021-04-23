from enum import Enum


class ApplicationStatus(Enum):
    waiting = "waiting"
    confirmed = "confirmed"
    completed = "completed"
    progress = "progress"
    rejected = "rejected"
    expired = "expired"

    @property
    def description(self):
        if self is self.waiting:
            return "В ожидании"
        elif self is self.progress:
            return "В процессе"
        elif self is self.confirmed:
            return "Подтверждена"
        elif self is self.rejected:
            return "Отменена"
        elif self is self.expired:
            return "Истекла"
        elif self is self.completed:
            return "Выполнена"

    @classmethod
    def ended_status(cls):
        return [cls.progress, cls.completed, cls.expired, cls.rejected]


class ApplicationTypes(Enum):
    wedding = "wedding"
    tour = "tour"
    intercity = "intercity"
    funeral = "funeral"
    other = "other"

    @property
    def description(self):
        if self is self.wedding:
            return "Свадьба"
        elif self is self.tour:
            return "Путешествие"
        elif self is self.intercity:
            return "Междугородние"
        elif self is self.funeral:
            return "Похороны"
        elif self is self.other:
            return "Другое"

    @classmethod
    def get_types(cls) -> dict:
        return {x.value: x.description for x in cls}


class ApplicationErrors(Enum):
    to_go_when_wrong_format = "Дата назначения поездки должна быть больше текущей."
    application_does_not_belong_this_user = "Заявки не принадлежит данному пользователю."
    application_has_ended_status = "Заявка переведена в промежуточный или конечный статус."
