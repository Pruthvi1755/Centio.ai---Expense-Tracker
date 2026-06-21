import logging
from typing import Generator
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import Engine
from app.utils.config import settings

logger = logging.getLogger(__name__)

# Configure engine arguments
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    
    # Enforce SQLite foreign keys constraint (SQLAlchemy doesn't do this by default for SQLite)
    if settings.DATABASE_URL.startswith("sqlite"):
        @event.listens_for(engine, "connect")
        def set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()
            
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    logger.critical(f"Failed to initialize database engine: {str(e)}")
    raise RuntimeError("Database connection failure.") from e

Base = declarative_base()

def get_db() -> Generator:
    """
    Dependency to provide a thread-safe database session to route handlers,
    ensuring cleanup after the request completes.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session encountered an error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()
