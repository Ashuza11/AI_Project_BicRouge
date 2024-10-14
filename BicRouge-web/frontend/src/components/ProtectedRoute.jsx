import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const { token } = useContext(UserContext);

  return token ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;