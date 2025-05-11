// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from "../hooks/useAuth.jsx";


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

   

const ProtectedRoute = ({  role, children }: ProtectedRouteProps) => {
  const location = useLocation(); 
 

  // useEffect(() => {
  //   checkAuth(); // Optional if not already triggered in the hook
  // }, []);

  const { user, loading, error } = useAuth();

    console.log('user', user);
  console.log('role', role);
  console.log('loading', loading);
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !role.includes(user.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }
  console.log('user', user);
  
  return      <> {children || (
    <Layout>
      <Outlet />
    </Layout>
  )} </>;
};

export default ProtectedRoute;
