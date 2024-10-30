from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssignmentBase(BaseModel):
    title: str
    instruction: Optional[str] = None
    points: int
    composition: bool = False
    due_date: Optional[datetime] = None
    course_id: int


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentRead(BaseModel):
    id: int
    title: str
    instruction: Optional[str]
    points: int
    composition: bool = False
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    course_id: int

    class Config:
        from_attributes = True


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    instruction: Optional[str] = None
    points: Optional[int] = None
    composition: bool = False
    due_date: Optional[datetime] = None
    course_id: Optional[int] = None
    # decision: Optional[bool] = None

    class Config:
        from_attributes = True
