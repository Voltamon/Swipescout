import { useState, useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "../firebase-config.js";


const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const auth = getAuth(app);
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyToken = async (token) => {
    try {
      // GET requests shouldn't have a body - use URL parameters instead
      const response = await fetch(`${apiUrl}/api/auth/verify-token?verifyOnly=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      console.log("User data:", data.user);
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
  
const loginByEmailAndPassword = async (email, password) => {
  try {
    const response = await fetch(apiUrl+"/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

       
    // Check if response has content before parsing
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      // Return error information
      return {
        error: true,
        message: data.message || "Login failed",
        status: response.status
      };
    }
    console.log("Login response:", data.token);

    const userCredential = await signInWithCustomToken(auth, data.token);
    const user = userCredential.user;
      
    // Get the ID token
    const idToken = await user.getIdToken();
    console.log("ID Token:", idToken);
    localStorage.setItem("accessToken", idToken);

    setUser(data.user);

    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: true,
      message: error.message || "Login failed"
    };
  }
};

  const logout = async () => {
    await fetch(apiUrl+"/api/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

 return { 
    user, 
    loading, 
    error,
    loginByEmailAndPassword, 
    logout,
    refreshAuth: checkAuth // Optional: allow manual refresh
  };
};