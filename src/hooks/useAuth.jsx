import { useState, useEffect } from "react";

// Define the User type
type User = {
  id: string,
  name: string,
  email: string
  // Add other user fields
};

const useAuth = () => {
  // Corrected the useState hook type definition
  const [user, setUser] = (useState < User) | (null > null);
  const [loading, setLoading] = useState < boolean > true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
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

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return { user, loading, login, logout };
};

export default useAuth;
