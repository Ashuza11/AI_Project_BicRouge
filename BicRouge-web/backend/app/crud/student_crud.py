from sqlalchemy.orm import Session
from models.user_models import Student
from schemas.student import StudentCreate
from core.security import get_password_hash


async def register_student(student: StudentCreate, db: Session):
    hashed_password = get_password_hash(student.hashed_password)
    student_obj = Student(
        name=student.name,
        postname=student.postname,
        last_name=student.last_name,
        email=student.email,
        hashed_password=hashed_password,
    )
    db.add(student_obj)
    db.commit()
    db.refresh(student_obj)
    return student_obj
