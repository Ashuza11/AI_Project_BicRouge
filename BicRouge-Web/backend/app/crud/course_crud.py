import random
import string
from typing import List
from sqlalchemy.orm import Session, joinedload
from pydantic import ValidationError
from fastapi import HTTPException
from datetime import datetime
from models.operation_models import Course, Enrollment
from models.user_models import Teacher, Student
from schemas.course import CourseCreate, CourseUpdate, CourseRead
from schemas.teacher import TeacherRead


def generate_course_code(length=7):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


async def create_course(user: TeacherRead, db: Session, course: CourseCreate):
    while True:
        course_code = generate_course_code()
        existing_course = db.query(Course).filter_by(code=course_code).first()
        if not existing_course:
            break

    db_course = Course(
        name=course.name,
        section=course.section,
        subject=course.subject,
        teacher_id=course.teacher_id,
        code=course_code,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    # Populate the teacher_name field for the response
    course_read = CourseRead(
        id=db_course.id,
        name=db_course.name,
        section=db_course.section,
        subject=db_course.subject,
        code=db_course.code,
        teacher_name=db_course.teacher.name,
        created_at=db_course.created_at,
        updated_at=db_course.updated_at,
    )
    return course_read


async def get_all_courses(user: TeacherRead, db: Session) -> List[CourseRead]:
    courses = db.query(Course).filter(Course.teacher_id == user.id).all()
    course_list = []
    for course in courses:
        course_data = course.__dict__.copy()
        course_data["teacher_name"] = (
            f"{course.teacher.name} {course.teacher.postname or ''} {course.teacher.last_name or ''}".strip()
            if course.teacher
            else None
        )
        course_read = CourseRead(**course_data)
        course_list.append(course_read)
    return course_list


# Select a course
async def course_selector(course_id: int, user: TeacherRead, db: Session):
    # Use `joinedload` to eagerly load the teacher relationship
    course = (
        db.query(Course)
        .options(joinedload(Course.teacher))
        .filter_by(teacher_id=user.id)
        .filter_by(id=course_id)
        .first()
    )
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


async def get_course(course_id: int, user: TeacherRead, db: Session):
    course = await course_selector(course_id, user, db)
    # Constructing the full teacher name
    if course.teacher:
        teacher_full_name = f"{course.teacher.name} {course.teacher.postname or ''} {course.teacher.last_name or ''}".strip()
    else:
        teacher_full_name = None

    course_data = CourseRead.from_orm(course)
    course_data.teacher_name = teacher_full_name
    return course_data


async def delete_course(course_id: int, user: TeacherRead, db: Session):
    course = await course_selector(course_id, user, db)
    db.delete(course)
    db.commit()


async def update_course(
    course_id: int, course: CourseUpdate, user: TeacherRead, db: Session
):
    db_course = await course_selector(course_id, user, db)
    for key, value in course.dict(exclude_unset=True).items():
        if key == "teacher_id":
            continue
        setattr(db_course, key, value)
    db_course.updated_at = datetime.now()
    db.commit()
    db.refresh(db_course)
    return CourseRead.from_orm(db_course)


# Get the teacher and a list of all of students who joined a course
def get_teacher_and_students(
    db: Session,
    course_id: int,
):
    # Query to get the course and associated teacher
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        return None

    # Fetch the teacher associated with the course
    teacher = db.query(Teacher).filter(Teacher.id == course.teacher_id).first()

    if not teacher:
        return None

    # Fetch the list of students enrolled in the course
    students_query = (
        db.query(Student)
        .join(Enrollment, Enrollment.student_id == Student.id)
        .filter(Enrollment.course_id == course_id)
    )

    students = students_query.all()

    # Prepare the response
    result = {
        "teacher": {
            "id": teacher.id,
            "name": f"{teacher.name} {teacher.postname}",
            "email": teacher.email,
        },
        "students": [
            {
                "id": student.id,
                "name": f"{student.name} {student.postname}",
                "email": student.email,
            }
            for student in students
        ],
    }

    return result
