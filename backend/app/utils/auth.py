from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config.settings import SECRET_KEY  # FIX: use only this; removed duplicate declaration below

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FIX: Removed `SECRET_KEY = ""` that was overriding the imported value above
ALGORITHM = "HS256"

def hash_password(password: str):
    return pwd_context.hash(password[:72])  # bcrypt limit fix

def verify_password(plain, hashed):
    return pwd_context.verify(plain[:72], hashed)

def create_access_token(data: dict, expires_delta: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)