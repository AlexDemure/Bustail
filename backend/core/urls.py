from fastapi import APIRouter

from backend.api.routers.router_accounts import router as account_router
from backend.api.routers.router_applications import router as application_router
from backend.api.routers.router_drivers import router as driver_router
from backend.api.routers.router_mailing import router as mailing_router
from backend.api.routers.router_notifications import router as notification_router
from backend.api.routers.router_payments import router as billing_router
from backend.api.routers.router_other import router as other_router

api_router = APIRouter()

api_router.include_router(other_router, tags=["other"])
api_router.include_router(billing_router, tags=["billing"])
api_router.include_router(account_router, tags=["accounts"], prefix='/accounts')
api_router.include_router(application_router, tags=["applications"], prefix='/applications')
api_router.include_router(mailing_router, tags=["mailing"], prefix='/mailing')
api_router.include_router(driver_router, tags=["drivers"], prefix='/drivers')
api_router.include_router(notification_router, tags=["notifications"], prefix='/notifications')
