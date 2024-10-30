from sqlalchemy.orm import Session
from crud.grading_crud import get_questions_and_max_points, get_student_responses


async def assemble_grading_data(db: Session, assignment_id: int, student_id: int):
    # Fetch teacher's corrected assessment (questions and max points)
    questions = await get_questions_and_max_points(db, assignment_id)
    teacher_corrected_assessment = "\n".join(
        [
            f"Question {i+1} ({q['max_points']} points): {q['question_text']} \nRéponse : {q['correct_answer']}"
            for i, q in enumerate(questions)
        ]
    )

    # Define the grading criteria
    grading_criteria = f"Cette évaluation compte au total {len(questions)} question(s) et est cotée sur {sum(q['max_points'] for q in questions)} points."

    # Fetch student's responses
    student_responses = await get_student_responses(db, assignment_id, student_id)
    student_responses_text = "\n".join(
        [
            f"Question {i+1} Réponse: {r['response_text']}"
            for i, r in enumerate(student_responses)
        ]
    )

    # Max points for the entire assignment
    max_points = sum(q["max_points"] for q in questions)

    return {
        "teacher_corrected_assessment": teacher_corrected_assessment,
        "grading_criteria": grading_criteria,
        "student_responses": student_responses_text,
    }
