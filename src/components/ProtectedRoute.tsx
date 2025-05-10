// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

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

const ProtectedRoute = ({ user, role, loading = false, children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !role.includes(user.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return      <> {children || (
    <Layout>
      <Outlet />
    </Layout>
  )} </>;
};

export default ProtectedRoute;
