from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config.settings import SECRET_KEY
import logging

logger = logging.getLogger(__name__)

# truncate_error=False tells passlib not to raise on long passwords
# since we slice manually — prevents double-truncation edge cases
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    truncated = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd_context.hash(truncated)

def verify_password(plain: str, hashed: str) -> bool:
    truncated = plain.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd_context.verify(truncated, hashed)

def create_access_token(data: dict, expires_delta: int = 60) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)