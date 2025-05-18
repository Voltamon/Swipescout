import { useState, useEffect } from "react";
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase-config.js";
import { Navigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";

const auth = getAuth(app);

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Common function to handle successful authentication
  const handleAuthSuccess = async (token, origin, role = null) => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      let idToken = token;
      let user;
      if (origin == "linkedin" || origin == "EmailPass") {
        console.log("Token received:::::::::::", token);
        const userCredential = await signInWithCustomToken(auth, token);
        user = userCredential.user;
        user.role = role;
        idToken = await user.getIdToken();
      }

      localStorage.setItem("accessToken", idToken);
      localStorage.setItem("user", user);
      setUser(user);
      setRole(role);
      console.log("User authenticated successfully:", user);
      console.log("Role set successfully:", role);
      console.log("userrrr:", user);
      return { success: true, user, role };
    } catch (error) {
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
      const role = localStorage.getItem("role");
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await verifyToken(token);
      setUser(data.user);
      setRole(role);
      setError(null);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError(err.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      setUser(null);
      Navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const loginByEmailAndPassword2 = async (email, password) => {
    try {
      console.log("Logging in with email and password:", email, password);
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log("Token verification response:", JSON.stringify({ email, password }));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      throw err;
    }
  }

  // Email/Password Login
  const loginByEmailAndPassword = async (email, password) => {
              localStorage.removeItem("accessToken");
    setUser(null);

    try {
      console.log("Logging in with email and password:", email);
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });



      console.log("Login response:", response.ok);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Login failed",
          status: response.status
        };
      }
      console.log("response ok:", data.role);

      console.log("Login successful:", data);
      return await handleAuthSuccess(data.token, "EmailPass", data.role);
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
         localStorage.removeItem("accessToken");
    setUser(null);
    try {
           

      // 1. Authenticate with Firebase Google Auth
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // 2. Determine endpoint based on role (signup vs signin)
      const endpoint = role
        ? `${apiUrl}/api/auth/signup/google`
        : `${apiUrl}/api/auth/signin/google`;

      console.log("Google ID Token:", JSON.stringify(role ? { idToken, role } : { idToken }));
      // 3. Send to backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` // Recommended way to send tokens
        },
        body: JSON.stringify(role ? { idToken, role } : { idToken })
      });

      console.log("Google Auth Response:", response.ok);
      // 4. Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await response.json();

      console.log("Google Auth Data:", data);
      console.log("Google Auth Role:", data.role);
      // 5. Process successful authentication
      return await handleAuthSuccess(idToken, "google", data.role);

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
        localStorage.removeItem("accessToken");
    setUser(null);
    try {
     
      console.log("[LinkedIn Auth] Starting authentication...");

      // 1. Open LinkedIn OAuth window
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/linkedin/callback')}&scope=${encodeURIComponent('openid profile email')}&state=${Date.now()}`;

      console.log("[LinkedIn Auth] Opening window with URL:", linkedinAuthUrl);

      const linkedinAuthWindow = window.open(
        linkedinAuthUrl,
        '_blank',
        'width=600,height=600'
      );

      if (!linkedinAuthWindow) {
        throw new Error("Popup window was blocked. Please allow popups for this site.");
      }

      // 2. Listen for the callback with the authorization code
      console.log("[LinkedIn Auth] Setting up message listener...");

      const result = await new Promise((resolve, reject) => {
        const messageListener = (event) => {
          console.log("[LinkedIn Auth] Received message:", event);

          if (event.origin === window.location.origin) {
            if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
              console.log("[LinkedIn Auth] Received success message");
              window.removeEventListener('message', messageListener);
              resolve(event.data.payload);
            } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
              console.log("[LinkedIn Auth] Received error message");
              window.removeEventListener('message', messageListener);
              reject(new Error(event.data.error || "LinkedIn authentication failed"));
            }
          }
        };

        window.addEventListener('message', messageListener);

        const timeoutId = setTimeout(() => {
          console.log("[LinkedIn Auth] Timeout reached");
          window.removeEventListener('message', messageListener);
          reject(new Error("LinkedIn authentication timed out."));
        }, 120000);

        // Cleanup function
        return () => {
          window.removeEventListener('message', messageListener);
          clearTimeout(timeoutId);
        };
      });

      console.log("[LinkedIn Auth] Received result from popup:", result);

      // 3. Now send to backend
      const endpoint = role
        ? `${apiUrl}/api/auth/signup/linkedin`
        : `${apiUrl}/api/auth/signin/linkedin`;

      console.log("[LinkedIn Auth] Sending to backend endpoint:", endpoint);

      let response;

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: result.id_token,
          ...(role ? { role } : {})
        })
      });



      console.log("[LinkedIn Auth] Backend response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("LinkedIn Auth error:", errorData);
        // throw new Error(errorData.error || "Authentication failed");
        return {
          error: true,
          message: errorData.error || "login dublicate or error"
        };
      }

      const responseData = await response.json();
      console.log("[LinkedIn Auth] Backend response data:", responseData);



      return await handleAuthSuccess(responseData.token, "linkedin", responseData.role);

    } catch (error) {
      console.error("[LinkedIn Auth] Full error:", error);
      return {
        error: true,
        message: error.message || "LinkedIn authentication failed"
      };
    }
  };
  // const authenticateWithLinkedIn = async (role) => {
  //   try {
  //     if (!role) {
  //       throw new Error("Role is required for LinkedIn authentication");
  //     }

  //     // Store role in session storage (more secure than localStorage for temp data)
  //     sessionStorage.setItem('linkedin_auth_role', role);

  //     // Redirect to LinkedIn OAuth in the same window
  //     const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/linkedin-callback')}&scope=${encodeURIComponent('openid profile email')}&state=${Date.now()}`;

  //     window.location.href = linkedInAuthUrl;

  //     // No return here as we're redirecting
  //   } catch (error) {
  //     console.error("LinkedIn authentication error:", error);
  //     return { 
  //       error: true, 
  //       message: error.message || "LinkedIn authentication failed" 
  //     };
  //   }
  // };

  // This should be called on your callback page (/linkedin-callback)
  // const handleLinkedInCallback = async () => {
  //   try {
  //     const params = new URLSearchParams(window.location.search);
  //     const code = params.get('code');
  //     const error = params.get('error');
  //     const role = sessionStorage.getItem('linkedin_auth_role');

  //     if (error) {
  //       throw new Error(error);
  //     }

  //     if (!code) {
  //       throw new Error("Authorization code not found");
  //     }

  //     // Exchange code for LinkedIn token via your backend
  //     const tokenResponse = await fetch(`${apiUrl}/api/auth/linkedin/token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ code })
  //     });

  //     if (!tokenResponse.ok) {
  //       throw new Error('Failed to exchange code for token');
  //     }

  //     // const { idToken } = await tokenResponse.json();

  //     // Authenticate with your backend (now including role for both sign-in and sign-up)
  //     const authEndpoint = `${apiUrl}/api/auth/linkedin`;
  //     const authResponse = await fetch(authEndpoint, {
  //       method: "POST",
  //       headers: { 
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ 
  //         idToken,
  //         role 
  //       })
  //     });

  //     if (!authResponse.ok) {
  //       throw new Error(await authResponse.text());
  //     }

  //     const { customToken, user } = await authResponse.json();

  //     // Sign in with Firebase custom token
  //     const userCredential = await signInWithCustomToken(auth, customToken);
  //     const idToken = await userCredential.user.getIdToken();

  //     // Store tokens and user info
  //     localStorage.setItem("accessToken", idToken);
  //     localStorage.setItem("role", role);

  //     // Clean up session storage
  //     sessionStorage.removeItem('linkedin_auth_role');

  //     // Redirect based on role
  //     // const redirectPath = getRoleRedirectPath(role);
  //     // window.location.href = redirectPath;
  //     return await handleAuthSuccess(idToken,"",role);

  //   } catch (error) {
  //     console.error("LinkedIn callback error:", error);
  //     // Redirect to error page or back to login
  //     window.location.href = '/login?error=' + encodeURIComponent(error.message);
  //   }
  // };





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
      console.log("Signup response:", response.ok);
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      console.log("Signup data:", data);

      if (!response.ok) {
        return {
          error: true,
          message: data.message || "Signup failed"
        }
      }

      // If the backend returns a token after signup, process it
      if (data.token) {
        return await handleAuthSuccess(data.token, "EmailPass", role);
      }
      else {
        return {
          error: true,
          message: "error in authentication",
        }
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