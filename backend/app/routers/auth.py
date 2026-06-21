import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.utils.security import verify_password, hash_password, create_access_token, decode_access_token
from app.utils.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login-oauth")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    FastAPI dependency that extracts and validates the JWT bearer token,
    returning the matching authenticated User object from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id: int = payload.get("user_id")
    email: str = payload.get("email")
    if user_id is None or email is None:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    return user

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new system user. Performs input validation and secure hashing.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
        
    try:
        hashed_pwd = hash_password(user_in.password)
        new_user = User(email=user_in.email, hashed_password=hashed_pwd)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"Successfully registered user: {new_user.email}")
        return new_user
    except Exception as e:
        db.rollback()
        logger.error(f"Error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account."
        )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user credentials and issues a JWT token.
    """
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    try:
        access_token = create_access_token(
            data={"user_id": user.id, "email": user.email}
        )
        logger.info(f"User logged in successfully: {user.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        logger.error(f"Error issuing token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to authenticate credentials."
        )

@router.post("/login-oauth")
def login_oauth(username: str = Depends(oauth2_scheme)):
    """
    Dummy helper path targeting default FastAPI interactive Swagger docs authentication.
    """
    pass

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the authenticated user details for the active session.
    """
    return current_user

@router.post("/forgot-password")
def forgot_password(email_data: UserLogin, db: Session = Depends(get_db)):
    """
    Simulates a password reset recovery request. For local verification,
    the reset link is printed directly to application logs.
    """
    # Check if user exists
    user = db.query(User).filter(User.email == email_data.email).first()
    if not user:
        # Prevent user enumeration by returning generic success message anyway
        return {"message": "If this email is registered, a password recovery link has been generated."}
        
    # Simulate a reset token
    recovery_token = create_access_token(
        data={"reset_user_id": user.id, "email": user.email},
        expires_delta=timedelta(minutes=15)
    )
    
    reset_link = f"http://localhost:5173/reset-password?token={recovery_token}"
    logger.warning(f"PASSWORD RESET REQUESTED FOR {user.email}. Simulation reset link:\n{reset_link}")
    
    return {"message": "If this email is registered, a password recovery link has been generated. (Recover url logged)"}
