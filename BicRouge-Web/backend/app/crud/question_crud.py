from sqlalchemy.orm import Session
from models.operation_models import Question, TeacherResponse, Assignment
from schemas.question import AssignmentQuestionsCreate
from schemas.question import QuestionUpdate


def create_questions(db: Session, assignment_questions: AssignmentQuestionsCreate):
    created_questions = []

    for question in assignment_questions.questions:
        db_question = Question(
            question_text=question.question_text,
            max_points=question.max_points,
            assignment_id=assignment_questions.assignment_id,
        )
        db.add(db_question)
        db.commit()
        db.refresh(db_question)

        # Create TeacherResponse entries
        for teacher_answer in question.teacher_answers:
            db_teacher_response = TeacherResponse(
                response_text=teacher_answer["answer_text"], question_id=db_question.id
            )
            db.add(db_teacher_response)

        db.commit()
        db.refresh(db_question)
        created_questions.append(db_question)

    # Update Assignment's composition status
    assignment = (
        db.query(Assignment)
        .filter(Assignment.id == assignment_questions.assignment_id)
        .first()
    )
    if assignment:
        assignment.composition = True
        db.commit()
        db.refresh(assignment)

    return created_questions


def get_questions_by_assignment(db: Session, assignment_id: int):
    # Fetch questions associated with the assignment
    questions = db.query(Question).filter(Question.assignment_id == assignment_id).all()

    # Create a new list with reassigned question IDs
    reassigned_questions = []
    for idx, question in enumerate(questions, start=1):
        reassigned_questions.append(
            {
                "id": question.id,
                "reassigned_id": idx,
                "question_text": question.question_text,
                "max_points": question.max_points,
                "assignment_id": question.assignment_id,
            }
        )

    # Return the new list with reassigned question IDs
    return reassigned_questions


def update_question_crud(
    db: Session, question_id: int, question_update: QuestionUpdate
):
    # Retrieve the question from the database
    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        return None

    # Update the question fields
    question.question_text = question_update.question_text
    question.max_points = question_update.max_points
    question.assignment_id = (
        question_update.assignment_id
    )  # if assignment can be changed

    # Commit the changes to the database
    db.commit()
    db.refresh(question)

    return question
