from sqlalchemy.orm import Session
from models.user_models import Teacher, Institution
from schemas.teacher import TeacherCreate
from core.security import get_password_hash
from fastapi import HTTPException


async def register_teacher(teacher: TeacherCreate, db: Session):
    if teacher.new_institution:
        institution_obj = Institution(
            name=teacher.new_institution.name,
            description=teacher.new_institution.description,
        )
        db.add(institution_obj)
        db.commit()
        db.refresh(institution_obj)
    else:
        # If not, get the institution with the provided ID
        institution_obj = (
            db.query(Institution)
            .filter(Institution.id == teacher.institution_id)
            .first()
        )
        # If no institution is found, raise an error
        if not institution_obj:
            raise HTTPException(
                status_code=400, detail="L'institution recherchée n'a pas été trouvée."
            )

    hashed_password = get_password_hash(teacher.password)

    teacher_obj = Teacher(
        name=teacher.name,
        postname=teacher.postname,
        last_name=teacher.last_name,
        email=teacher.email,
        hashed_password=hashed_password,
        institutions=[institution_obj],
    )
    db.add(teacher_obj)
    db.commit()
    db.refresh(teacher_obj)
    return teacher_obj
