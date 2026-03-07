"""
Security utilities for JWT tokens and password hashing
"""
import logging

logger = logging.getLogger(__name__)

from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
from app.core.config import settings

# Password hashing context
# Usamos pbkdf2_sha256 para evitar problemas de compatibilidad con bcrypt en Docker
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token

    Args:
        data: Claims to include in the token
        expires_delta: Token expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    logger.info(f"🔑 Creating token with SECRET_KEY: {settings.SECRET_KEY[:10]}..., sub={data.get('sub')}")
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token

    Args:
        token: JWT token string

    Returns:
        Token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        logger.info(f"✅ Token decoded successfully, sub={payload.get('sub')}")
        return payload
    except JWTError as e:
        logger.error(f"❌ Token decode failed: {type(e).__name__}: {e}")
        logger.error(f"   SECRET_KEY used: {settings.SECRET_KEY[:10]}...")
        logger.error(f"   Token (first 50 chars): {token[:50]}...")
        return None
    except Exception as e:
        logger.error(f"❌ Unexpected token decode error: {type(e).__name__}: {e}")
        return None


class TokenPayload(BaseModel):
    """JWT token payload structure"""
    sub: int  # user_id
    exp: datetime
