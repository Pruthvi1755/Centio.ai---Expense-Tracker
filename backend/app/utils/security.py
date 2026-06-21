import os
import hashlib
import binascii
import logging
from datetime import datetime, timedelta, timezone
from typing import Union, Dict, Any, Optional
import jwt
from app.utils.config import settings

logger = logging.getLogger(__name__)

# PBKDF2 parameters for secure password hashing
SALT_BYTE_SIZE = 16
HASH_ITERATIONS = 100000

def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2 with SHA-256 and a random salt.
    Format: pbkdf2_sha256$iterations$salt$hash
    """
    try:
        salt = os.urandom(SALT_BYTE_SIZE)
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt,
            HASH_ITERATIONS
        )
        salt_hex = binascii.hexlify(salt).decode('utf-8')
        hash_hex = binascii.hexlify(pwd_hash).decode('utf-8')
        return f"pbkdf2_sha256${HASH_ITERATIONS}${salt_hex}${hash_hex}"
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise RuntimeError("Failed to secure password.") from e

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against the stored PBKDF2 hash.
    """
    try:
        if not hashed_password.startswith("pbkdf2_sha256$"):
            return False
        
        parts = hashed_password.split("$")
        if len(parts) != 4:
            return False
            
        iterations = int(parts[1])
        salt = binascii.unhexlify(parts[2])
        stored_hash = parts[3]
        
        test_hash = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt,
            iterations
        )
        test_hash_hex = binascii.hexlify(test_hash).decode('utf-8')
        return test_hash_hex == stored_hash
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token containing the payload data and expiry.
    """
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise RuntimeError("Failed to generate authorization token.") from e

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT token. Returns payload if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token verification failed: Expired signature")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"JWT token verification failed: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error decoding token: {str(e)}")
        return None
