from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.enrollment import *
from crud.enrollment_crud import *
from db.init_db import get_db
from core.security import check_user_active

router = APIRouter()


@router.post("/enrollments/", response_model=EnrollmentRead)
async def create_enrollment_route(
    enrollment: EnrollmentCreate,
    user=Depends(check_user_active),
    db: Session = Depends(get_db),
):
    return create_enrollment(db=db, enrollment=enrollment)


@router.get("/students/{student_id}/enrollments", response_model=List[EnrollmentRead])
async def get_enrollments_by_student_route(
    student_id: int, db: Session = Depends(get_db), user=Depends(check_user_active)
):
    return get_enrollments_by_student(db=db, student_id=student_id)


@router.get("/students/{student_id}/courses", response_model=List[CourseRead])
async def get_courses_by_student_route(
    student_id: int, db: Session = Depends(get_db), user=Depends(check_user_active)
):
    return get_courses_by_student(db=db, student_id=student_id)


@router.delete("/enrollments/", response_model=None)
async def delete_enrollment_route(
    student_id: int,
    course_code: str,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    delete_enrollment(db=db, student_id=student_id, course_code=course_code)
    return {"detail": "Enrollment deleted"}
