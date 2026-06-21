import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.config import settings
from app.database.session import engine, Base
from app.middleware.logging import LoggingAndExceptionMiddleware

# Routers
from app.routers import auth, transactions, budgets, analytics, ai

logger = logging.getLogger(__name__)

# Initialize database tables on startup.
# In a full production setup with migrations, you'd use Alembic,
# but automatic ORM creation is excellent and error-free for college projects.
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.critical(f"Failed database schema mapping creation: {str(e)}")
    raise

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Smart Expense Tracker with Analytics and AI Insights - Final Year College Project",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS policies
# Allow local React dev server ports and common staging URLs
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom logging and global exception handling
app.add_middleware(LoggingAndExceptionMiddleware)

# Root check
@app.get("/", tags=["Health"])
def health_check():
    """
    Service health verification route.
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "database": str(engine.url.drivername)
    }

# Include API Routers under standard API v1 path
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(transactions.router, prefix=settings.API_V1_STR)
app.include_router(budgets.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
