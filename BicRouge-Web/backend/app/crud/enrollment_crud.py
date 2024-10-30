from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import and_
from models.operation_models import Enrollment, Course
from schemas.enrollment import EnrollmentCreate, EnrollmentRead
from schemas.course import CourseRead

from typing import List


def create_enrollment(db: Session, enrollment: EnrollmentCreate) -> EnrollmentRead:
    # Retrieve the course using the provided course code
    course = db.query(Course).filter(Course.code == enrollment.course_code).first()
    if not course:
        raise HTTPException(
            status_code=404,
            detail=f"Course with code {enrollment.course_code} doesn't exist",
        )

    # Check if the student is already enrolled in the course
    existing_enrollment = (
        db.query(Enrollment)
        .filter(
            and_(
                Enrollment.student_id == enrollment.student_id,
                Enrollment.course_code == enrollment.course_code,
            )
        )
        .first()
    )

    if existing_enrollment:
        raise HTTPException(
            status_code=400,
            detail=f"You are already enrolled in course with code {enrollment.course_code}",
        )

    # Create a new enrollment instance with the retrieved course_id
    db_enrollment = Enrollment(
        date=datetime.now(),
        state=enrollment.state,
        student_id=enrollment.student_id,
        course_id=course.id,  # Set the course_id here
        course_code=enrollment.course_code,
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return EnrollmentRead.from_orm(db_enrollment)


def get_enrollments_by_student(db: Session, student_id: int) -> List[EnrollmentRead]:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    return [EnrollmentRead.from_orm(enrollment) for enrollment in enrollments]


def get_courses_by_student(db: Session, student_id: int) -> List[CourseRead]:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    course_codes = [enrollment.course_code for enrollment in enrollments]
    courses = db.query(Course).filter(Course.code.in_(course_codes)).all()

    # Fetch teacher_name
    courses_with_teacher_names = [
        {
            "id": course.id,
            "code": course.code,
            "teacher_name": (
                f"{course.teacher.name} {course.teacher.postname or ''} {course.teacher.last_name or ''}".strip()
                if course.teacher
                else None
            ),
            "created_at": course.created_at,
            "updated_at": course.updated_at,
            "name": course.name,
            "section": course.section,
            "subject": course.subject,
        }
        for course in courses
    ]

    return [CourseRead(**course) for course in courses_with_teacher_names]


def delete_enrollment(db: Session, student_id: int, course_code: str):
    enrollment = (
        db.query(Enrollment)
        .filter(
            and_(
                Enrollment.student_id == student_id,
                Enrollment.course_code == course_code,
            )
        )
        .first()
    )
    if enrollment:
        db.delete(enrollment)
        db.commit()
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Enrollment not found for student_id {student_id} and course_code {course_code}",
        )
