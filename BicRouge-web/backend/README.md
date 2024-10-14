## API Documentation

### Authentication

#### Teacher Login
- **Endpoint**: `/auth/teacher/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "username": "teacher@example.com",
        "password": "securepassword"
    }
    ```
- **Response**:
    ```json
    {
        "access_token": "string",
        "token_type": "bearer"
    }
    ```

#### Student Login
- **Endpoint**: `/auth/student/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "username": "student@example.com",
        "password": "securepassword"
    }
    ```
- **Response**:
    ```json
    {
        "access_token": "string",
        "token_type": "bearer"
    }
    ```

### Courses

#### Create Course (Teacher)
- **Endpoint**: `/courses`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "course_name": "Mathematics 101",
        "institution": "ABC University"
    }
    ```
- **Response**:
    ```json
    {
        "course_id": "12345",
        "course_code": "XYZ789"
    }
    ```

#### Join Course (Student)
- **Endpoint**: `/courses/join`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "course_code": "XYZ789"
    }
    ```
- **Response**:
    ```json
    {
        "message": "Successfully joined the course"
    }
    ```

### Assignments

#### Create Assignment (Teacher)
- **Endpoint**: `/assignments`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "course_id": "12345",
        "assignment_name": "Homework 1",
        "questions": [
            {
                "question_text": "What is 2+2?",
                "correct_answer": "4"
            }
        ],
        "grading_criteria": {
            "correct": 1,
            "partial": 0.5,
            "incorrect": 0
        }
    }
    ```
- **Response**:
    ```json
    {
        "assignment_id": "67890"
    }
    ```

#### Submit Assignment (Student)
- **Endpoint**: `/assignments/submit`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "assignment_id": "67890",
        "answers": [
            {
                "question_id": "1",
                "answer_text": "4"
            }
        ]
    }
    ```
- **Response**:
    ```json
    {
        "message": "Assignment submitted successfully"
    }
    ```

### Grading and Feedback

#### View Graded Assignments (Student)
- **Endpoint**: `/assignments/graded`
- **Method**: `GET`
- **Response**:
    ```json
    {
        "assignments": [
            {
                "assignment_id": "67890",
                "grade": "A",
                "feedback": "Great job!"
            }
        ]
    }
    ```

#### Review and Update Grading (Teacher)
- **Endpoint**: `/assignments/review`
- **Method**: `PUT`
- **Request Body**:
    ```json
    {
        "assignment_id": "67890",
        "student_id": "123",
        "updated_grade": "A+",
        "updated_feedback": "Excellent work!"
    }
    ```
- **Response**:
    ```json
    {
        "message": "Grading updated successfully"
    }
    ```
