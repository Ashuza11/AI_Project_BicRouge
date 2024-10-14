import { createContext, useEffect, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("awesomeToken") || null);
    const [userRole, setUserRole] = useState(localStorage.getItem("userRoleL") || null); 
    const [idUser, setIdUser] = useState(null);
    const [course_id, setCourse_id] = useState(null);
    const [userData, setUserData] = useState(null); 
    const queryClient = useQueryClient();


    // for queries refresh
    const refetchCourses = () => {
        queryClient.invalidateQueries(['cours']);
        queryClient.invalidateQueries(['coursStudent', idUser]); 
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUserRole(null); 
                return;
            } 

            const requestOptions = {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            };

            try {
                let endpoint = '';
                if (userRole === 'teacher') {
                    endpoint = '/api/teacher/me';
                } else if (userRole === 'student') {
                    endpoint = '/api/student/me';
                }
                const response = await fetch(endpoint, requestOptions);
                const data = await response.json();

                if (!response.ok) {
                    setToken(null);
                    setUserRole(null); 
                    setIdUser(0);
                    localStorage.setItem("awesomeToken", null);
                } else {
                    setIdUser(data.id);
                    setUserData(data);
                    localStorage.setItem("awesomeToken", token);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setToken(null);
                setUserRole(null);
                setIdUser(0);
            }
        };

        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ token, setToken, userRole, setUserRole, idUser, setIdUser, refetchCourses, course_id, setCourse_id, userData }}>
            {props.children}
        </UserContext.Provider>
    );
};