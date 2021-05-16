from decimal import Decimal

from fastapi import APIRouter, status, Response, Depends, HTTPException
from fastapi.responses import JSONResponse
from structlog import get_logger

from backend.api.deps.accounts import confirmed_account
from backend.apps.accounts.models import Account
from backend.apps.billing.crud import payment_operation as crud_payment_operation
from backend.apps.billing.logic import Payment, PaymentNotification
from backend.apps.billing.utils import write_off_debt
from backend.apps.company.logic import get_company_by_account_id, update_company
from backend.apps.drivers.logic import get_driver_by_account_id, update_driver
from backend.enums.billing import PaymentOperationEvents, PaymentErrors, PaymentCardType
from backend.enums.system import SystemLogs
from backend.schemas.billing import PaymentLink
from backend.submodules.common.enums import BaseMessage
from backend.submodules.common.responses import auth_responses
from backend.submodules.common.schemas import UpdatedBase

router = APIRouter()


@router.get(
    "/payments",
    response_model=PaymentLink,
    responses={
        status.HTTP_201_CREATED: {"description": BaseMessage.obj_is_created.value},
        status.HTTP_400_BAD_REQUEST: {"description": PaymentErrors.payment_amount_must_be_gt_zero.value},
        **auth_responses,
    }

)
async def get_payment_url(payment_card: PaymentCardType, account: Account = Depends(confirmed_account)) -> JSONResponse:
    """Прием уведомления об платежной операции из яндекс кассы."""
    logger = get_logger().bind(account_id=account.id)

    if payment_card == PaymentCardType.personal:
        carrier = await get_driver_by_account_id(account.id)

    elif payment_card == PaymentCardType.company:
        carrier = await get_company_by_account_id(account.id)

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    if not carrier:
        logger.debug(SystemLogs.driver_not_found.value)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=BaseMessage.obj_is_not_found.value
        )

    if carrier.debt < Decimal("1"):
        logger.debug(SystemLogs.payment_amount_is_less_possible.value, debt=carrier.debt)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=PaymentErrors.payment_amount_must_be_gt_zero.value
        )

    payment_data = await Payment(
        account=account,
        amount=carrier.debt,
        payment_card=payment_card
    ).create_payment_operation()

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=payment_data)


@router.post(
    "/payments/notifications/",
    responses={
        status.HTTP_200_OK: {"description": BaseMessage.OK.value},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"description": PaymentErrors.payment_operation_have_end_status.value},
    }
)
async def payment_notification(payment_data: dict, response: Response) -> Response:
    """Прием уведомления об платежной операции из яндекс кассы."""
    logger = get_logger().bind(payload=payment_data)
    logger.debug(SystemLogs.payment_notification_is_accepted.value)

    if payment_data['event'] == PaymentOperationEvents.payment_success.value:
        payment_operation_id = await PaymentNotification(payment_data).receiving_notification()

        payment_operation = await crud_payment_operation.get(payment_operation_id)

        if payment_operation.payment_card == PaymentCardType.personal:
            carrier = await get_driver_by_account_id(payment_operation.account_id)

            driver_up = UpdatedBase(
                id=carrier.id,
                updated_fields=dict(debt=write_off_debt(carrier.debt, payment_operation.sum))
            )
            await update_driver(driver_up)

        elif payment_operation.payment_card == PaymentCardType.company:
            carrier = await get_company_by_account_id(payment_operation.account_id)

            company_up = UpdatedBase(
                id=carrier.id,
                updated_fields=dict(debt=write_off_debt(carrier.debt, payment_operation.sum))
            )
            await update_company(company_up)

        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=BaseMessage.obj_is_not_found.value
            )

    response.status_code = status.HTTP_200_OK
    return response
