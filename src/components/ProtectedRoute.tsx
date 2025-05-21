// src/components/ProtectedRoute.tsx
import { useEffect } from 'react'; // Import from React, not react-router-dom
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialized && !loading) {
      const isUnauthorized = allowedRoles && user?.role && !allowedRoles.includes(user.role);
      
      if (!user) {
        navigate('/login', {
          state: { from: location },
          replace: true
        });
      } else if (isUnauthorized) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [user, loading, initialized, navigate, location, allowedRoles]);

  if (!initialized || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;