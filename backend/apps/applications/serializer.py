from backend.apps.applications.models import Application
from backend.schemas.applications import HistoryApplication, ApplicationData


def prepare_application(app: Application) -> ApplicationData:
    data = ApplicationData(**app.__dict__)
    data.application_type = data.application_type.description
    return data


def prepare_apps_for_history_table(app: Application) -> HistoryApplication:
    return HistoryApplication(
        transport_name=f"{app.transport.brand} {app.transport.model}" if app.transport else None,
        **app.__dict__
    )
