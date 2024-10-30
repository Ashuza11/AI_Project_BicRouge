from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.user_models import Teacher, Student
from typing import Type, Union
from core.security import verify_password


async def get_user_by_email(
    db: Session, email: str, user_type: Type[Union[Student, Teacher]]
):
    return db.query(user_type).filter(user_type.email == email).first()


async def authenticate_user(
    username: str, password: str, db: Session, user_type: Type[Union[Teacher, Student]]
):
    user = db.query(user_type).filter(user_type.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
