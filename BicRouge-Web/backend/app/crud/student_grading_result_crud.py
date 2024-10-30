from sqlalchemy.orm import Session
from models import Assignment, Student, Enrollment, StudentResponse
from sqlalchemy import func


def get_all_assignments_and_students(db: Session, course_id: int):
    # Query to get all assignments in the course
    assignments_data = (
        db.query(
            Assignment.id, Assignment.title, Assignment.due_date, Assignment.points
        )
        .filter(Assignment.course_id == course_id)
        .all()
    )

    # Prepare the final result list
    result = []

    for assignment in assignments_data:
        # Query to get students, their emails, and total grades for each assignment
        student_data = (
            db.query(
                Student.id,
                Student.name,
                Student.postname,
                Student.email,
                func.sum(StudentResponse.grade).label("total_grade"),
            )
            .join(Enrollment, Enrollment.student_id == Student.id)
            .join(StudentResponse, StudentResponse.student_id == Student.id)
            .filter(
                Enrollment.course_id == course_id,
                StudentResponse.assignment_id == assignment.id,
            )
            .group_by(Student.id)
            .all()
        )

        # Append each assignment with its student data to the result list
        result.append(
            {
                "assignment": {
                    "id": assignment.id,
                    "title": assignment.title,
                    "due_date": assignment.due_date,
                    "points": assignment.points,
                },
                "students": [
                    {
                        "id": student.id,
                        "name": student.name,
                        "postname": student.postname,
                        "email": student.email,
                        "total_grade": student.total_grade,
                    }
                    for student in student_data
                ],
            }
        )

    return result


def update_student_grade_crud(
    db: Session, assignment_id: int, student_id: int, question_id: int, new_grade: int
):
    # Check if the student response exists
    student_response = (
        db.query(StudentResponse)
        .filter(
            StudentResponse.assignment_id == assignment_id,
            StudentResponse.student_id == student_id,
            StudentResponse.question_id == question_id,
        )
        .first()
    )

    if not student_response:
        return None

    # Initialize 'grades' list if it doesn't exist, or use an existing one
    if not hasattr(student_response, "grades") or not student_response.grades:
        student_response.grades = [
            student_response.grade
        ]  # Add the current grade as the first entry

    # Append the new grade to the 'grades' list
    student_response.grades.append(new_grade)

    # Update the 'grade' field with the most recent grade for convenience
    student_response.grade = new_grade

    # Save changes to the database
    db.commit()
    db.refresh(student_response)

    return student_response
