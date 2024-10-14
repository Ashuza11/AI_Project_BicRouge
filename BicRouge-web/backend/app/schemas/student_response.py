from pydantic import BaseModel
from typing import List, Optional


class FeedbackBase(BaseModel):
    advice: str
    state: Optional[bool] = False


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: int
    assignment_id: int
    student_response_id: int

    class Config:
        from_attributes = True


class StudentResponseBase(BaseModel):
    question_id: int
    response_text: str
    file: Optional[str] = None


class StudentResponseCreate(StudentResponseBase):
    pass


class StudentResponse(StudentResponseBase):
    id: int
    assignment_id: int
    student_id: int
    grade: Optional[float] = None

    class Config:
        from_attributes = True


class AssignmentResponsesCreate(BaseModel):
    assignment_id: int
    student_id: int
    responses: List[StudentResponseCreate]
