from backend.apps.applications.models import Application
from backend.schemas.applications import HistoryApplication, ApplicationData


def prepare_application(app: Application) -> ApplicationData:
    data = app.__dict__
    application_type = data.pop('application_type')
    return ApplicationData(
        application_type=application_type.description,
        **data
    )


def prepare_apps_for_history_table(app: Application) -> HistoryApplication:
    return HistoryApplication(
        transport_name=f"{app.transport.brand} {app.transport.model}" if app.transport else None,
        **app.__dict__
    )
