import { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, signOut, setPersistence } from "firebase/auth";
import { app } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { role: null };
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return { role: null };
    }
  });

  const [role, setRole] = useState(() => {
    try {
      const storedRole = localStorage.getItem('role');
      return storedRole || null;
    } catch (e) {
      console.error("Failed to parse role from localStorage", e);
      return null;
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const navigate = useNavigate();
  
  const auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";

  const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

  const storeTokens = (accessToken, refreshToken, userData, accessExpiresIn, refreshExpiresIn) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessExpiresTime', (Date.now() + (accessExpiresIn * 1000)).toString());
    localStorage.setItem('refreshExpiresTime', (Date.now() + (refreshExpiresIn * 1000)).toString());
    
    if (userData) {
      const userWithRefreshToken = {
        ...userData,
        refresh_token: refreshToken
      };
      localStorage.setItem('user', JSON.stringify(userWithRefreshToken));
      localStorage.setItem('role', userData?.role || null);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessExpiresTime');
    localStorage.removeItem('refreshExpiresTime');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('persistentToken');
  };

  const refreshTokens = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          clearTokens();
          setUser(null);
          setRole(null);
          navigate('/login');
        }
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const { accessToken, refreshToken: newRefreshToken, user, accessExpiresIn, refreshExpiresIn } = await response.json();
      storeTokens(accessToken, newRefreshToken, user, accessExpiresIn, refreshExpiresIn);
      return accessToken;
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    }
  }, [apiUrl, navigate]);

  const logout = useCallback(async () => {
    try {
      clearTokens();
      setUser(null);
      setRole(null);
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await fetch(`${apiUrl}/api/auth/logout`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (backendError) {
          console.error('Backend logout failed:', backendError);
        }
      }
  
      try {
        await signOut(auth);
      } catch (firebaseError) {
        console.error('Firebase logout failed:', firebaseError);
      }
  
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      clearTokens();
      setUser(null);
      setRole(null);
      navigate("/");
    }
  }, [apiUrl, navigate, auth]);

  const checkAuth = useCallback(async (options = { silent: false }) => {
    try {
      setLoading(true);

      const pathname = window.location.pathname;
    
      // Skip auth check for public routes
      const publicRoutes = [
       
        '/signup',
        '/about',
        '/FAQs',
        '/unauthorized',
        '/auth/linkedin/callback',
        '/forgot-password',
        '/reset-password',
        '/',
        '/jobseeker-profile/:id',
        '/employer-profile/:id',
        '/register-form',
        '/home-page',
        '/authpage',
        '/auth/linkedin/callback',
        '/check-it',
        '/employer-explore-public',
        '/Explore-jobs-public',
        '/video-feed/:vid',
         '/jobseeker-video-feed/:vid',
       '/forgot-password',
         '/reset-password/:oobCode',
          '/jobseeker-profile/:id',
                '/employer-profile/:id',
                '/videos/:pagetype',
        '/video-player/:id',
                '/videos/all' ,
                '/how-it-works',
                '/pricing',
                '/contact',
                '/page-near-future'
        
      ];
      
      
           
              
 
      const isPublicRoute = publicRoutes.some(route => {
        // Handle dynamic routes like '/jobseeker-profile/:id'
        if (route.includes(':')) {
          const basePath = route.split('/:')[0];
          return pathname.startsWith(basePath);
        }
        return pathname === route;
      });
  
      if (isPublicRoute) {
        return; // Skip auth check for public routes
      }
  
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const accessExpiresTime = parseInt(localStorage.getItem('accessExpiresTime'), 10);
      const refreshExpiresTime = parseInt(localStorage.getItem('refreshExpiresTime'), 10);

      if (window.location.pathname.includes('/login')) return;

      if (!accessToken && !refreshToken) {
        if (!options.silent) navigate('/login');
        throw new Error('No tokens available');
      }

      // Check if refresh token is expired
      if (refreshToken && refreshExpiresTime && Date.now() > refreshExpiresTime) {
        if (!options.silent) navigate('/login');
        throw new Error('Refresh token expired');
      }

      // Check if access token needs refresh
      if (accessToken && accessExpiresTime) {
        if (Date.now() < accessExpiresTime - TOKEN_REFRESH_BUFFER) {
          return;
        }
        
        if (refreshToken) {
          try {
            await refreshTokens();
            return;
          } catch (refreshError) {
            if (!options.silent) navigate('/login');
            throw refreshError;
          }
        }
      }

      if (!options.silent) navigate('/login');
      throw new Error('Authentication failed');
    } catch (error) {
      if (!options.silent) console.error('Authentication check failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, refreshTokens]);

  const storeAuthData = (userData, isFallback, accessExpiresIn, refreshExpiresIn, accessToken = null) => {
    const safeUser = {
      ...(userData || {}),
      role: userData?.role || null
    };

    localStorage.setItem('user', JSON.stringify(safeUser));
    localStorage.setItem('role', safeUser.role);
    
    if (accessToken) {
      localStorage.setItem('accessExpiresTime', (Date.now() + (accessExpiresIn * 1000)).toString());
      localStorage.setItem('refreshExpiresTime', (Date.now() + (refreshExpiresIn * 1000)).toString());
      localStorage.setItem('accessToken', accessToken);
    }
    
    setUser(safeUser);
    setRole(safeUser.role);
    setFallbackMode(isFallback);
  };

  const handleAuthSuccess = useCallback(async (accessToken, refreshToken, provider, role, user, accessExpiresIn, refreshExpiresIn, persistentToken = null, firebaseStatus = null) => {
    const userWithRefreshToken = {
      ...user,
      refresh_token: refreshToken
    };

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userWithRefreshToken));
    localStorage.setItem('role', role);
    localStorage.setItem('accessExpiresTime', (Date.now() + (accessExpiresIn * 1000)).toString());
    localStorage.setItem('refreshExpiresTime', (Date.now() + (refreshExpiresIn * 1000)).toString());

    setUser(userWithRefreshToken);
    setRole(role);
    setFallbackMode(firebaseStatus === 'fallback');
    return { success: true, user: userWithRefreshToken, role, provider };
  }, []);

  // Email/Password Login
const loginByEmailAndPassword = useCallback(async (email, password) => {
  try {
    const response = await fetch(`${apiUrl}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Login failed",
        status: response.status
      };
    }

    // Store tokens and user data, passing the accessExpiresIn from the backend response
    storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn);

    setUser(data.user);
    setRole(data.user?.role || null);
    
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: true,
      message: error.message || "Login failed"
    };
  }
}, [apiUrl]);

  // Google Authentication
const authenticateWithGoogle = useCallback(async (role = null) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(true);

    const endpoint = role
      ? `${apiUrl}/api/auth/signup/google`
      : `${apiUrl}/api/auth/signin/google`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, ...(role ? { role } : {}) })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google authentication failed");
    }

    const data = await response.json();
    
    // Store tokens and user data, passing the accessExpiresIn from the backend response
    storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn);
    setUser(data.user);
    setRole(data.user?.role || null);
    
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error("Google auth error:", error);
    await signOut(auth);
    return {
      error: true,
      message: error.message || "Google authentication failed"
    };
  }
}, [apiUrl, auth]);

  // LinkedIn Authentication
const authenticateWithLinkedIn = useCallback(async (role = null) => {
  try {
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=${encodeURIComponent('openid profile email')}&state=${Date.now()}`;

    const linkedinAuthWindow = window.open(
      linkedinAuthUrl,
      '_blank',
      'width=600,height=600'
    );

    if (!linkedinAuthWindow) {
      throw new Error("Popup window was blocked. Please allow popups for this site.");
    }

    const result = await new Promise((resolve, reject) => {
      const messageListener = (event) => {
        if (event.origin === window.location.origin) {
          if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
            window.removeEventListener('message', messageListener);
            resolve(event.data.payload);
          } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
            window.removeEventListener('message', messageListener);
            reject(new Error(event.data.error || "LinkedIn authentication failed"));
          }
        }
      };

      window.addEventListener('message', messageListener);
    });

    const endpoint = role
      ? `${apiUrl}/api/auth/signup/linkedin`
      : `${apiUrl}/api/auth/signin/linkedin`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: result.id_token,
        ...(role ? { role } : {})
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "LinkedIn authentication failed");
    }

    const data = await response.json();
    
    // Store tokens and user data, passing the accessExpiresIn from the backend response
    storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn);
    setUser(data.user);
    setRole(data.user?.role || null);
    
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error("LinkedIn auth error:", error);
    return {
      error: true,
      message: error.message || "LinkedIn authentication failed"
    };
  }
}, [apiUrl, LINKEDIN_CLIENT_ID]);

  // Email Signup
