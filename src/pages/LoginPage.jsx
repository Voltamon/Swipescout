import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
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
  Stack,
  styled,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { LinkedIn } from "react-linkedin-login-oauth2";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase-config.js";
import { useAuth } from "../hooks/useAuth.jsx";

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const LoginFormContainer = styled(Paper)(({ theme }) => ({
  width: 400,
  padding: theme.spacing(3),
  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
}));

const LoginFormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.25),
}));

const LoginFormSubtitle = styled(Typography)(({ theme }) => ({
  color: '#888',
  marginBottom: theme.spacing(2.5),
}));

const InputField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  borderRadius: '5px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : theme.palette.grey[700],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& input': {
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[900],
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  backgroundColor: '#5c6bc0',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SocialDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& .MuiDivider-wrapper': {
    color: '#888',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(0, 0.5),
  padding: theme.spacing(1.25),
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
}));

const GoogleSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#DB4437', // Google red
  border: `1px solid #DB4437`,
  '&:hover': {
    backgroundColor: '#fbe3e1',
  },
  '&:active': { // Style for the active (pressed) state
    backgroundColor: 'rgb(235, 216, 164) !important', // Keep the hover color or use another light red
  },
  '&.Mui-focusVisible': {
      outline: '2px solid #1976d2',
      backgroundColor: 'rgb(235, 216, 164) !important',
  },
 '&:visited': {
            color: 'rgb(235, 230, 164) !important', /* Visited color for this specific link */
  },
}));

const LinkedInSignInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#0077b5', // LinkedIn blue
  color: 'white',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));

const SignupLink = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2.5),
  color: '#888',
  cursor: 'pointer', // Added cursor for better UX with navigate
}));

const LoginPage = () => {
  const { loginByEmailAndPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    google: false,
    linkedin: false,
  });
  const [error, setError] = useState(null);
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSignIn = async e => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading({ ...loading, email: false });
      return;
    }

    const result = await loginByEmailAndPassword(formData.email, formData.password);

    if (result.error) {
      setError(result.message || "Login failed. Please try again.");
    } else {
      navigate("/dashboard");
      console.log("Login successful:", result);
    }

    setLoading({ ...loading, email: false });
  };

  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("Google id token:", idToken);

      const response = await fetch("http://localhost:5000/api/auth/signin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }, console.log("Google sign-in success:", result));

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log("Google sign-in success:", data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  const handleLinkedInSuccess = async (response) => {
    setLoading({ ...loading, linkedin: true });
    setError(null);
    console.log("LinkedIn response:", response);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.id_token }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      console.log("LinkedIn sign-in success:", data);

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "LINKEDIN_AUTH_SUCCESS",
            payload: data
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
      if (window.opener) {
        window.opener.postMessage(
          { type: "LINKEDIN_AUTH_ERROR", error: err.message },
          window.location.origin
        );
        window.close();
      }
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  const handleLinkedInFailure = (error) => {
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

  useEffect(() => {
    const handleAuthSuccess = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
        navigate('/dashboard');
      }
    };
    window.addEventListener('message', handleAuthSuccess);
    return () => window.removeEventListener('message', handleAuthSuccess);
  }, [navigate]);

  const navigateToRegister = () => {
    navigate("/register-form");
  };

  return (
    <LoginContainer>
      <LoginFormContainer>
        <LoginFormTitle variant="h5">Welcome Back</LoginFormTitle>
        <LoginFormSubtitle>Log in to your account</LoginFormSubtitle>
        <Box component="form" onSubmit={handleEmailSignIn}>
          <InputField
            label="Enter your email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <InputField
            label="Enter your password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
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
              ),
            }}
          />
          <LoginButton type="submit" disabled={loading.email}>
            {loading.email ? <CircularProgress size={24} color="inherit" /> : "Log In"}
          </LoginButton>
        </Box>

        <SocialDivider>
          <Typography variant="body2">Or log in with</Typography>
        </SocialDivider>

        <Stack direction="row" spacing={1}>
          <GoogleSignInButton
            variant="contained"
            onClick={handleGoogleSignIn}
            disabled={loading.google}
            startIcon={<GoogleIcon />}
          >
            {loading.google ? <CircularProgress size={24} color="inherit" /> : "Google"}
          </GoogleSignInButton>
          <LinkedIn
            clientId="78aceunh672c3c"
            onSuccess={handleLinkedInSuccess}
            onError={handleLinkedInFailure}
            scope="openid profile email"
            redirectUri="http://localhost:5173/dashboard"
          >
            {({ linkedInLogin }) => (
              <LinkedInSignInButton
                variant="contained"
                onClick={linkedInLogin}
                disabled={loading.linkedin}
                startIcon={<LinkedInIcon />}
              >
                {loading.linkedin ? <CircularProgress size={24} color="inherit" /> : "LinkedIn"}
              </LinkedInSignInButton>
            )}
          </LinkedIn>
        </Stack>

        <SignupLink onClick={navigateToRegister}>
          Don't have an account? Sign Up
        </SignupLink>
      </LoginFormContainer>
    </LoginContainer>
  );
};

