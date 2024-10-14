// Create Assignment Query
export const CreateAssignmentQuery = async({ titleInput, instruction, points, dueDate, course_id }) => {
  let requestBody = {
    title: titleInput,
    instruction: instruction,
    points: points,
    due_date: dueDate,
    course_id: course_id
  };

  const token = localStorage.getItem("awesomeToken");
  if (!token) {
    throw new Error("Missing authentication token");
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const endpoint = '/api/assignments';
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Assignment failed');
  }

  return data;
};

// Update Assignment Query
export const UpdateAssignmentQuery = async({ titleInput, instruction, points, dueDate, course_id, assignment_id }) => {
  let requestBody = {
    title: titleInput,
    instruction: instruction,
    points: points,
    due_date: dueDate,
    course_id: course_id
  };

  const token = localStorage.getItem("awesomeToken");
  if (!token) {
    throw new Error("Missing authentication token");
  }

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const endpoint = `/api/assignments/${assignment_id}`;
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) { 
    throw new Error(data.detail || 'Assignment update failed');
  }

  return data;
}

// Get all assignments for a teacher
export const FetchAllAssignmentsQuery = async({ queryKey }) => {
  const token = localStorage.getItem("awesomeToken");
  const [_, { course_id }] = queryKey;
  
  if (!course_id) {
    throw new Error("Missing authentication token");
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const endpoint = `/api/courses/${course_id}/assignments`;  
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Fetching assignments failed');
  }

  return data;
};

// Get all assignments for a student
export const FetchAllAssignmetsForStudent = async({ queryKey }) => {
  const token = localStorage.getItem("awesomeToken");
  const [_, { idUser }, { course_id }] = queryKey;
  
  if(!course_id || !idUser) {
    throw new Error("Missing course_id or student_id");
  }

  const requestOptions = {
    method : 'GET',
    headers : {
      'Content-Type' : 'application/json',
      'Authorization' : `Bearer ${token}`,
    }
  }

  const endpoint = `/api/students/${idUser}/courses/${course_id}/assignments`;
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if(!response.ok) {
    throw new Error(data.detail || 'Fetching assignments student failed');
  }

  return data;
};


export const CreateQuestionsQuery = async ({ assignmentId, questions }) => {
  const requestBody = {
    assignment_id: assignmentId,
    questions: questions
  };

  const token = localStorage.getItem("awesomeToken");
  if (!token) {
    throw new Error("Missing authentication token");
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  };

  const endpoint = '/api/questions';
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Question creation failed');
  }

  return data;
};


export const FetchAllQuestions = async ({ queryKey }) => {
  const token = localStorage.getItem("awesomeToken");
  const [_, { assignment_id }] = queryKey;

  if (!assignment_id) {
    throw new Error("Missing assignment_id");
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  };

  const endpoint = `/api/questions/${assignment_id}`;
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Fetching questions failed');
  }

  return data;
};



export const SubmitAssignmentResponsesQuery = async ({ assignmentId, questions, studentId }) => {
  const token = localStorage.getItem("awesomeToken");

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      assignment_id: assignmentId,
      student_id: studentId,
      responses: questions.map(question => ({
        question_id: question.id,
        response_text: question.responseInput,
        file: question.file || null,  
      }))
    })
  };

  const endpoint = '/api/student_responses/';
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to submit student responses');
  }

  return data;
};
