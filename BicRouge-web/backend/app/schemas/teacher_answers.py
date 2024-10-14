from pydantic import BaseModel
from typing import List


class TeacherResponseCreate(BaseModel):
    response_text: str


class QuestionCreate(BaseModel):
    question_text: str
    max_points: int
    teacher_answers: List[TeacherResponseCreate]


class AssignmentQuestionsCreate(BaseModel):
    assignment_id: int
    questions: List[QuestionCreate]
