export const FetchGradeInfoQuery = async({ queryKey }) => {
    const token = localStorage.getItem("awesomeToken");
    const [idUser, assignmentId] = queryKey; 
    
    if(!assignmentId || !idUser) {
        throw new Error("Missing course_id or student_id");
      }
    
      const requestOptions = {
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${token}`,
        }
      }
      const endpoint = `/api/grading_feedback/${idUser}/${assignmentId}`;
      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();

    
      if(!response.ok) {
        throw new Error(data.detail || 'Fetching assignments student failed');
      }
    
      return data;
};

export const FetchGradeInfoForTeacherQuery = async({ queryKey }) => {
  const token = localStorage.getItem("awesomeToken");
  const [course_id] = queryKey;
  
  if (!course_id) {
    throw new Error("Missing course_id");
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  };
  
  const endpoint = `/api/courses/${course_id}/all-assignments`;
  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Fetching all assignments failed');
  }

  return data;  
};


// Update grades for a student, including the assignment, student, and question
export const UpdateGradeInfoQuery = async({queryKey, data}) => {
  console.log(queryKey);
  const token = localStorage.getItem("awesomeToken");
  const [idUser, assignmentId] = queryKey;
  const { student_id, question_id, grade } = data; 
  
  if(!assignmentId || !student_id || !question_id) {
    throw new Error(`Missing assignment_id ${assignmentId}, student_id ${student_id}, or question_id ${question_id}`);
  }

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ grade }),

  };

  const endpoint = `/api/assignments/${assignmentId}/students/${student_id}/questions/${question_id}?grade=${grade}`;
  const response = await fetch(endpoint, requestOptions);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || 'Updating grade failed');
  }

  return result;
};

// Validate grades 
// here the endpoint /api/validate_assignment/{student_id}/{assignment_id}/
export const ValidateGradeInfoQuery = async({queryKey, data}) => {
  const token = localStorage.getItem("awesomeToken");
  const [student_id, assignment_id] = queryKey;
  const { grade } = data; 
  
  if(!assignment_id || !student_id) {
    throw new Error(`Missing assignment_id ${assignment_id} or student_id ${student_id}`);
  }

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ grade }),

  };

  const endpoint = `/api/validate_assignment/${student_id}/${assignment_id}/`;
  const response = await fetch(endpoint, requestOptions);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || 'Validating grade failed');
  }

  return result;
}
