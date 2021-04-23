from backend.apps.applications.models import Application
from backend.enums.applications import ApplicationStatus
from backend.schemas.applications import ApplicationData
from backend.schemas.notifications import NotificationData


def prepare_apps_with_notifications(app: Application, notifications: list) -> ApplicationData:

    prepared_notifications = []

    if app.application_status == ApplicationStatus.waiting:
        if len(notifications) > 0:
            prepared_notifications = [NotificationData(**x.__dict__) for x in notifications]

    data = app.__dict__
    application_type = data.pop("application_type")

    return ApplicationData(
        notifications=prepared_notifications,
        application_type=application_type.description,
        **data
    )
