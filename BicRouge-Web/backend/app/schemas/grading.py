from pydantic import BaseModel


class AssessmentData(BaseModel):
    teacher_corrected_assessment: str
    grading_criteria: str
    student_responses: str
