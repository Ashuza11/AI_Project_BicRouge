from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentBase(BaseModel):
    name: str
    postname: str
    last_name: Optional[str]
    email: EmailStr


class StudentCreate(StudentBase):
    hashed_password: str
    is_active: Optional[bool] = True


class StudentRead(StudentBase):
    id: int

    class Config:
        from_attributes = True


class StudentUpdate(StudentBase):
    password: Optional[str]
