import time
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger("api_request_logger")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class LoggingAndExceptionMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs incoming requests, measures response execution latency,
    and catches unhandled backend exceptions to return a standardized error response.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        client_host = request.client.host if request.client else "unknown"
        
        try:
            # Proceed to the actual route handler
            response = await call_next(request)
            
            # Log execution summary
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"Client: {client_host} | HTTP: {request.method} {request.url.path} | "
                f"Status: {response.status_code} | Duration: {process_time:.2f}ms"
            )
            return response
            
        except Exception as e:
            # Log full exception details
            process_time = (time.time() - start_time) * 1000
            logger.exception(
                f"Unhandled Exception: Client: {client_host} | HTTP: {request.method} {request.url.path} | "
                f"Error: {str(e)} | Failed after: {process_time:.2f}ms"
            )
            
            # Return uniform 500 error response to client (prevents exposing internal trace details)
            return JSONResponse(
                status_code=500,
                content={"detail": "An internal server error occurred. Please try again later."}
            )
