from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from crud.student_response_crud import (
    create_student_responses,
    get_student_responses_by_assignment_student_and_question,
)
from crud.grading_crud import process_and_store_llm_output
from schemas.student_response import (
    StudentResponse,
    AssignmentResponsesCreate,
)
from schemas.grading import AssessmentData
from db.init_db import get_db
from core.security import check_user_active
from services.grading_data import assemble_grading_data
from api.routes.grading_route import get_grading_endpoint

router = APIRouter()


from fastapi import HTTPException


@router.post("/student_responses/", response_model=List[StudentResponse])
async def create_student_responses_endpoint(
    assignment_responses: AssignmentResponsesCreate,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    try:
        # Save the student responses to the database
        saved_responses = create_student_responses(
            db=db, assignment_responses=assignment_responses
        )

        # Trigger the grading process after saving the responses
        grading_data = await assemble_grading_data(
            db, assignment_id=assignment_responses.assignment_id, student_id=user.id
        )
        # print(grading_data)

        # Prepare the data for the grading endpoint
        assessment_data = AssessmentData(
            teacher_corrected_assessment=grading_data["teacher_corrected_assessment"],
            grading_criteria=grading_data["grading_criteria"],
            student_responses=grading_data["student_responses"],
        )
        # Get the grading from the LLM
        grading = await get_grading_endpoint(assessment_data)

        # Process and save the grading results in the database
        # print("Hello everyone :", grading)
        process_and_store_llm_output(
            db=db,
            llm_output=grading,
            assignment_id=assignment_responses.assignment_id,
            student_id=user.id,
        )

        return saved_responses

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/student_responses/assignment/{assignment_id}/student/{student_id}/question/{question_id}",
    response_model=List[StudentResponse],
)
async def get_student_responses_by_assignment_student_and_question_endpoint(
    assignment_id: int,
    student_id: int,
    question_id: int,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    student_responses = get_student_responses_by_assignment_student_and_question(
        db, assignment_id=assignment_id, student_id=student_id, question_id=question_id
    )
    if not student_responses:
        raise HTTPException(
            status_code=404,
            detail="No student responses found for the given assignment, student, and question",
        )
    return student_responses
