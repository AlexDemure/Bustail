from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account
from backend.apps.applications.logic import (
    get_account_applications as logic_get_account_applications,
    create_application as logic_create_application,
    get_application as logic_get_application,
    delete_application as logic_delete_application,
    get_all_applications as logic_get_all_applications,
    get_driver_applications as logic_get_driver_applications,
)
from backend.apps.drivers.logic import get_driver_by_account_id
from backend.enums.applications import ApplicationErrors, ApplicationTypes
from backend.enums.system import SystemLogs
from backend.schemas.applications import ListApplications, ApplicationData, ApplicationBase, ApplicationCreate
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message

router = APIRouter()


@router.get(
    "/types/",
    responses={
        status.HTTP_200_OK: {
            "description": "Getting a dict with of app types in the system.",
            "content": {
                "application/json": {
                    "example": {
                        "wedding": "Свадьба",
                        "watch": "Вахта"
                    },
                }
            },
        },
    }
)
def get_app_types() -> dict:
    """Получение списка типов заявок."""
    return ApplicationTypes.get_types()


@router.get(
    "/client/",
    response_model=ListApplications,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        **auth_responses
    }
)
async def get_account_applications(account: Account = Depends(confirmed_account)) -> ListApplications:
    """
    Получение списка заявок клиента.

    - **description**: Не относится к заявкам водителя. Уведомления будут в заявках в статусе "На ожидании".
    """
    return await logic_get_account_applications(account)


@router.get(
    "/driver/",
    response_model=ListApplications,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def get_driver_applications(account: Account = Depends(confirmed_account)) -> ListApplications:
    """
    Получение списка заявок водителя.

    - **description**: Не относится к заявкам клиента. Уведомления в данном API не возвращаются.
    """
    logger = get_logger().bind(account_id=account.id)
    driver = await get_driver_by_account_id(account.id)
    if not driver:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )
    return await logic_get_driver_applications(driver.id)


@router.post(
    "/",
    response_model=ApplicationData,
    responses={
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {"description": BaseMessage.obj_is_not_created.value},
        **auth_responses
    }
)
async def create_application(
        payload: ApplicationBase,
        account: Account = Depends(confirmed_account),
) -> JSONResponse:
    """Создание заявки."""
    application_in = ApplicationCreate(account_id=account.id, **payload.dict())
    application = await logic_create_application(account, application_in)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(application)
    )


@router.get(
    "/{application_id}/",
    response_model=ApplicationData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        **auth_responses
    }
)
async def get_application(application_id: int, account: Account = Depends(confirmed_account)) -> ApplicationData:
    """Получение данных о заявке."""
    return await logic_get_application(application_id)


@router.put(
    "/{application_id}/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        **auth_responses
    }
)
async def rejected_application(application_id: int, account: Account = Depends(confirmed_account)) -> Message:
    """Отмена заявки."""
    try:
        await logic_delete_application(account, application_id)
    except (AssertionError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.delete(
    "/{application_id}/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_deleted.value},
        status.HTTP_400_BAD_REQUEST:
            {"description": f"{ApplicationErrors.application_does_not_belong_this_user.value} or "
                            f"{ApplicationErrors.application_has_ended_status.value}"},
        **auth_responses
    }
)
async def delete_application(application_id: int, account: Account = Depends(confirmed_account)) -> Message:
    """Удаление собственной заявки."""
    try:
        await logic_delete_application(account, application_id)
    except (AssertionError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e))

    return Message(msg=BaseMessage.obj_is_deleted.value)


@router.get(
    "/",
    response_model=ListApplications,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        **auth_responses
    }
)
async def get_all_applications(
        limit: int = 10, offset: int = 0, city: str = "", order_by: str = 'to_go_when', order_type: str = 'asc'
) -> ListApplications:
    """Получение списка всех заявок."""

    query_params = dict(
        limit=limit, offset=offset, city=city, order_by=order_by, order_type=order_type
    )
    return await logic_get_all_applications(**query_params)


#TODO Удалить перед выкатом
@router.get(
    "/test/task/billing",
    response_model=ListApplications,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_data.value},
        **auth_responses
    }
)
async def task_billing():
    from backend.apps.applications.tasks import completed_applications
    return await completed_applications()
