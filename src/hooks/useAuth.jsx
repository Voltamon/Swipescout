import { createContext, useState, useEffect, useMemo, useCallback ,useContext } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup ,browserLocalPersistence ,signOut,  setPersistence } from "firebase/auth";
import { app } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
const [user, setUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { role: null }; // Default with role
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return { role: null }; // Always return an object with role
  }
});

// In your AuthProvider component


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
  // Add these constants at the top
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const TOKEN_REFRESH_BUFFER =5*60 * 1000; // Refresh token 5 minutes before expiration

const extendSession = () => {
  localStorage.setItem('sessionExpiry', Date.now() + SESSION_DURATION);
};





// Update storeTokens function
const storeTokens = (accessToken, refreshToken, userData) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('tokenExpiry', Date.now() + 7*60 *24 * 60 * 1000); // 55 minutes
  
  if (userData) {
    const userWithRefreshToken = {
      ...userData,
      refresh_token: refreshToken // Store refresh token in user object
    };
    localStorage.setItem('user', JSON.stringify(userWithRefreshToken));
    localStorage.setItem('role', userData?.role || null);
  }
};

const accessToken = localStorage.getItem('accessToken');

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('persistentToken');
};
// Update refreshTokens function
const refreshTokens = useCallback(async () => {
  try {
    console.log('[TEST] Attempting token refresh');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('[TEST] No refresh token available');
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      console.log('[TEST] Refresh request failed', response.status);
      throw new Error('Token refresh failed');
    }
    
    const { accessToken, refreshToken: newRefreshToken, user } = await response.json();
    console.log('[TEST] Refresh successful - storing new tokens');
    storeTokens(accessToken, newRefreshToken, user);
    return accessToken;
  } catch (error) {
    console.error('[TEST] Refresh failed:', error);
    clearTokens();
    setUser(null);
    setRole(null);
    throw error;
  }
}, [apiUrl]);

  // Logout
  const logout = useCallback(async () => {
    try {
      // Clear all local state first
      clearTokens();
      setUser(null);
      setRole(null);
      
      // Then try backend logout if token exists
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
  
      // Then Firebase logout
      try {
        await signOut(auth);
      } catch (firebaseError) {
        console.error('Firebase logout failed:', firebaseError);
      }
  
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure we clear state even if logout fails
      clearTokens();
      setUser(null);
      setRole(null);
      navigate("/login");
    }
  }, [apiUrl, navigate, auth]);


const checkAuth = useCallback(async () => {
  console.log('[TEST] Starting auth check');
  try {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    console.log('[TEST] Current auth state:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry)).toISOString() : null,
      currentTime: new Date().toISOString()
    });

    // ... rest of your checkAuth implementation
  } catch (error) {
    console.error('[TEST] Auth check failed:', error);
    await logout();
    throw error;
  } finally {
    setLoading(false);
  }
}, [apiUrl, logout, refreshTokens]);





// Helper to store user and role in localStorage and state
const storeAuthData = (userData, isFallback, accessToken = null) => {
  const safeUser = {
    ...(userData || {}),
    role: userData?.role || null
  };

  localStorage.setItem('user', JSON.stringify(safeUser));
  localStorage.setItem('role', safeUser.role);
  
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExpiry', Date.now() + 7*60 *24 * 60 * 1000); // 55 minutes
  }
  
  setUser(safeUser);
  setRole(safeUser.role);
  setFallbackMode(isFallback);
};
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Enhanced handleAuthSuccess
const handleAuthSuccess = useCallback(async (accessToken, refreshToken, provider, role, user, persistentToken = null, firebaseStatus = null) => {
  const userWithRefreshToken = {
    ...user,
    refresh_token: refreshToken // Store refresh token inside user
  };

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('user', JSON.stringify(userWithRefreshToken)); // Store user with refresh token
  localStorage.setItem('role', JSON.stringify(role));
  localStorage.setItem('tokenExpiry', Date.now() + 7*60 *24 * 60 * 1000);

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

    // Store tokens and user data
    storeTokens(data.accessToken, data.refreshToken, data.user);
    
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
    
    // Store tokens and user data
    storeTokens(data.accessToken, data.refreshToken, data.user);
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
    
    // Store tokens and user data
    storeTokens(data.accessToken, data.refreshToken, data.user);
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

    // Store all tokens and user data
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('tokenExpiry', Date.now() + 7*60 * 24 * 60 * 1000);
    // await storeTokens(data.accessToken, data.refreshToken, data.user);
    console.log('accessToken 11111111111:', data.accessToken);
    const userWithRefresh = {
      ...data.user,
      refresh_token: data.refreshToken
    };
    localStorage.setItem('user', JSON.stringify(userWithRefresh));
    localStorage.setItem('role', data.user.role);

    setUser(userWithRefresh);
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

  const initializeAuth = async () => {
    try {
      await checkAuth();
      
      // Check every 10 seconds for testing
      refreshInterval = setInterval(async () => {
        try {
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          if (tokenExpiry && Date.now() > parseInt(tokenExpiry) - TOKEN_REFRESH_BUFFER) {
            console.log('[TEST] Token nearing expiration - refreshing...');
            await refreshTokens();
          }
        } catch (error) {
          console.error('[TEST] Background refresh failed:', error);
        }
      }, 30000); // 10 seconds for testing
    } catch (error) {
      console.error('[TEST] Initial auth check failed:', error);
    }
  };

  initializeAuth();

  return () => {
    if (refreshInterval) clearInterval(refreshInterval);
  };
}, [checkAuth, refreshTokens]);
  
// In your auth provider
useEffect(() => {
  const expiry = localStorage.getItem('tokenExpiry');
  if (expiry && Date.now() > parseInt(expiry)) {
    console.log('Token expired - forcing logout');
    logout();
  }
}, [logout]);

console.log('[Auth] Current tokens:', {
  accessToken: !!localStorage.getItem('accessToken'),
  refreshToken: !!localStorage.getItem('refreshToken'),
  user: localStorage.getItem('user')
});

  // Memoize context value
  const contextValue = useMemo(() => ({
  user: user || { role: null }, // Ensure user always has role
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
    ,extendSession
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
    extendSession
  ]);

  // return (
  //   <AuthContext.Provider value={contextValue}>
  //     {children}
  //   </AuthContext.Provider>
  // );

  // Add this to your AuthProvider return statement
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
  <div>Token Expiry: {localStorage.getItem('tokenExpiry') ? 
    new Date(parseInt(localStorage.getItem('tokenExpiry'))).toLocaleString() : 'None'}</div>
  <div>Time Now: {new Date().toLocaleString()}</div>
  <div>Seconds Until Expiry: {localStorage.getItem('tokenExpiry') ? 
    Math.round((parseInt(localStorage.getItem('tokenExpiry')) - Date.now()) / 1000) : 'N/A'}</div>
  <button onClick={checkAuth}>Force Check Auth</button>
  <button onClick={refreshTokens}>Force Refresh</button>
  <button onClick={logout}>Force Logout</button>
</div> */}
  </AuthContext.Provider>
);
};

// Create a separate hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};