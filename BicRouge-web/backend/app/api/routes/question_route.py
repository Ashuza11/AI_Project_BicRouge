from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.init_db import get_db
from core.security import check_user_active
from crud.question_crud import create_questions, get_questions_by_assignment
from schemas.question import AssignmentQuestionsCreate, Question, QuestionUpdate
from crud.question_crud import update_question_crud
from typing import List

router = APIRouter()


@router.post("/questions", response_model=List[Question])
async def create_questions_endpoint(
    assignment_questions: AssignmentQuestionsCreate,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    return create_questions(db=db, assignment_questions=assignment_questions)


@router.get("/questions/{assignment_id}", response_model=List[Question])
async def get_questions_assignment_endpoint(
    assignment_id: int, db: Session = Depends(get_db), user=Depends(check_user_active)
):
    questions = get_questions_by_assignment(db, assignment_id=assignment_id)
    if not questions:
        raise HTTPException(
            status_code=404, detail="No questions found for the given assignment"
        )
    return questions


@router.put("/questions/{question_id}", response_model=QuestionUpdate)
async def update_question(
    question_id: int,
    question_update: QuestionUpdate,
    db: Session = Depends(get_db),
    user=Depends(check_user_active),
):
    updated_question = update_question_crud(db, question_id, question_update)
    if not updated_question:
        raise HTTPException(
            status_code=404, detail="Question not found or update failed"
        )
    return updated_question
