from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.config.settings import SECRET_KEY  # FIX: use only this; removed duplicate declaration below

# FIX: Removed `SECRET_KEY = ""` that was overriding the imported value above
ALGORITHM = "HS256"

# FIX: Proper OAuth2 bearer scheme so Depends() can extract token from Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")