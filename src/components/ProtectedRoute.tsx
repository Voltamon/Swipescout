// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  children?: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ user, children, roles }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// Usage examples:
// Basic protection (any authenticated user)
// <Route element={<ProtectedRoute user={user} />}>...</Route>

// Role-specific protection
// <Route element={<ProtectedRoute user={user} roles={['employer']} />}>...</Route>