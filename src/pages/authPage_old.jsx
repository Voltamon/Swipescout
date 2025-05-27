import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Stack
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LinkedIn as LinkedInIcon
} from "@mui/icons-material";
import { LinkedIn } from "react-linkedin-login-oauth2";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { app } from "firebase-config.js";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false
  });
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const apiUrl  = import.meta.env.VITE_API_BASE_URL;


  // Email/Password Sign-In
  const handleEmailSignIn = async e => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken(true);

      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: response.code })
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log("Sign-in successful:", data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);

      const response = await fetch(`${apiUrl}/api//auth/signin/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log("Google sign-in success:", data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  // LinkedIn Success Handler
  const handleLinkedInSuccess = async response => {
    setLoading({ ...loading, linkedin: true });
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api//auth/signin/linkedin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_token: response.id_token // Send id_token directly
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  // LinkedIn Error Handler
  const handleLinkedInFailure = error => {
    const errorMessage = error.errorMessage || "LinkedIn sign-in failed";
    setError(errorMessage);

    if (window.opener) {
      window.opener.postMessage(
        {
          type: "LINKEDIN_AUTH_ERROR",
          error: errorMessage
        },
        window.location.origin
      );
      window.close();
    }
  };

  // Message Listener for Popup
  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "LINKEDIN_AUTH_RESPONSE") {
        handleLinkedInSuccess({ id_token: event.data.id_token });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>

        {/* Email/Password Form */}
        <Box component="form" onSubmit={handleEmailSignIn} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading.email}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading.email ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR CONTINUE WITH
          </Typography>
        </Divider>

        <Stack direction="row" spacing={2} justifyContent="center">
          {/* Google Button */}
          <Button
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={loading.google}
            startIcon={<GoogleIcon />}
            sx={{
              flex: 1,
              py: 1.5,
              borderColor: "#DB4437",
              color: "#DB4437",
              "&:hover": { borderColor: "#C1351A" }
            }}
          >
            {loading.google ? <CircularProgress size={24} /> : "Google"}
          </Button>

          {/* LinkedIn Button */}
          <LinkedIn
            clientId="{import.meta.env.VITE_LINKEDIN_CLIENT_ID}"
            onSuccess={response => {
              // Close the popup immediately after getting the response
              window.close();
              handleLinkedInSuccess(response);
            }}
            onError={error => {
              window.close();
              handleLinkedInFailure(error);
            }}
            redirectUri={`${window.location.origin}/linkedin-callback`} // Special callback route
            scope="openid profile email"
          >
            {({ linkedInLogin }) =>
              <Button
                variant="outlined"
                onClick={() => {
                  // Open popup manually for better control
                  const popup = window.open(
                    "",
                    "linkedin-auth",
                    "width=600,height=600,toolbar=0,location=0"
                  );
                  linkedInLogin();
                }}
                // ... rest of button props ...
              >
                {loading.linkedin ? <CircularProgress size={24} /> : "LinkedIn"}
              </Button>}
          </LinkedIn>
        </Stack>

        {error &&
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>}
      </Paper>
    </Container>
  );
};

export default AuthPage;
