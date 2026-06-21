import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.session import Base, get_db

# Configure in-memory SQLite engine for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the in-memory test database
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """
    Provides a clean database session per test function, wrapping each in a transaction
    and rolling back changes upon completion.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    """
    Overrides FastAPI's DB dependency with the testing session and provides a TestClient.
    """
    def _get_db_override():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    # Clear dependencies override after test completes
    app.dependency_overrides.clear()
