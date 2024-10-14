from datetime import datetime
from db.session import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Float,
    JSON,
)
from sqlalchemy.orm import relationship


class Course(Base):
    __tablename__ = "course"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    section = Column(String)
    subject = Column(String)
    code = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    teacher_id = Column(Integer, ForeignKey("teacher.id"))
    teacher = relationship("Teacher", back_populates="courses")
    assignments = relationship(
        "Assignment", back_populates="course", cascade="all, delete-orphan"
    )
    enrollments = relationship(
        "Enrollment", back_populates="course", foreign_keys="Enrollment.course_id"
    )


class Enrollment(Base):
    __tablename__ = "enrollment"
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=datetime.utcnow)
    state = Column(
        String, nullable=False, default="enrolled"
    )  # enrolled, completed, failed
    student_id = Column(Integer, ForeignKey("student.id"))
    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    student = relationship("Student", back_populates="enrollments")
    course_code = Column(String, ForeignKey("course.code"))
    course = relationship(
        "Course", back_populates="enrollments", foreign_keys=[course_id]
    )


class Assignment(Base):
    __tablename__ = "assignment"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    instruction = Column(Text)
    points = Column(Integer, nullable=False)
    # type = Column(String)
    composition = Column(
        Boolean, default=False
    )  # (False, True) doesn't ha composition, has composition
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    course_id = Column(Integer, ForeignKey("course.id"))
    course = relationship("Course", back_populates="assignments")
    questions = relationship(
        "Question", back_populates="assignment", cascade="all, delete-orphan"
    )
    student_responses = relationship(
        "StudentResponse", back_populates="assignment", cascade="all, delete-orphan"
    )
    feedbacks = relationship(
        "Feedback", back_populates="assignment", cascade="all, delete-orphan"
    )


class TeacherResponse(Base):
    __tablename__ = "teacher_response"

    id = Column(Integer, primary_key=True, index=True)
    response_text = Column(Text, nullable=False)
    question_id = Column(Integer, ForeignKey("question.id"), nullable=False)
    question = relationship("Question", back_populates="teacher_responses")


class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    max_points = Column(Integer, nullable=False)
    assignment = relationship("Assignment", back_populates="questions")
    assignment_id = Column(Integer, ForeignKey("assignment.id"))
    student_responses = relationship(
        "StudentResponse", back_populates="question", cascade="all, delete-orphan"
    )
    teacher_responses = relationship(
        "TeacherResponse", back_populates="question", cascade="all, delete-orphan"
    )


class StudentResponse(Base):
    __tablename__ = "student_response"
    id = Column(Integer, primary_key=True)
    response_text = Column(Text, nullable=False)
    grade = Column(Float, nullable=True)
    grades = Column(JSON, nullable=True)  # List of old and new grades
    comment = Column(Text, nullable=True)
    file = Column(String, nullable=True)
    assignment_id = Column(Integer, ForeignKey("assignment.id"))
    student_id = Column(Integer, ForeignKey("student.id"))
    assignment = relationship("Assignment", back_populates="student_responses")
    question_id = Column(Integer, ForeignKey("question.id"))
    question = relationship("Question", back_populates="student_responses")

    # One-to-One relationship with Feedback
    feedback = relationship(
        "Feedback", back_populates="student_response", uselist=False
    )


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    advice = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    state = Column(Boolean, default=False)  # (False, True) disapproved, approved
    assignment_id = Column(Integer, ForeignKey("assignment.id"))
    assignment = relationship("Assignment", back_populates="feedbacks")
    # One-to-One relationship with StudentResponse
    student_response_id = Column(
        Integer, ForeignKey("student_response.id"), unique=True
    )
    student_response = relationship("StudentResponse", back_populates="feedback")
