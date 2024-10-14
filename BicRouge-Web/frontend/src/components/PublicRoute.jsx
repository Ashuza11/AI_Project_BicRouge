import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PublicRoute = ({ element: Component, ...rest }) => {
  const { token, userRole } = useContext(UserContext);

  if (token) {
    const dashboardPath = userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    return <Navigate to={dashboardPath} />;
  }

  return <Component {...rest} />;
};

export default PublicRoute;