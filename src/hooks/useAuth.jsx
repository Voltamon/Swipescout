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
const TOKEN_DURATION =  60 * 1000; // 7 days in ms 7 * 24 * 60 *
const TOKEN_REFRESH_BUFFER =25 * 1000; // *60 Refresh token 15 minutes before expiration

const extendSession = () => {
  localStorage.setItem('sessionExpiry', Date.now() + SESSION_DURATION);
};





// Update storeTokens function
const storeTokens = (accessToken, refreshToken, userData) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('tokenExpiry', Date.now() + TOKEN_DURATION); // 55 minutes
  
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
  console.log('[AUTH] Starting authentication check');
  try {
    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    
    console.log('[AUTH] Current auth state:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry)).toLocaleString() : 'None',
      secondsUntilExpiry: tokenExpiry ? Math.round((parseInt(tokenExpiry) - Date.now()) / 1000) : 'N/A',
      currentTime: new Date().toLocaleString(),
      userRole: userData?.role || 'None'
    });

    // If no tokens available at all
    if (!accessToken && !refreshToken) {
      console.log('[AUTH] No authentication tokens found');
      throw new Error('No tokens available');
    }

    // First try to verify the access token if it exists
    if (accessToken) {
      try {
        console.log('[AUTH] Verifying access token');
        const verifyResponse = await fetch(`${apiUrl}/api/auth/verify-token?verifyOnly=true`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('[AUTH] Verification response status:', verifyResponse.status);
        
        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          console.log('[AUTH] Token is valid:', {
            userId: data.userId,
            email: data.email,
            role: data.role
          });
          
          // Update stored data if needed
          storeAuthData(userData, false, accessToken);
          return;
        }
        
        // If verification failed but we have a response
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.warn('[AUTH] Token verification failed:', {
          status: verifyResponse.status,
          error: errorData.error || 'Unknown error'
        });
        
        throw new Error('Token verification failed');
      } catch (verifyError) {
        console.warn('[AUTH] Token verification error:', verifyError.message);
        // Continue to try refresh if available
      }
    }

    // If we have a refresh token, try to use it
    if (refreshToken) {
      try {
        console.log('[AUTH] Attempting token refresh with refresh token');
        const newAccessToken = await refreshTokens();
        
        if (newAccessToken) {
          console.log('[AUTH] Token refresh successful');
          return;
        }
        
        console.log('[AUTH] Refresh returned no new token');
        throw new Error('Refresh failed - no new token');
      } catch (refreshError) {
        console.error('[AUTH] Token refresh failed:', refreshError.message);
        throw refreshError;
      }
    }

    // If we get here, authentication has failed
    console.log('[AUTH] Authentication failed - no valid tokens');
    throw new Error('Authentication failed');
  } catch (error) {
    console.error('[AUTH] Authentication check failed:', {
      error: error.message,
      stack: error.stack
    });
    
    // Clear invalid tokens and logout
    clearTokens();
    setUser(null);
    setRole(null);
    
    // Only navigate if we're not already on login page
    if (!window.location.pathname.includes('/login')) {
      console.log('[AUTH] Redirecting to login');
      navigate('/login');
    }
    
    throw error;
  } finally {
    console.log('[AUTH] Authentication check complete');
    setLoading(false);
  }
}, [apiUrl, logout, refreshTokens, navigate]);




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
    localStorage.setItem('tokenExpiry', Date.now() + TOKEN_DURATION); // 55 minutes
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
  localStorage.setItem('tokenExpiry', Date.now() + TOKEN_DURATION);

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
    localStorage.setItem('tokenExpiry', Date.now() + TOKEN_DURATION);
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


const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      ...payload,
      expDate: new Date(payload.exp * 1000),
      iatDate: new Date(payload.iat * 1000)
    };
  } catch (e) {
    console.error('Token decode error:', e);
    return null;
  }
};



  
useEffect(() => {
  console.log('[AUTH] Setting up refresh interval');
  let refreshInterval;
  let isMounted = true; // Track if component is mounted

  const initializeAuth = async () => {
    try {
      console.log('[AUTH] Running initial auth check');
      await checkAuth();
      
      // Start refresh interval
      refreshInterval = setInterval(async () => {
        if (!isMounted) return; // Don't run if unmounted
        
        try {
          console.log('[AUTH] Interval check running');
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          const currentTime = Date.now();
          
          console.log('[AUTH] Token check:', {
            tokenExpiry,
            parsedExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
            currentTime,
            buffer: TOKEN_REFRESH_BUFFER,
            shouldRefresh: tokenExpiry && currentTime > (parseInt(tokenExpiry) - TOKEN_REFRESH_BUFFER)
          });

          if (tokenExpiry && currentTime > (parseInt(tokenExpiry) - TOKEN_REFRESH_BUFFER)) {
            console.log('[AUTH] Token nearing expiration - refreshing...');
            await refreshTokens();
            console.log('[AUTH] Refresh completed');
          }
        } catch (error) {
          console.error('[AUTH] Background refresh failed:', error);
        }
      }, 3000); // 3 seconds for testing

      console.log('[AUTH] Refresh interval set up');
    } catch (error) {
      console.error('[AUTH] Initial auth check failed:', error);
    }
  };

  initializeAuth();

  return () => {
    console.log('[AUTH] Cleaning up refresh interval');
    isMounted = false;
    if (refreshInterval) {
      clearInterval(refreshInterval);
      console.log('[AUTH] Interval cleared');
    }
  };
}, [checkAuth, refreshTokens, TOKEN_REFRESH_BUFFER]); // Add TOKEN_REFRESH_BUFFER to dependencies
  
  
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
    {/* Temporary debug panel - remove for production*/}
     <div style={{
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
  
    <h5>Backend Token</h5>
    {accessToken && (
      <>
        <div>Issued At: {decodeToken(accessToken)?.iatDate.toLocaleString()}</div>
        <div>Expires At: {decodeToken(accessToken)?.expDate.toLocaleString()}</div>
        <div>Seconds Left: {decodeToken(accessToken)?.exp - Math.floor(Date.now()/1000)}</div>
      </>
      )}
      
      <h5>Verification</h5>
  <button onClick={async () => {
    try {
      const res = await fetch(`${apiUrl}/api/auth/verify-token?verifyOnly=true`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      console.log('Verification response:', data);
      alert(`Token valid until: ${new Date(data.expiresAt).toLocaleString()}`);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed - check console');
    }
  }}>
    Verify Token on Server
      </button>
      <div  style={{
  width: '150px',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal'
}}>Access Token Payload: {JSON.stringify(decodeToken(localStorage.getItem('accessToken'))).iatDate}</div>
      <div  style={{
  width: '150px',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal'
}}>Refresh Token Payload: {JSON.stringify(decodeToken(localStorage.getItem('refreshToken'))).iatDate}</div>
      
  <div>Time Now: {new Date().toLocaleString()}</div>
  <div>Seconds Until Expiry: {localStorage.getItem('tokenExpiry') ? 
    Math.round((parseInt(localStorage.getItem('tokenExpiry')) - Date.now()) / 1000) : 'N/A'}</div>
  <button onClick={checkAuth}>Force Check Auth</button>
  <button onClick={refreshTokens}>Force Refresh</button>
  <button onClick={logout}>Force Logout</button>
</div>  
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