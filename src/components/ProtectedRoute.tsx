// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect  } from 'react';
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

    


const ProtectedRoute = ({   children }) => {
  const location = useLocation();
  const { user, logout ,loading} = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
      //  user =  JSON.parse(localStorage.getItem("user"));
  // const role =  JSON.parse(localStorage.getItem("role"));

console.log("-------------------- :",user);

  if (!user) {
    // Redirect to login but save the current location to return to after login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return      <> {children || (
    <Layout role={user.role}>
      <Outlet />
    </Layout>
  )} </>;
};

export default ProtectedRoute;
