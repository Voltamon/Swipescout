import { createContext, useState, useEffect, useMemo, useCallback ,useContext } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup ,browserLocalPersistence ,signOut,  setPersistence } from "firebase/auth";
import { app } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole ? JSON.parse(storedRole) : null;
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const auth = getAuth(app);

  setPersistence(auth, browserLocalPersistence);
  
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";
  // Add these constants at the top
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // Refresh token 5 minutes before expiration

const extendSession = () => {
  localStorage.setItem('sessionExpiry', Date.now() + SESSION_DURATION);
};


  // New token management functions
  const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('tokenExpiry', Date.now() + 55 * 60 * 1000); // 55 minutes
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
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

      if (!response.ok) throw new Error('Token refresh failed');
      
      const { accessToken, refreshToken: newRefreshToken } = await response.json();
      storeTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      clearTokens();
      throw error;
    }
  }, [apiUrl]);

  // Modified handleAuthSuccess
  const handleAuthSuccess = useCallback(async (accessToken, refreshToken, origin, role = null, userP = null) => {
    try {
      storeTokens(accessToken, refreshToken);
      // localStorage.setItem('sessionExpiry', Date.now() + SESSION_DURATION);


      let idToken = accessToken;
      let user = userP;
      let userFB;
      
      if (origin === "linkedin" || origin === "EmailPass") {
        const userCredential = await signInWithCustomToken(auth, accessToken);
        userFB = userCredential.user;
        userFB.role = role;
        idToken = await userFB.getIdToken(true);
      }
      await auth.setPersistence(browserLocalPersistence);

      localStorage.setItem("accessToken", JSON.stringify(idToken));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(role));
      
      setUser(user);
      setRole(role);
      
      return { success: true, user:(JSON.stringify(user)), role };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Authentication processing failed"
      };
    }
  }, [auth]);

  // New token verification flow
  const verifyAccessToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, [apiUrl]);

  // Updated checkAuth
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken || !refreshToken) {
        throw new Error('No tokens available');
      }

      // Check if token is expired or about to expire
      const isExpired = Date.now() > parseInt(localStorage.getItem('tokenExpiry') || 0);
      
      if (isExpired) {
        await refreshTokens();
      } else {
        const isValid = await verifyAccessToken(accessToken);
        if (!isValid) await refreshTokens();
      }

      // Verify the (possibly refreshed) token
      const currentToken = localStorage.getItem('accessToken');
      const response = await fetch(`${apiUrl}/api/auth/verify-token`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (!response.ok) throw new Error('Token verification failed');
      
      const userData = await response.json();
      setUser(userData.user);
      setRole(userData.role);
      setError(null);
    } catch (error) {
      clearTokens();
      setUser(null);
      setRole(null);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, refreshTokens, verifyAccessToken]);

  // Email/Password Login
  const loginByEmailAndPassword = useCallback(async (email, password) => {
    localStorage.removeItem("accessToken");
    setUser(null);

    try {
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Login failed",
          status: response.status
        };
      }
      return await handleAuthSuccess(data.token, "EmailPass", data.role ,data.user);
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: true,
        message: error.message || "Login failed"
      };
    }
  }, [apiUrl, handleAuthSuccess]);

  // Google Authentication
  const authenticateWithGoogle = useCallback(async (role = null) => {
    localStorage.removeItem("accessToken");
    setUser(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);

      const endpoint = role
        ? `${apiUrl}/api/auth/signup/google`
        : `${apiUrl}/api/auth/signin/google`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(role ? { idToken, role } : { idToken })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await response.json();
      return await handleAuthSuccess(idToken, "google", data.role, data.user);
    } catch (error) {
      console.error("Google authentication error:", error);
      await auth.signOut();
      return {
        error: true,
        message: error.message || "Google authentication failed"
      };
    }
  }, [apiUrl, auth, handleAuthSuccess]);

  // LinkedIn Authentication
  const authenticateWithLinkedIn = useCallback(async (role = null) => {
    localStorage.removeItem("accessToken");
    setUser(null);
    
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

        const timeoutId = setTimeout(() => {
          window.removeEventListener('message', messageListener);
          reject(new Error("LinkedIn authentication timed out."));
        }, 120000);

        return () => {
          window.removeEventListener('message', messageListener);
          clearTimeout(timeoutId);
        };
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
        const errorData = await response.json().catch(() => ({}));
        return {
          error: true,
          message: errorData.error || "login duplicate or error"
        };
      }

      const responseData = await response.json();
      return await handleAuthSuccess(responseData.token, "linkedin", responseData.role);
    } catch (error) {
      console.error("LinkedIn authentication error:", error);
      return {
        error: true,
        message: error.message || "LinkedIn authentication failed"
      };
    }
  }, [apiUrl, LINKEDIN_CLIENT_ID, handleAuthSuccess]);

  // Email Signup
  const signupWithEmail = useCallback(async (email, password, displayName, role) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName, role })
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Signup failed"
        };
      }

      if (data.token) {
        return await handleAuthSuccess(data.token, "EmailPass", role);
      } else {
        return {
          error: true,
          message: "error in authentication",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        error: true,
        message: error.message || "Signup failed"
      };
    }
  }, [apiUrl, handleAuthSuccess]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, { method: "POST" });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser(null);
      setRole(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
    signOut(auth)
  .then(() => {
    console.log("User signed out successfully");
    // Optionally redirect or update UI
  })
  .catch((error) => {
    console.error("Sign-out error:", error);
  });
  }, [apiUrl, navigate]);

  // Initial auth check
  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  const stableCheckAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Session sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'sessionExpiry' || 
          e.key === 'accessToken' || 
          e.key === 'user' || 
          e.key === 'role') {
        stableCheckAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [stableCheckAuth]);

  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check existing session
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
          throw new Error('Session expired');
        }
  
        await checkAuth();
        
        // Set up the refresh interval only after successful auth
        const refreshInterval = setInterval(async () => {
          try {
            await refreshTokens();
          } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
          }
        }, TOKEN_REFRESH_BUFFER); // Refresh just before expiration
        
        return () => clearInterval(refreshInterval);
      } catch (error) {
        console.error('Initial auth check failed:', error);
        logout();
      }
    };
  
    initializeAuth();
  }, [checkAuth]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    user,
    role,
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
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