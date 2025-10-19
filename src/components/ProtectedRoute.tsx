// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';


interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  role?: string;
}

interface ProtectedRouteProps {
  user: User | null;
  role?: string[];
  loading?: boolean;
  children?: ReactNode;
}


// In ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { user, loading, role, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth({ silent: true }); // Use silent mode during initial check
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;