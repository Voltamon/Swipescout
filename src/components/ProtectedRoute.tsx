// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../types'; // Assuming you have a User type

interface ProtectedRouteProps {
  user: User | null;
  children?: ReactNode;
  roles?: string[]; // Optional role restrictions
}

export const ProtectedRoute = ({ user, children, roles }: ProtectedRouteProps) => {
  const location = useLocation();

  // 1. Check if user is authenticated
  if (!user) {
    // Redirect to login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has required role (if specified)
  if (roles && !roles.includes(user.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If all checks pass, render the child routes
  return <>{children}</>;
};

// Usage examples:
// Basic protection (any authenticated user)
// <Route element={<ProtectedRoute user={user} />}>...</Route>

// Role-specific protection
// <Route element={<ProtectedRoute user={user} roles={['employer']} />}>...</Route>