// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from "../hooks/useAuth";


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


const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { user, loading, role } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to="/login" replace />; //unauthorized access
  }

  return (
    <Layout role={role}>
      {children || <Outlet />}
    </Layout>
  );
};

export default ProtectedRoute;
