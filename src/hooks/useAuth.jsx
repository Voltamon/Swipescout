import { createContext, useState, useEffect, useMemo, useCallback ,useContext } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";

  // Handle successful authentication
  const handleAuthSuccess = useCallback(async (token, origin, role = null, userP = null) => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      let idToken = token;
      let user = userP;
      
      if (origin === "linkedin" || origin === "EmailPass") {
        const userCredential = await signInWithCustomToken(auth, token);
        user = userCredential.user;
        user.role = role;
        idToken = await user.getIdToken();
      }
      localStorage.setItem("accessToken", JSON.stringify(idToken));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", JSON.stringify(role));
      setUser(JSON.stringify(user));
      setRole(role);
      
      return { success: true, user:(JSON.stringify(user)), role };
    } catch (error) {
      return {
        error: true,
        message: error.message || "Authentication processing failed"
      };
    }
  }, [auth]);

  // Verify token with backend
  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-token?verifyOnly=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Token verification failed:", err);
      throw err;
    }
  }, [apiUrl]);

  // Refresh token if needed
  const refreshTokenIfNeeded = useCallback(async (token) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-token?verifyOnly=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });


      if (!response.ok) {
        const refreshResponse = await fetch(`${apiUrl}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

          
        
        if (!refreshResponse.ok) throw new Error('Token refresh failed'); 
        const userCredential = await signInWithCustomToken(auth, token);
        const userNew = userCredential.user;
        const newToken = await userNew.getIdToken();
        // const newToken = await refreshResponse.json();
        localStorage.setItem("accessToken", JSON.stringify(newToken));
        return newToken;
      }

      return token;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  }, [apiUrl]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      let token = JSON.parse(localStorage.getItem("accessToken"));
      const user = JSON.parse(localStorage.getItem("user"));
      const storedRole = JSON.parse(localStorage.getItem("role"));

      if (!token) {
        setLoading(false);
        return;
      }


      token = await refreshTokenIfNeeded(token);
      const data = await verifyToken(token);
      
      setUser(user);
      setRole(storedRole);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [refreshTokenIfNeeded, verifyToken]);

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
      return await handleAuthSuccess(data.token, "EmailPass", data.role);
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
      const idToken = await result.user.getIdToken();

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
  }, [apiUrl, navigate]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
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
    checkAuth,
    handleAuthSuccess
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