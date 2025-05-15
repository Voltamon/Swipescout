import { useState, useEffect } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase-config.js";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";

const auth = getAuth(app);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Common function to handle successful authentication
  const handleAuthSuccess = async (token,origin,role=null) => {
    try {
      let idToken =token;
      let user;
      if(origin != "google") {
      const userCredential = await signInWithCustomToken(auth, token);
      user = userCredential.user;
      idToken = await user.getIdToken();
      }
   
      localStorage.setItem("accessToken", idToken);
      setUser(user);
      
      return { success: true, user ,role };
    } catch (error) {
      console.error("Authentication processing failed:", error);
      return { 
        error: true, 
        message: error.message || "Authentication processing failed" 
      };
    }
  };

  // Common function to verify token
  const verifyToken = async (token) => {
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
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await verifyToken(token);
      setUser(data.user);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError(err.message);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Email/Password Login
  const loginByEmailAndPassword = async (email, password) => {
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

      return await handleAuthSuccess(data.token);
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: true,
        message: error.message || "Login failed"
      };
    }
  };

  // Google Authentication (for both login and signup)
  const authenticateWithGoogle = async (role = null) => {
    try {
      // 1. Authenticate with Firebase Google Auth
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
  
      // 2. Determine endpoint based on role (signup vs signin)
      const endpoint = role 
        ? `${apiUrl}/api/auth/signup/google` 
        : `${apiUrl}/api/auth/signin/google`;
  
        console.log("Google ID Token:", JSON.stringify(role ? { idToken, role } : {idToken}));
      // 3. Send to backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` // Recommended way to send tokens
        },
        body: JSON.stringify(role ? { idToken, role } : {idToken})
      });
  
      console.log("Google Auth Response:", response);
      // 4. Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Authentication failed");
      }
  
      const data = await response.json();
      
      // 5. Process successful authentication
      return await handleAuthSuccess(idToken,"google",role);
      
    } catch (error) {
      console.error("Google authentication error:", error);
      // Consider signing out from Firebase if the backend auth failed
      await auth.signOut();
      return { 
        error: true, 
        message: error.message || "Google authentication failed" 
      };
    }
  };

  // LinkedIn Authentication (for both login and signup)
  const authenticateWithLinkedIn = async (role = null) => {
    try {
      if (role) {
        // For signup, store role and redirect
        sessionStorage.setItem('linkedin_signup_role', role);
        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=${encodeURIComponent('openid profile email')}&state=${Date.now()}`;
        return { pending: true };
      } else {
        // For login, use popup
        const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=${encodeURIComponent('openid profile email')}&state=${Date.now()}`;
        
        const popup = window.open(linkedInAuthUrl, '_blank', 'width=500,height=600');
        if (!popup) {
          throw new Error("Popup window failed to open. Please allow popups for this site.");
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

        return await handleAuthSuccess(result.token);
      }
    } catch (error) {
      console.error("LinkedIn authentication error:", error);
      return { 
        error: true, 
        message: error.message || "LinkedIn authentication failed" 
      };
    }
  };

  // Email/Password Signup
  const signupWithEmail = async (email, password, displayName, role) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName,
          role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }
 
         // If the backend returns a token after signup, process it
    if (response.token) {
      return await handleAuthSuccess(response.token);
    }
      // return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        error: true,
        message: error.message || "Signup failed"
      };
    }
  };

  const logout = async () => {
    await fetch(`${apiUrl}/api/auth/logout`, { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    // Login methods
    loginByEmailAndPassword,
    authenticateWithGoogle,
    authenticateWithLinkedIn,
    // Signup methods
    signupWithEmail,
    // Common methods
    logout,
    refreshAuth: checkAuth,
    handleAuthSuccess
  };
};