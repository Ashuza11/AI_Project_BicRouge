from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from jwt import InvalidTokenError

from models.user_models import Teacher, Student
from db.init_db import get_db
from schemas.token import Token
from .security import create_token, create_refresh_token, verify_token


async def token_refresher(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = verify_token(refresh_token)
        user_email = payload.get("sub")
        role = payload.get("role")
        if role == "teacher":
            user = db.query(Teacher).filter(Teacher.email == user_email).first()
        elif role == "student":
            user = db.query(Student).filter(Student.email == user_email).first()
        else:
            raise HTTPException(status_code=401, detail="Invalid role")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    access_token = create_token(user)
    refresh_token = create_refresh_token({"sub": user.email, "role": role})

    # Debugging print statements
    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")

    return Token(
        access_token=str(access_token),
        refresh_token=str(refresh_token),
        token_type="bearer",
    )
