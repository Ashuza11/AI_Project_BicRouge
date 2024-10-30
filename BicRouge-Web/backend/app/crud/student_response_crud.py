from sqlalchemy.orm import Session
from schemas.student_response import AssignmentResponsesCreate
from models.operation_models import StudentResponse


def create_student_responses(
    db: Session, assignment_responses: AssignmentResponsesCreate
):
    # print(assignment_responses)
    created_responses = []
    for response in assignment_responses.responses:
        db_response = StudentResponse(
            assignment_id=assignment_responses.assignment_id,
            student_id=assignment_responses.student_id,
            question_id=response.question_id,
            response_text=response.response_text,
            file=response.file,
        )
        db.add(db_response)
        db.commit()
        db.refresh(db_response)
        created_responses.append(db_response)
    return created_responses


def get_student_responses_by_assignment_student_and_question(
    db: Session, assignment_id: int, student_id: int, question_id: int
):
    return (
        db.query(StudentResponse)
        .filter(
            StudentResponse.assignment_id == assignment_id,
            StudentResponse.student_id == student_id,
            StudentResponse.question_id == question_id,
        )
        .all()
    )
