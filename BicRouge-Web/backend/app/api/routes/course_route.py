"""
API Router for Course Management

This module provides API endpoints for managing courses. It includes functionality to create, read, update, and delete courses. The endpoints utilize FastAPI for routing and SQLAlchemy for database operations. User authentication and active status checks are performed for each operation.

Modules and Functions:
- APIRouter: FastAPI router instance for defining API routes.
- Depends: Dependency injection for request handling.
- HTTPException: Exception for HTTP errors.
- Session: SQLAlchemy session for database interactions.
- List: Typing hint for lists.
- get_db: Dependency for obtaining a database session.
- check_user_active: Dependency for checking if the user is active.
- create_course: CRUD function for creating a new course.
- get_all_courses: CRUD function for fetching all courses.
- get_course: CRUD function for fetching a specific course.
- delete_course: CRUD function for deleting a course.
- update_course: CRUD function for updating a course.
- CourseCreate: Pydantic schema for creating courses.
- CourseRead: Pydantic schema for reading course data.
- CourseUpdate: Pydantic schema for updating courses.

Routes:
- POST /courses: Create a new course.
- GET /courses: Get all courses.
- GET /courses/{course_id}: Get a specific course by ID.
- DELETE /courses/{course_id}: Delete a course by ID.
- PUT /courses/{course_id}: Update a course by ID.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Union
from typing import List
from db.init_db import get_db
from crud.course_crud import (
    create_course,
    get_all_courses,
    get_course,
    update_course,
    delete_course,
    get_teacher_and_students,
)
from models.user_models import Teacher, Student
from schemas.course import CourseCreate, CourseRead, CourseUpdate
from core.security import check_user_active


router = APIRouter()


@router.post("/courses", response_model=CourseRead)
async def create_new_course(
    course: CourseCreate,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Create a new course.

    Parameters:
    - course: CourseCreate - The course data to create.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - CourseRead: The created course data.
    """
    return await create_course(user=user, db=db, course=course)


@router.get("/courses", response_model=List[CourseRead])
async def fetch_all_courses(
    user=Depends(check_user_active), db: Session = Depends(get_db)
):
    """
    Get all courses.

    Parameters:
    - user: Depends(check_user_active)
    - The active user making the request.
    - db: Session - The database session.

    Returns:
    - List[CourseRead]: A list of all courses.
    """
    return await get_all_courses(user=user, db=db)


@router.get("/courses/{course_id}", status_code=200)
async def fetch_course(
    course_id: int,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Get a specific course by ID.

    Parameters:
    - course_id: int - The ID of the course.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - CourseRead: The course data.
    """
    return await get_course(course_id, user, db)


@router.delete("/courses/{course_id}", status_code=200)
async def delete_existing_course(
    course_id: int, user=Depends(check_user_active), db: Session = Depends(get_db)
):
    """
    Delete a course by ID.

    Parameters:
    - course_id: int - The ID of the course.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - dict: A message indicating successful deletion.
    """
    await delete_course(course_id, user, db)
    return {"message": "Cours supprimé avec succès"}


# Update a course
@router.put("/courses/{course_id}", status_code=200)
async def update_existing_course(
    course_id: int,
    course: CourseUpdate,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Update a course by ID.

    Parameters:
    - course_id: int - The ID of the course.
    - course: CourseUpdate - The updated course data.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - dict: A message indicating successful update.
    """
    await update_course(course_id, course, user, db)
    return {"message": "Mise à jour réussie"}


@router.get("/courses/{course_id}/teacher-and-students")
def get_course_teacher_and_students(
    course_id: int,
    db: Session = Depends(get_db),
):

    result = get_teacher_and_students(
        db,
        course_id,
    )

    if not result:
        raise HTTPException(
            status_code=404, detail="Course not found or no students enrolled"
        )

    return result
