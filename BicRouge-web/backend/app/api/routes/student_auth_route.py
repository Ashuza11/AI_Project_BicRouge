from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.user_models import Student
from schemas.student import StudentRead
from schemas.token import Token
from core.security import create_token, check_user_active
from crud.auth_crud import authenticate_user
from core.auth_utils import token_refresher
from db.init_db import get_db

router = APIRouter()


@router.post("/token", response_model=Token, operation_id="login_student_token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = await authenticate_user(form_data.username, form_data.password, db, Student)
    if not user:
        raise HTTPException(status_code=401, detail="Identifiants ou rôle invalides")

    access_token = create_token(user)
    return access_token


@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(refresh_token: str, db: Session = Depends(get_db)):
    return await token_refresher(refresh_token, db)


@router.get("/me", response_model=StudentRead)
async def read_users_me(current_user: Student = Depends(check_user_active)):
    return current_user
