from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import course_route as course
from api.routes import teacher_route as teacher
from api.routes import student_route as student
from api.routes import teacher_auth_route as teacher_auth
from api.routes import student_auth_route as student_auth
from api.routes import assignment_route as assignment
from api.routes import grading_route as grading
from api.routes import question_route as question
from api.routes import student_response_route as student_response
from api.routes import enrollment_route as enrollment
from db.init_db import init_db

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app running on localhost
    "http://localhost:8000",  # FastAPI running on localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/home")
async def root():
    return {"message": "Bic Rouge !"}


# Routers
app.include_router(teacher.router, prefix="/api/teachers", tags=["teachers"])
app.include_router(student.router, prefix="/api/students", tags=["students"])
app.include_router(teacher_auth.router, prefix="/api/teacher", tags=["auth"])
app.include_router(student_auth.router, prefix="/api/student", tags=["auth"])
app.include_router(assignment.router, prefix="/api", tags=["assignment"])
app.include_router(course.router, prefix="/api", tags=["courses"])
app.include_router(grading.router, prefix="/api", tags=["grading"])
app.include_router(question.router, prefix="/api", tags=["Questions"])
app.include_router(student_response.router, prefix="/api", tags=["Student Response"])
app.include_router(enrollment.router, prefix="/api", tags=["Enrollment"])


@app.on_event("startup")
def on_startup():
    init_db()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
