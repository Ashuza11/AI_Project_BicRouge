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

    const endpoint = `/api/courses/${course_id}/teacher-and-students`;
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

  
    if (!response.ok) {
      throw new Error(data.detail || 'Fetching all assignments failed');
    }
  
    return data;  
};
  