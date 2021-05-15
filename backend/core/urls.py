from fastapi import APIRouter

from backend.api.routers.auth import router as auth_router
from backend.api.routers.accounts import router as account_router
from backend.api.routers.applications import router as application_router
from backend.api.routers.drivers import router as driver_router
from backend.api.routers.company import router as company_router
from backend.api.routers.mailing import router as mailing_router
from backend.api.routers.notifications import router as notification_router
from backend.api.routers.payments import router as billing_router
from backend.api.routers.other import router as other_router

api_router = APIRouter()

api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(other_router, tags=["other"])
api_router.include_router(billing_router, tags=["billing"])
api_router.include_router(account_router, tags=["accounts"], prefix='/accounts')
api_router.include_router(application_router, tags=["applications"], prefix='/applications')
api_router.include_router(mailing_router, tags=["mailing"], prefix='/mailing')
api_router.include_router(driver_router, tags=["drivers"], prefix='/drivers')
api_router.include_router(company_router, tags=["company"], prefix='/company')
api_router.include_router(notification_router, tags=["notifications"], prefix='/notifications')
