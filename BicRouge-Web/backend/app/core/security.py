from datetime import datetime, timedelta
from typing import Union
import jwt as _jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jwt import InvalidTokenError
from models.user_models import Teacher, Student
from db.init_db import get_db
from schemas.token import Token, TokenData
from passlib.context import CryptContext
from .config import settings

# from .config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Define OAuth2PasswordBearer schemes
teacher_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/teacher/token")
student_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/student/token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = _jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # Refresh token validity
    to_encode.update({"exp": expire})
    encoded_jwt = _jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_token(user: Union[Teacher, Student]) -> Token:
    user_data = {
        "sub": user.email,
        "role": "teacher" if isinstance(user, Teacher) else "student",
    }
    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data)
    return Token(
        access_token=access_token, refresh_token=refresh_token, token_type="bearer"
    )


def get_user_from_token(token: str, db: Session):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = _jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception

    if role == "teacher":
        user = db.query(Teacher).filter(Teacher.email == token_data.email).first()
    elif role == "student":
        user = db.query(Student).filter(Student.email == token_data.email).first()
    else:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return user


def get_current_teacher(
    token: str = Depends(teacher_oauth2_scheme), db: Session = Depends(get_db)
):
    return get_user_from_token(token, db)


def get_current_student(
    token: str = Depends(student_oauth2_scheme), db: Session = Depends(get_db)
):
    return get_user_from_token(token, db)


def get_current_user(
    student: Union[Student, None] = Depends(get_current_student),
    teacher: Union[Teacher, None] = Depends(get_current_teacher),
):

    if student:
        return student
    if teacher:
        return teacher
    raise HTTPException(status_code=401, detail="Could not validate credentials")


async def check_user_active(
    current_user: Union[Teacher, Student] = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user.")
    return current_user


def verify_token(token: str):
    try:
        payload = _jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
