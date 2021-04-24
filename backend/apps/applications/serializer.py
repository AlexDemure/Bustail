from backend.apps.applications.models import Application
from backend.enums.applications import ApplicationStatus
from backend.schemas.applications import ApplicationData, HistoryApplication
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


def prepare_apps_for_history_table(app: Application) -> HistoryApplication:
    return HistoryApplication(
        transport_name=f"{app.transport.brand} {app.transport.model}" if app.transport else None,
        **app.__dict__
    )
