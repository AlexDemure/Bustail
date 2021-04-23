from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account
from backend.apps.applications.logic import get_application
from backend.apps.drivers.logic import is_transport_belongs_driver, is_driver_debt_exceeded
from backend.apps.notifications.logic import (
    create_notification as logic_create_notification,
    get_notification, set_decision, delete_notification
)
from backend.enums.applications import ApplicationErrors, ApplicationStatus
from backend.enums.drivers import DriverErrors
from backend.enums.notifications import NotificationTypes, NotificationErrors
from backend.enums.system import SystemLogs
from backend.schemas.notifications import NotificationData, NotificationCreate, SetDecision
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import Message

router = APIRouter()


@router.post(
    "/",
    response_model=NotificationData,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_already_exist.value},
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {
            "description": f"{DriverErrors.car_not_belong_to_driver.value}\n"
                           f"{ApplicationErrors.application_does_not_belong_this_user.value}\n"
                           f"{ApplicationErrors.application_has_ended_status.value}\n"
                           f"{DriverErrors.driver_have_debt_limit.value}"
        },
        **auth_responses
    }
)
async def create_notification(notification_in: NotificationCreate, account: Account = Depends(confirmed_account)) -> JSONResponse:
    """Создание предложения об услуги."""
    logger = get_logger().bind(account_id=account.id, payload=notification_in.dict())
    application = await get_application(notification_in.application_id)

    if application.application_status != ApplicationStatus.waiting:
        logger.debug(SystemLogs.application_have_ended_status.value)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ApplicationErrors.application_has_ended_status.value
        )

    if notification_in.notification_type == NotificationTypes.driver_to_client:
        driver, transport = await is_transport_belongs_driver(account.id, notification_in.transport_id)
        if is_driver_debt_exceeded(driver):
            logger.debug(SystemLogs.driver_is_have_debt.value, debt=driver.debt)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DriverErrors.driver_have_debt_limit.value
            )

    elif notification_in.notification_type == NotificationTypes.client_to_driver:
        if account.id != application.account_id:
            logger.warning(
                f"{SystemLogs.violation_business_logic.value} "
                f"{SystemLogs.application_not_belong_to_user.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ApplicationErrors.application_does_not_belong_this_user.value
            )

    try:
        notification = await logic_create_notification(notification_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(notification)
    )


@router.put(
    "/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_changed.value},
        status.HTTP_400_BAD_REQUEST: {
            "description": f"{NotificationErrors.notification_is_have_decision.value} or "
                           f"{ApplicationErrors.application_does_not_belong_this_user.value}"
        },
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def notification_decision(payload: SetDecision, account: Account = Depends(confirmed_account)) -> Message:
    """Решение по предложению."""
    logger = get_logger().bind(account_id=account.id, payload=payload.dict())
    notification = await get_notification(payload.notification_id)
    if not notification:
        logger.debug(SystemLogs.notification_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    logger = logger.bind(notification_id=notification.id)

    if notification.decision is not None:
        logger.debug(SystemLogs.notification_is_have_decision.value, decision=notification.decision)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=NotificationErrors.notification_is_have_decision.value
        )

    # Если уведомление от водителя тогда смотрим принадлежит ли это заявка данному пользователю.
    if notification.notification_type == NotificationTypes.driver_to_client:
        application = await get_application(notification.application_id)
        if not application:
            logger.debug(SystemLogs.application_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=BaseMessage.obj_is_not_found.value
            )

        if application.account_id != account.id:
            logger.warning(
                f"{SystemLogs.violation_business_logic.value} "
                f"{SystemLogs.application_not_belong_to_user.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ApplicationErrors.application_does_not_belong_this_user.value
            )

    # Если уведомление от клиента тогда смотрим принадлежит ли этот транспорт данному пользователю т.е водителю.
    elif notification.notification_type == NotificationTypes.client_to_driver:
        driver, transport = await is_transport_belongs_driver(account.id, notification.transport_id)

        # Имеет ли водитель задолженность.
        if is_driver_debt_exceeded(driver):
            logger.debug(SystemLogs.driver_is_have_debt.value, debt=driver.debt)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DriverErrors.driver_have_debt_limit.value
            )

    await set_decision(notification.id, payload.decision)

    return Message(msg=BaseMessage.obj_is_changed.value)


@router.delete(
    "/",
    response_model=Message,
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.obj_is_deleted.value},
        status.HTTP_400_BAD_REQUEST: {
            "description": f"{NotificationErrors.notification_is_have_decision.value} or "
                           f"{ApplicationErrors.application_does_not_belong_this_user.value}"
        },
        status.HTTP_404_NOT_FOUND: {"description": BaseMessage.obj_is_not_found.value},
        **auth_responses
    }
)
async def notification_delete(payload: SetDecision, account: Account = Depends(confirmed_account)) -> Message:
    """Удаление предложения."""
    logger = get_logger().bind(account_id=account.id, payload=payload.dict())

    notification = await get_notification(payload.notification_id)
    if not notification:
        logger.debug(SystemLogs.notification_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    # Удаление уведомления можно только до тех пор пока он не получил конечный статус.
    if notification.decision is not None:
        logger.debug(SystemLogs.notification_is_have_decision.value)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=NotificationErrors.notification_is_have_decision.value
        )

    # Если уведомление от водителя тогда смотрим принадлежит ли это заявка данному пользователю.
    if notification.notification_type == NotificationTypes.driver_to_client:
        application = await get_application(notification.application_id)
        if not application:
            logger.debug(SystemLogs.application_not_found.value)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=BaseMessage.obj_is_not_found.value
            )

        if application.account_id != account.id:
            logger.warning(
                f"{SystemLogs.violation_business_logic.value} "
                f"{SystemLogs.application_not_belong_to_user.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ApplicationErrors.application_does_not_belong_this_user.value
            )

    # Если уведомление от клиента тогда смотрим принадлежит ли этот транспорт данному пользователю.
    elif notification.notification_type == NotificationTypes.client_to_driver:
        if await is_transport_belongs_driver(account.id, notification.transport_id) is False:
            logger.warning(
                f"{SystemLogs.violation_business_logic.value} "
                f"{SystemLogs.transport_not_belong_to_driver.value}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=DriverErrors.car_not_belong_to_driver.value
            )

    await delete_notification(notification.id)

    return Message(msg=BaseMessage.obj_is_deleted.value)

