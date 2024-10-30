from pydantic import BaseModel
from typing import List, Optional


class QuestionBase(BaseModel):
    question_text: str
    max_points: int


class QuestionCreate(QuestionBase):
    teacher_answers: List = [{}]


class AssignmentQuestionsCreate(BaseModel):
    assignment_id: int
    questions: List[QuestionCreate]


class Question(QuestionBase):
    id: int
    assignment_id: int
    reassigned_id: Optional[int] = None
    teacher_answers: Optional[str] = None

    class Config:
        from_attributes = True


class QuestionUpdate(BaseModel):
    question_text: str
    max_points: int
    assignment_id: int

    class Config:
        from_attributes = True
