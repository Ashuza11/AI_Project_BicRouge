import re
import json
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.operation_models import (
    Question,
    TeacherResponse,
    StudentResponse,
    Feedback,
)


async def get_questions_and_max_points(db: Session, assignment_id: int):
    # Query to get questions, max points, and teacher responses for the assignment
    stmt = (
        select(
            Question.question_text, Question.max_points, TeacherResponse.response_text
        )
        .join(TeacherResponse, TeacherResponse.question_id == Question.id)
        .where(Question.assignment_id == assignment_id)
    )

    results = db.execute(stmt).all()

    questions_and_points = [
        {
            "question_text": row.question_text,
            "max_points": row.max_points,
            "correct_answer": row.response_text,
        }
        for row in results
    ]

    return questions_and_points


async def get_student_responses(db: Session, assignment_id: int, student_id: int):
    # Query to get student responses for the specific assignment and student
    stmt = (
        select(StudentResponse.question_id, StudentResponse.response_text)
        .where(StudentResponse.assignment_id == assignment_id)
        .where(StudentResponse.student_id == student_id)
    )

    results = db.execute(stmt).all()

    student_responses = [
        {"question_id": row.question_id, "response_text": row.response_text}
        for row in results
    ]

    return student_responses


def process_llm_output(llm_output: dict) -> tuple:
    """
    Processes the LLM output by cleaning and extracting the necessary JSON data.

    Args:
        llm_output (dict): The raw output from the LLM.

    Returns:
        tuple: Contains advice and grading dictionary.
    """
    # Extract the 'advice' and 'grading' content from the LLM output dictionary
    advice = llm_output.get("advice", "")
    grading = llm_output.get("grading", {})

    # Ensure grading is a dictionary
    if not isinstance(grading, dict):
        raise ValueError("Invalid grading format in the LLM output.")

    # # Clean up the output string by removing non-JSON text using a regex
    # json_start = re.search(r'{\s*"advice"', llm_output_str)
    # if json_start:
    #     clean_json_str = llm_output_str[json_start.start() :]
    # else:
    #     raise ValueError("The LLM output does not contain valid JSON data.")

    # # Safely load the cleaned JSON string
    # try:
    #     llm_data = json.loads(clean_json_str)
    # except json.JSONDecodeError as e:
    #     raise ValueError(f"Failed to parse JSON: {e}")

    # # Extract advice and grading
    # advice = llm_data.get("advice", "")
    # grading = llm_data.get("grading", {})

    return advice, grading


def store_advice(db: Session, assignment_id: int, student_id: int, advice: str):
    # Retrieve the StudentResponse record
    student_response = (
        db.query(StudentResponse)
        .filter_by(assignment_id=assignment_id, student_id=student_id)
        .first()
    )

    if student_response:
        # Check if feedback already exists for this StudentResponse
        feedback = (
            db.query(Feedback)
            .filter_by(student_response_id=student_response.id)
            .first()
        )

        if not feedback:
            # Create new feedback if it doesn't exist
            feedback = Feedback(
                assignment_id=assignment_id,
                student_response_id=student_response.id,
                advice=advice,
            )
            db.add(feedback)
        else:
            # Update existing feedback
            feedback.advice = advice

        db.commit()


# def get_student_grade_record(db: Session, assignment_id: int, student_id: int):
#     # This function handles the complex join between StudentGrade, Assignment, and Enrollment
#     return (
#         db.query(StudentGrade)
#         .select_from(StudentGrade)
#         .join(Assignment, StudentGrade.assignment_id == Assignment.id)
#         .join(Enrollment, Assignment.course_id == Enrollment.course_id)
#         .filter(Assignment.id == assignment_id, Enrollment.student_id == student_id)
#         .first()
#     )


# # Sum all the student grades and return the total grade
# def calculate_total_grade(db: Session, student_id: int, assignment_id: int) -> float:
#     # Query to get all student responses for a specific student and assignment
#     student_responses = (
#         db.query(StudentResponse)
#         .filter_by(student_id=student_id, assignment_id=assignment_id)
#         .all()
#     )

#     # Sum all grades
#     total_grade = sum(
#         response.grade for response in student_responses if response.grade is not None
#     )

#     return total_grade


def store_grading(db: Session, assignment_id: int, student_id: int, grading: dict):
    for question_key, grade_data in grading.items():
        try:
            question_id = int(question_key)
        except ValueError:
            raise ValueError(f"Invalid question key format: {question_key}")

        note = grade_data.get("note")
        comment = grade_data.get("commentaires")

        # Find the corresponding student response based on assignment_id, student_id, and question_id
        student_response = (
            db.query(StudentResponse)
            .filter_by(
                assignment_id=assignment_id,
                student_id=student_id,
                question_id=question_id,
            )
            .first()
        )
        if student_response:
            student_response.grade = note
            student_response.comment = comment
        else:
            print(
                f"No student response found for assignment_id={assignment_id}, student_id={student_id}, question_id={question_id}"
            )

    db.commit()


def process_and_store_llm_output(
    db: Session, llm_output: str, assignment_id: int, student_id: int
):
    # Step 1: Log the raw LLM output
    print(f"Raw LLM Output: {llm_output}")

    # Step 1: Process the LLM output
    advice, grading = process_llm_output(llm_output)

    print(f"Advice: {advice}")
    print(f"Grading: {grading}")

    # Step 2: Store the advice
    store_advice(db, assignment_id, student_id, advice)

    # Step 3: Store the grading
    store_grading(db, assignment_id, student_id, grading)


def get_student_grading_feedback(db: Session, student_id: int, assignment_id: int):
    # Retrieve all student responses for the assignment and student
    student_responses = (
        db.query(StudentResponse)
        .filter(
            StudentResponse.student_id == student_id,
            StudentResponse.assignment_id == assignment_id,
        )
        .all()
    )

    if not student_responses:
        return None

    # Retrieve the global advice from any of the feedback records
    feedback = (
        db.query(Feedback)
        .filter(
            Feedback.assignment_id == assignment_id,
            Feedback.student_response_id == student_responses[0].id,
        )
        .first()
    )
    advice = feedback.advice if feedback else None
    state = feedback.state if feedback else None

    # Construct the return data structure for grading feedback
    grading_feedback = []
    for response in student_responses:
        grading_feedback.append(
            {
                "response_text": response.response_text,
                "grade": response.grade,
                "grades": response.grades,
                "comment": response.comment,
                "question_id": response.question_id,
            }
        )

    return {
        "grading_feedback": grading_feedback,
        "advice": advice,
        "state": state,
    }


def validate_student_assignment(db: Session, student_id: int, assignment_id: int):
    # Retrieve student response for the assignment
    student_response = (
        db.query(StudentResponse)
        .filter(
            StudentResponse.student_id == student_id,
            StudentResponse.assignment_id == assignment_id,
        )
        .first()
    )

    if not student_response:
        raise HTTPException(
            status_code=404,
            detail=f"No student response found for assignment_id={assignment_id} and student_id={student_id}",
        )

    # Retrieve feedback associated with the student response
    feedback = (
        db.query(Feedback)
        .filter(Feedback.student_response_id == student_response.id)
        .first()
    )

    if feedback:
        feedback.state = True  # Set the state to True for validation
    else:
        raise HTTPException(
            status_code=404,
            detail=f"No feedback found for student_response_id={student_response.id}",
        )

    db.commit()
    db.refresh(feedback)
    return feedback
