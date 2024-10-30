from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.student import StudentCreate
from models.user_models import Student
from db.init_db import get_db
from crud.student_crud import register_student
from crud.auth_crud import get_user_by_email


router = APIRouter()


@router.post("/register", response_model=StudentCreate)
async def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = await get_user_by_email(db, email=student.email, user_type=Student)
    if db_student:
        raise HTTPException(status_code=400, detail="Adresse e-mail déjà utilisée")

    registered_student = await register_student(student, db)

    return registered_student