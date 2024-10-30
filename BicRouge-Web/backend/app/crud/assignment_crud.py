from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from models.operation_models import Assignment, Enrollment
from schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentRead,
)
from schemas.teacher import TeacherRead


# Create a new assignment
async def create_assignment(
    user: TeacherRead, db: Session, assignment: AssignmentCreate
):
    db_assignment = Assignment(
        title=assignment.title,
        instruction=assignment.instruction,
        points=assignment.points,
        due_date=assignment.due_date,
        course_id=assignment.course_id,
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return AssignmentRead.from_orm(db_assignment)


# Get all assignments for a course
async def get_all_assignments(user: TeacherRead, db: Session, course_id: int):
    assignments = (
        db.query(Assignment)
        .filter(Assignment.course_id == course_id)
        .filter(Assignment.course.has(teacher_id=user.id))
        .all()
    )
    return list(map(AssignmentRead.from_orm, assignments))


# Select an assignment
async def assignment_selector(assignment_id: int, user: TeacherRead, db: Session):
    assignment = (
        db.query(Assignment)
        .filter(Assignment.course.has(teacher_id=user.id))
        .filter_by(id=assignment_id)
        .first()
    )
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


# Get selected assignment
async def get_assignment(assignment_id: int, user: TeacherRead, db: Session):
    assignment = await assignment_selector(assignment_id, user, db)
    return AssignmentRead.from_orm(assignment)


# Delete an assignment
async def delete_assignment(assignment_id: int, user: TeacherRead, db: Session):
    assignment = await assignment_selector(assignment_id, user, db)
    db.delete(assignment)
    db.commit()


# Update an assignment
async def update_assignment(
    assignment_id: int,
    assignment_data: AssignmentUpdate,
    user: TeacherRead,
    db: Session,
):
    assignment = await assignment_selector(assignment_id, user, db)
    for key, value in assignment_data.dict(exclude_unset=True).items():
        if key == "course_id":
            continue
        setattr(assignment, key, value)
    assignment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(assignment)
    return AssignmentRead.from_orm(assignment)


# Get student assignments
async def get_student_assignments(user, db: Session, student_id: int, course_id: int):
    # logger.info(
    #     f"Fetching enrollment for student_id: {student_id}, course_id: {course_id}"
    # )

    # Check if the student is enrolled in the course
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
            Enrollment.state == "enrolled",
        )
        .first()
    )

    if not enrollment:
        # logger.error(
        #     f"Enrollment not found for student_id: {student_id}, course_id: {course_id}"
        # )
        raise HTTPException(
            status_code=404, detail="Student not enrolled in the course"
        )

    # logger.info(f"Enrollment found: {enrollment}")

    # Fetch assignments for the course using the course_id from enrollment
    assignments = db.query(Assignment).filter(Assignment.course_id == course_id).all()

    # logger.info(f"Assignments fetched: {assignments}")

    return list(map(AssignmentRead.from_orm, assignments))
