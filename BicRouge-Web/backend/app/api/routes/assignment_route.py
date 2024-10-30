"""
API Router for Assignment Management

This module provides API endpoints for managing assignments within a course. It includes functionality to create, read, update, and delete assignments. The endpoints utilize FastAPI for routing and SQLAlchemy for database operations. User authentication and active status checks are performed for each operation.

Modules and Functions:
- APIRouter: FastAPI router instance for defining API routes.
- Depends: Dependency injection for request handling.
- Session: SQLAlchemy session for database interactions.
- List: Typing hint for lists.
- get_db: Dependency for obtaining a database session.
- check_user_active: Dependency for checking if the user is active.
- create_assignment: CRUD function for creating a new assignment.
- get_all_assignments: CRUD function for fetching all assignments for a specific course.
- get_assignment: CRUD function for fetching a specific assignment.
- delete_assignment: CRUD function for deleting an assignment.
- update_assignment: CRUD function for updating an assignment.
- AssignmentCreate: Pydantic schema for creating assignments.
- AssignmentRead: Pydantic schema for reading assignment data.
- AssignmentUpdate: Pydantic schema for updating assignments.

Routes:
- POST /assignments: Create a new assignment.
- GET /courses/{course_id}/assignments: Get all assignments for a specific course.
- GET /assignments/{assignment_id}: Get a specific assignment by ID.
- DELETE /assignments/{assignment_id}: Delete an assignment by ID.
- PUT /assignments/{assignment_id}: Update an assignment by ID.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.init_db import get_db
from crud.assignment_crud import (
    create_assignment,
    get_all_assignments,
    get_assignment,
    delete_assignment,
    update_assignment,
    get_student_assignments,
)
from schemas.assignment import AssignmentCreate, AssignmentRead, AssignmentUpdate
from core.security import check_user_active

router = APIRouter()


@router.post("/assignments", response_model=AssignmentRead)
async def create_new_assignment(
    assignment: AssignmentCreate,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Create a new assignment.

    Parameters:
    - assignment: AssignmentCreate - The assignment data to create.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - AssignmentRead: The created assignment data.
    """

    return await create_assignment(user=user, db=db, assignment=assignment)


@router.get("/courses/{course_id}/assignments", response_model=List[AssignmentRead])
async def fetch_all_assignments(
    course_id: int,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Get all assignments for a course.

    Parameters:
    - course_id: int - The ID of the course.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - List[AssignmentRead]: A list of assignments for the specified course.
    """
    return await get_all_assignments(user=user, db=db, course_id=course_id)


@router.get("/assignments/{assignment_id}", response_model=AssignmentRead)
async def fetch_assignment(
    assignment_id: int,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Get a specific assignment by ID.

    Parameters:
    - assignment_id: int - The ID of the assignment.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - AssignmentRead: The assignment data.
    """

    return await get_assignment(assignment_id, user, db)


@router.delete("/assignments/{assignment_id}", status_code=200)
async def delete_existing_assignment(
    assignment_id: int, user=Depends(check_user_active), db: Session = Depends(get_db)
):
    """
    Delete an assignment by ID.

    Parameters:
    - assignment_id: int - The ID of the assignment.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - dict: A message indicating successful deletion.
    """
    await delete_assignment(assignment_id, user, db)
    return {"message": "Assignment successfully deleted"}


@router.put("/assignments/{assignment_id}", response_model=AssignmentRead)
async def update_existing_assignment(
    assignment_id: int,
    assignment: AssignmentUpdate,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Update an assignment by ID.

    Parameters:
    - assignment_id: int - The ID of the assignment.
    - assignment: AssignmentUpdate - The updated assignment data.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - AssignmentRead: The updated assignment data.
    """
    return await update_assignment(assignment_id, assignment, user, db)


@router.get(
    "/students/{student_id}/courses/{course_id}/assignments",
    response_model=List[AssignmentRead],
)
async def fetch_student_assignments(
    student_id: int,
    course_id: int,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    """
    Get all assignments for a student in a specific course.

    Parameters:
    - student_id: int - The ID of the student.
    - course_id: int - The ID of the course.
    - user: Depends(check_user_active) - The active user making the request.
    - db: Session - The database session.

    Returns:
    - List[AssignmentRead]: A list of assignments for the specified student and course.
    """
    return await get_student_assignments(
        user=user, db=db, student_id=student_id, course_id=course_id
    )
