from starlette.middleware import Middleware
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from structlog import get_logger

from backend.core.config import settings
from backend.enums.system import SystemEnvs
from backend.submodules.sentry.service import sentry


async def sentry_dispatcher(request: Request, call_next: RequestResponseEndpoint) -> Response:
    try:
        return await call_next(request)
    except Exception as exc:
        await sentry.send_data(request, exc, **request.__dict__)
        logger = get_logger().bind(context=request.__dict__)
        logger.error('Exception caught by Sentry')
        raise


utils = []

if settings.ENV == SystemEnvs.prod.value:
    utils.extend(
        Middleware(BaseHTTPMiddleware, dispatch=sentry_dispatcher),
    )