export default LoginPage;

// import React, { useState,useEffect } from "react";
// import { useNavigate } from 'react-router-dom';

// import {
//   AppBar,
//   Toolbar,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Divider,
//   CircularProgress,
//   Alert,
//   IconButton,
//   InputAdornment,
//   Stack,
// } from "@mui/material";
// import {
//   Google as GoogleIcon,
//   Visibility,
//   VisibilityOff,
//   LinkedIn as LinkedInIcon,
// } from "@mui/icons-material";
// import { LinkedIn } from "react-linkedin-login-oauth2";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { app } from "../firebase-config.js"; 
// import { useAuth } from "../hooks/useAuth.jsx";
// // import Header from "../components/Header/Header.jsx";
// // import Footer from "../components/Footer.jsx";

// const LoginPage = () => {
//     const { loginByEmailAndPassword } = useAuth();
//     const [formData, setFormData] = useState({
//       email: "",
//       password: ""
//     });
//     const [isSubmitting, setIsSubmitting] = useState(false);
  
//     const handleChange = e => {
//       const { name, value } = e.target;
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     };

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState({
//     email: false,
//     google: false,
//     linkedin: false,
//   });
//   const [error, setError] = useState(null);
//   const auth = getAuth(app);
//   const navigate = useNavigate();

// //   const handleSubmit = async e => {
// //   e.preventDefault();
// //   setError(null);
// //   setIsSubmitting(true);

// //   // Basic validation
// //   if (!formData.email || !formData.password) {
// //     setError("Please fill in all fields");
// //     setIsSubmitting(false);
// //     return;
// //   }

// //   const result = await login(formData.email, formData.password);

// //   if (result.error) {
// //     setError(result.message || "Login failed. Please try again.");
// //   } else {
// //     // Redirect on success
// //     navigate("/post-job"); // or use navigate if using React Router
// //   }

// //   setIsSubmitting(false);
// // };
//   // Email/Password Sign-In
//   const handleEmailSignIn = async e => {
//     e.preventDefault();
//     setLoading({ ...loading, email: true });
//     setError(null);

//       // Basic validation
//   if (!formData.email || !formData.password) {
//     setError("Please fill in all fields");
//     setIsSubmitting(false);
//     return;
//   }

//     const result = await loginByEmailAndPassword(formData.email, formData.password);

//     if (result.error) {
//       setError(result.message || "Login failed. Please try again.");
//     } else {
//       // Redirect on success
//       navigate("/dashboard"); // or use navigate if using React Router
//       console.log("Login successful:", result);
//     }
  
//     setIsSubmitting(false);
//     setLoading({ ...loading, email: false });


//     // try {
//     //   const userCredential = await signInWithEmailAndPassword(
//     //     auth,
//     //     email,
//     //     password
//     //   );
//     //   const idToken = await userCredential.user.getIdToken();

//     //   const response = await fetch("http://localhost:5000/api/auth/signin", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ email, password }),
//     //   });

//     //   if (!response.ok) throw new Error(await response.text());

//     //   const data = await response.json();
//     //   console.log("Sign-in successful:", data);
//     //   navigate('/dashboard'); // Redirect to dashboard or another page
//     // } catch (err) {
//     //   setError(err.message);
//     // } finally {
//     //   setLoading({ ...loading, email: false });
//     // }
//   };

//   // Google Sign-In
//   const handleGoogleSignIn = async () => {
//     setLoading({ ...loading, google: true });
//     setError(null);

//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const idToken = await result.user.getIdToken();
//       console.log("Google id token:", idToken);
  
//       const response = await fetch("http://localhost:5000/api/auth/signin/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idToken }),
//       },console.log("Google sign-in success:", result));

//       if (!response.ok) throw new Error(await response.text());

//       const data = await response.json();
//       console.log("Google sign-in success:", data);
//       navigate('/dashboard'); // Redirect to dashboard or another page
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading({ ...loading, google: false });
//     }
//   };

//   // LinkedIn Sign-In
//   const handleLinkedInSuccess = async (response) => {
//     setLoading({ ...loading, linkedin: true });
//     setError(null);
//     console.log("LinkedIn response:", response);
  
//     try {
//       // 1. Send token to your backend
//       const res = await fetch("http://localhost:5000/api/auth/signin/linkedin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id_token: response.id_token }),
//       });
  
//       if (!res.ok) throw new Error(await res.text());
  
//       const data = await res.json();
//       console.log("LinkedIn sign-in success:", data);
  
//       // 2. Handle popup closure and parent window redirect
//       if (window.opener) {
//         // If this is in a popup
//         window.opener.postMessage(
//           { 
//             type: "LINKEDIN_AUTH_SUCCESS", 
//             payload: data 
//           },
//           window.location.origin
//         );
//         window.close();
//       } else {
//         // If this is in the main window
//         navigate('/dashboard');
//       }
  
//     } catch (err) {
//       setError(err.message);
//       if (window.opener) {
//         window.opener.postMessage(
//           { type: "LINKEDIN_AUTH_ERROR", error: err.message },
//           window.location.origin
//         );
//         window.close();
//       }
//     } finally {
//       setLoading({ ...loading, linkedin: false });
//     }
//   };

//   const handleLinkedInFailure = (error) => {
//     // Set local error state
//     const errorMessage = error.errorMessage || "LinkedIn sign-in failed";
//     setError(errorMessage);
    
//     // If this is a popup, communicate with parent window
//     if (window.opener) {
//       window.opener.postMessage(
//         { 
//           type: "LINKEDIN_AUTH_ERROR", 
//           error: errorMessage 
//         },
//         window.location.origin
//       );
//       window.close();
//     }
//   };

//   useEffect(() => {
//     const handleAuthSuccess = (event) => {
//       if (event.origin !== window.location.origin) return;
//       if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
//         navigate('/dashboard');
//       }
//     };
//     window.addEventListener('message', handleAuthSuccess);
//     return () => window.removeEventListener('message', handleAuthSuccess);
//   }, []);

//   return (<Box>

//           {/* Header */}
//           <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Swipscout
//           </Typography>
          
//         </Toolbar>
//       </AppBar>

//     <Container maxWidth="sm" sx={{ mt: 8 }}>
              
        
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Typography variant="h4" component="h1" align="center" gutterBottom>
//           Sign In
//         </Typography>

//         {/* Email/Password Form */}
//         <Box component="form" onSubmit={handleEmailSignIn} sx={{ mt: 3 }}>
//           <TextField
//             label="Email"
//             type="email"
//             fullWidth
//             margin="normal"
//             variant="outlined"
//             value={formData.email}
//             name="email"
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             fullWidth
//             margin="normal"
//             variant="outlined"
//             value={formData.password}
//             name="password"
//             onChange={handleChange}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             size="large"
//             disabled={loading.email}
//             sx={{ mt: 2, py: 1.5 }}
//           >
//             {loading.email ? <CircularProgress size={24} /> : "Sign In"}
//           </Button>
//         </Box>

//         <Divider sx={{ my: 3 }}>
//           <Typography variant="body2" color="text.secondary">
//             OR CONTINUE WITH
//           </Typography>
//         </Divider>

//         <Stack direction="row" spacing={2} justifyContent="center">
//           {/* Google Button */}
//           <Button
//             variant="outlined"
//             onClick={handleGoogleSignIn}
//             disabled={loading.google}
//             startIcon={<GoogleIcon />}
//             sx={{
//               flex: 1,
//               py: 1.5,
//               borderColor: "#DB4437",
//               color: "#DB4437",
//               "&:hover": { borderColor: "#C1351A" },
//             }}
//           >
//             {loading.google ? <CircularProgress size={24} /> : "Google"}
//           </Button>

//           {/* LinkedIn Button */}
//           <LinkedIn
//             clientId="78aceunh672c3c" // Replace with your actual LinkedIn Client ID
//             onSuccess={handleLinkedInSuccess}
//             onError={handleLinkedInFailure}
//             scope="openid profile email"
//             redirectUri="http://localhost:5173/dashboard"
//           >
//             {({ linkedInLogin }) =>
//               <Button
//                 variant="outlined"
//                 onClick={linkedInLogin}
//                 disabled={loading.linkedin}
//                 startIcon={<LinkedInIcon />}
//                 sx={{
//                   flex: 1,
//                   py: 1.5,
//                   borderColor: "#0077B5",
//                   color: "#0077B5",
//                   "&:hover": { borderColor: "#006097" },
//                 }}
//               >
//                 {loading.linkedin ? <CircularProgress size={24} /> : "LinkedIn"}
//               </Button>}
//           </LinkedIn>
//         </Stack>

//         {error &&
//           <Alert severity="error" sx={{ mt: 3 }}>
//             {error}
//           </Alert>}
//       </Paper>
        
//     </Container>
//         {/* Footer */}
//         <Box sx={{ height: "185px" }} />  {/* Spacer for footer */}
          
//         <Box
//         sx={{
//           backgroundColor: "#333",
//           color: "white",
//           padding: 4,
//           marginTop: 0,
//           textAlign: "center"
//         }}
//       >
        
//         <Divider sx={{ my: 2 }} />  
//         <Typography variant="body2" sx={{ mb: 1, padding: 0 }}>
//           © 2025 Swipscout. All rights reserved.
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;
