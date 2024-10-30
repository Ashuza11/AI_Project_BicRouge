export const createCourseQuery = async({courseName,section, selectedValue, idUser}) => {
    let requestBodyCreate = {
        name: courseName,
        section: section,
        subject: selectedValue,
        teacher_id: idUser,
    };

    const requestOptionsCreate = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("awesomeToken")}`,
        },
        body: JSON.stringify(requestBodyCreate),
    };

    const endpointCreate = '/api/courses';
    const response = await fetch(endpointCreate, requestOptionsCreate);
    const data = await response.json(); // Utilisez response1 ici, pas response

    if (!response.ok) {
        throw new Error(data.detail || 'Course failed');
    }
  
    return data;
};

export const joinCourseQuery = async({idUser, codeCourse}) => {
    let requestBodyJoin = {
      student_id: idUser,
      course_code : codeCourse, 
    };

      const token = localStorage.getItem("awesomeToken");

      const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBodyJoin),
    };

    const endpointJoin = '/api/enrollments/';
    const response = await fetch(endpointJoin, requestOptions);
    const data = await response.json(); // Utilisez response1 ici, pas response

    if (!response.ok) {
      throw new Error(data.detail || 'Join failed');
    }

    return data;
};

export const getCoursUser = async () => {
  const endpoint = '/api/courses';

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("awesomeToken")}`, 
    },
  };

  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data || 'Get courses faild ');
  } 

  return data;
};

export const getCoursStudent = async ({queryKey}) => {
  const [_, { idUser }] = queryKey;

  if (!idUser) {
    throw new Error('idStudent is required');
  }
  
  const endpoint = `/api/students/${idUser}/courses`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("awesomeToken")}`, 
    },
  };

  const response = await fetch(endpoint, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data || 'Get courses faild ');
  } 

  return data;
};