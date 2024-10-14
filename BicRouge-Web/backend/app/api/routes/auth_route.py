"""
API Router for User Authentication

This module provides API endpoints for user authentication, including login and fetching current user details. The endpoints utilize FastAPI for routing and SQLAlchemy for database operations. User authentication and active status checks are performed for each operation.

Modules and Functions:
- APIRouter: FastAPI router instance for defining API routes.
- Depends: Dependency injection for request handling.
- HTTPException: Exception for HTTP errors.
- OAuth2PasswordRequestForm: Form for OAuth2 password authentication.
- Session: SQLAlchemy session for database interactions.
- Union: Typing hint for union types.
- timedelta: Class for representing time differences.

Schemas:
- Token: Pydantic schema for token data.
- TeacherRead: Pydantic schema for reading teacher data.
- StudentRead: Pydantic schema for reading student data.

Dependencies:
- create_token: Function to create a JWT token.
- check_user_active: Dependency for checking if the user is active.
- ACCESS_TOKEN_EXPIRE_MINUTES: Configuration for token expiration time.
- authenticate_user: Function to authenticate a user.
- get_db: Dependency for obtaining a database session.

Routes:
- POST /token: Authenticate user and generate a token.
- GET /users/me: Get the current authenticated user's details.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Union
from jwt import InvalidTokenError
from models.user_models import Teacher, Student
from schemas.token import Token


from schemas.teacher import TeacherRead
from schemas.student import StudentRead
from core.security import (
    create_token,
    check_user_active,
    oauth2_scheme,
    verify_token,
    create_access_token,
)

from crud.auth_crud import authenticate_user
from db.init_db import get_db


router = APIRouter()


@router.post("/token", response_model=Token, operation_id="login_auth_token")
async def login(
    # role: str = Query(..., description="The role of the user (teacher/student)"),
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and generate a token.

    Parameters:
    - form_data: OAuth2PasswordRequestForm - The form data containing username and password.
    - db: Session - The database session.

    Returns:
    - Token: The generated JWT token.

    Raises:
    - HTTPException: If the username or password is invalid or role is incorrect.
    """
    # if not role:
    #     raise HTTPException(status_code=400, detail="Rôle non spécifié.")

    # user = await authenticate_user(form_data.username, form_data.password, role, db)
    user = await authenticate_user(form_data.username, form_data.password, db)

    access_token = create_token(user)
    return access_token


@router.get("/users/me", response_model=Union[TeacherRead, StudentRead])
async def read_users_me(
    current_user: Union[Teacher, Student] = Depends(check_user_active)
):
    """
    Get the current authenticated user's details.

    Parameters:
    - current_user: Union[Teacher, Student] - The current active user.

    Returns:
    - Union[TeacherRead, StudentRead]: The current user's details.
    """
    return current_user


@router.post("/token/refresh", response_model=Token, operation_id="refresh_token")
async def refresh_token(
    refresh_token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Refresh the access token using the refresh token.

    Parameters:
    - refresh_token: str - The refresh token.
    - db: Session - The database session.

    Returns:
    - Token: The new access token.

    Raises:
    - HTTPException: If the refresh token is invalid or expired.
    """
    try:
        payload = verify_token(refresh_token)
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if role == "teacher":
            user = db.query(Teacher).filter(Teacher.email == email).first()
        elif role == "student":
            user = db.query(Student).filter(Student.email == email).first()
        if user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token({"sub": user.email, "role": role})
        return {"access_token": access_token, "token_type": "bearer"}
    except InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
