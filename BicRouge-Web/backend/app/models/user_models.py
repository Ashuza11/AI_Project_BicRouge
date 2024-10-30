from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from db.base import Base

teacher_institution = Table(
    "teacher_institution",
    Base.metadata,
    Column("teacher_id", Integer, ForeignKey("teacher.id")),
    Column("institution_id", Integer, ForeignKey("institution.id")),
)


class Institution(Base):
    __tablename__ = "institution"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    teachers = relationship(
        "Teacher", secondary=teacher_institution, back_populates="institutions"
    )


class Teacher(Base):
    __tablename__ = "teacher"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    postname = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    institutions = relationship(
        "Institution", secondary=teacher_institution, back_populates="teachers"
    )
    courses = relationship("Course", back_populates="teacher")


class Student(Base):
    __tablename__ = "student"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    postname = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    hashed_password = Column(String, nullable=False)
    enrollments = relationship("Enrollment", back_populates="student")
