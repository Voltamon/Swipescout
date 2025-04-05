import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import * as LinkedInOAuth from 'react-linkedin-login-oauth2'; 
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { app } from '../../src/firebase-config.js';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState({ email: false, google: false, linkedin: false });
  const [error, setError] = useState(null);
  const auth = getAuth(app);

  // Email/Password Sign-In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, email: true });
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log('Sign-in successful:', data);
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
      const idToken = await result.user.getIdToken();

      const response = await fetch('/api/signInWithGoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      console.log('Google sign-in success:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  // LinkedIn Sign-In
  const handleLinkedInSuccess = async (response) => {
    setLoading({ ...loading, linkedin: true });
    setError(null);

    try {
      const res = await fetch('/api/auth/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: response.code }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      console.log('LinkedIn sign-in success:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ ...loading, linkedin: false });
    }
  };

  const handleLinkedInFailure = (error) => {
    setError(error.errorMessage || 'LinkedIn sign-in failed');
  };

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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
            {loading.email ? <CircularProgress size={24} /> : 'Sign In'}
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
              borderColor: '#DB4437',
              color: '#DB4437',
              '&:hover': { borderColor: '#C1351A' }
            }}
          >
            {loading.google ? <CircularProgress size={24} /> : 'Google'}
          </Button>

          {/* LinkedIn Button */}
          <LinkedInOAuth.LinkedInLogin
            clientId="78aceunh672c3c"
            onSuccess={handleLinkedInSuccess}
            onFailure={handleLinkedInFailure}
            redirectUri={`${window.location.origin}/linkedin`}
            renderElement={({ onClick, disabled }) => (
              <Button
                variant="outlined"
                onClick={onClick}
                disabled={disabled || loading.linkedin}
                startIcon={<LinkedInIcon />}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderColor: '#0077B5',
                  color: '#0077B5',
                  '&:hover': { borderColor: '#006097' }
                }}
              >
                {loading.linkedin ? <CircularProgress size={24} /> : 'LinkedIn'}
              </Button>
            )}
          />
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;
