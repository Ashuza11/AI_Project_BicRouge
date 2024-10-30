from pydantic import BaseModel, EmailStr
from typing import List, Optional
from .institution import InstitutionRead, InstitutionCreate


class TeacherBase(BaseModel):
    name: str
    postname: Optional[str]
    last_name: Optional[str]
    email: EmailStr


class TeacherCreate(TeacherBase):
    password: str
    institution_id: Optional[int] = None
    new_institution: Optional[InstitutionCreate] = None
    is_active: Optional[bool] = True


class TeacherRead(TeacherBase):
    id: int
    institutions: List[InstitutionRead] = []

    class Config:
        from_attributes = True


class TeacherUpdate(TeacherBase):
    password: Optional[str]
