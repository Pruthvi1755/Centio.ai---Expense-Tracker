import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Settings:
    """
    Application settings loaded from environment variables or defaults.
    """
    PROJECT_NAME: str = "Smart Expense Tracker"
    API_V1_STR: str = "/api/v1"
    
    # Security
    # In production, this should be a strong random secret key
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_key_change_me_in_production_1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) # Default: 24 hours
    
    # Database
    # Default to SQLite inside the project folder for easy local evaluation, fall back to PostgreSQL if provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./expense_tracker.db")

settings = Settings()
