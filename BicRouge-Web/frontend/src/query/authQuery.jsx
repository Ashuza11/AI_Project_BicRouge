export const loginUser = async ({ email, password, role }) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=password&username=${email}&password=${password}`,
    };

    const endpoint = role === 'teacher' ? '/api/teacher/token' : '/api/student/token';
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
    }

    return data;
};



export const singupUser = async ({userRole, name, postName, lastName, email, password, selectedInstitutionId, newInstitutionName, newInstitutionDescription}) => {
    let requestBody;

    if (userRole === 'teacher') {
        if (selectedInstitutionId) {
            // Teacher with existing institution
            requestBody = {
            name,
            postname: postName,
            last_name: lastName,
            email,
            password,
            institution_id: selectedInstitutionId,
            is_active: true,
            };
        }  else {
            // Teacher with new institution
            requestBody = {
                name,
                postname: postName,
                last_name: lastName,
                email,
                password,
                new_institution: {
                name: newInstitutionName,
                description: newInstitutionDescription,
                },
                is_active: true,
            };
            }
    } else {
         // Student registration
        requestBody = {
        name,
        postname: postName,
        last_name: lastName,
        email,
        hashed_password: password,
        is_active: true,
        };
    }
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    const endpoint = (userRole === 'teacher') ? '/api/teachers/register' : '/api/students/register';
    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
    }

    return data;
}