from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class EnrollmentBase(BaseModel):
    state: Literal["enrolled", "completed", "failed"] = Field(default="enrolled")


class EnrollmentCreate(EnrollmentBase):
    student_id: int
    course_code: str


class EnrollmentRead(EnrollmentBase):
    id: int
    date: datetime
    student_id: int
    course_code: str

    class Config:
        from_attributes = True
