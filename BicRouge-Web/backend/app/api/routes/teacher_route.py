from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.teacher import TeacherCreate, TeacherRead
from db.init_db import get_db
from crud.teacher_crud import register_teacher
from crud.auth_crud import get_user_by_email
from models.user_models import Institution, Teacher
from schemas.institution import InstitutionRead
from typing import List


router = APIRouter()


@router.post("/register", response_model=TeacherRead)
async def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = await get_user_by_email(db, email=teacher.email, user_type=Teacher)
    if db_teacher:
        raise HTTPException(status_code=400, detail="Adresse e-mail déjà utilisée")

    registered_teacher = await register_teacher(teacher, db)
    return registered_teacher


@router.get("/institutions", response_model=List[InstitutionRead])
def get_institutions(db: Session = Depends(get_db)):
    institutions = db.query(Institution).all()
    return institutions
