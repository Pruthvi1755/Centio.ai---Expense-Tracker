from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    """
    Shared attributes for user schemas.
    """
    email: EmailStr = Field(..., description="The user's unique email address")

class UserCreate(UserBase):
    """
    Schema for user registration.
    """
    password: str = Field(..., min_length=6, description="Password (minimum 6 characters)")

class UserLogin(UserBase):
    """
    Schema for user authentication/login.
    """
    password: str = Field(..., description="The user's password")

class UserResponse(UserBase):
    """
    Schema for user profile responses.
    """
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    """
    Schema representing a successful login token structure.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    """
    Internal token payload structure.
    """
    email: str
    user_id: int