const signupWithEmail = useCallback(async (email, password, displayName, role) => {
  try {
    clearTokens(); // Clear any existing tokens before signup
    const response = 
    await fetch(`${apiUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, role })
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        error: true,
        message: data.message || "Signup failed",
        status: response.status
      };
    }

    // Store all tokens and user data, using data.accessExpiresIn from the backend
    storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn);
    
    setUser(data.user);
    setRole(data.user.role);
    
    return { 
      success: true, 
      user: data.user,
      role: data.user.role
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error: true,
      message: error.message || "Signup failed"
    };
  }
}, [apiUrl]);


  
useEffect(() => {
  let refreshInterval;

  const checkTokenRefresh = async () => {
    const accessExpiresTime = parseInt(localStorage.getItem('accessExpiresTime'), 10);
    const refreshExpiresTime = parseInt(localStorage.getItem('refreshExpiresTime'), 10);
    const now = Date.now();

    // If refresh token is expired, logout
    if (refreshExpiresTime && now > refreshExpiresTime) {
      await logout();
      return;
    }

    // If access token needs refresh
    if (accessExpiresTime && now > accessExpiresTime - TOKEN_REFRESH_BUFFER) {
      try {
        await refreshTokens();
      } catch (error) {
        console.error('Background refresh failed:', error);
      }
    }
  };

  const initializeAuth = async () => {
    try {
      await checkAuth();
      refreshInterval = setInterval(checkTokenRefresh, 30000); // Check every 30 seconds
    } catch (error) {
      console.error('Initial auth check failed:', error);
    }
  };

  initializeAuth();
  return () => clearInterval(refreshInterval);
}, [checkAuth, refreshTokens, logout]);

useEffect(() => {
  const refreshExpiresTime = parseInt(localStorage.getItem('refreshExpiresTime'), 10);
  if (refreshExpiresTime && Date.now() > refreshExpiresTime) {
    console.log('Refresh token expired - forcing logout');
    logout();
  }
}, [logout]);

const contextValue = useMemo(() => ({
  user: user || { role: null },
  role: role || null,
  loading, 
  error,
  loginByEmailAndPassword,
  authenticateWithGoogle,
  authenticateWithLinkedIn,
  signupWithEmail,
  logout,
  refreshAuth: checkAuth,
  refreshTokens,
  checkAuth,
  handleAuthSuccess
}), [
  user,
  role,
  loading,
  error, 
  loginByEmailAndPassword,
  authenticateWithGoogle,
  authenticateWithLinkedIn,
  signupWithEmail,
  logout,
  refreshTokens,
  checkAuth,
  handleAuthSuccess,
]);

return (
  <AuthContext.Provider value={contextValue}>
       {children}
    {/* Temporary debug panel - remove for production */}
    {/* <div style={{
  position: 'fixed',
  bottom: 0,
  right: 0,
  backgroundColor: 'white',
  padding: '10px',
  border: '1px solid #ccc',
  zIndex: 1000
}}>
  <h4>Auth Debug</h4>
  <div>Access Token: {localStorage.getItem('accessToken') ? '✅' : '❌'}</div>
  <div>Refresh Token: {localStorage.getItem('refreshToken') ? '✅' : '❌'}</div>
  <div>Token Expiry: {localStorage.getItem('accessExpiresTime') ? 
    new Date(parseInt(localStorage.getItem('accessExpiresTime'))).toLocaleString() : 'None'}</div>
  <div>Time Now: {new Date().toLocaleString()}</div>
  <div>Seconds Until Expiry: {localStorage.getItem('accessExpiresTime') ? 
    Math.round((parseInt(localStorage.getItem('accessExpiresTime')) - Date.now()) / 1000) : 'N/A'}</div>
  <button onClick={checkAuth}>Force Check Auth</button>
  <button onClick={refreshTokens}>Force Refresh</button>
  <button onClick={logout}>Force Logout</button>
</div> */}
</AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
  throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};