from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CourseBase(BaseModel):
    name: str
    section: Optional[str]
    subject: Optional[str]


class CourseCreate(CourseBase):
    teacher_id: int


class CourseRead(CourseBase):
    id: int
    code: str
    teacher_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseUpdate(CourseBase):
    pass
