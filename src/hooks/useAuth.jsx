import { useState, useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";


const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const auth = getAuth();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }
 
        const response = await fetch(apiUrl+"/api/verify-token?verifyOnly=true", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

const login = async (email, password) => {
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

    const userCredential = await signInWithCustomToken(auth, data.accessToken);
    const idToken = await user.getIdToken();
    
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

  return { user, loading, login, logout };
};

// Only one default export per file
 