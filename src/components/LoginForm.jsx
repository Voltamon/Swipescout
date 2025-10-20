import { useState } from "react";
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Stack,Typography
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { AlertCircle as AlertCircleIcon } from "lucide-react";

const LoginForm = ({ onLogin, onGoogleLogin, onLinkedInLogin, loading, error, compact = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

 return (
    <Box component="form" onSubmit={handleEmailSignIn} sx={{ width: '100%' }}>
      <TextField
        size={compact ? "small" : "medium"}
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        sx={compact ? { mb: 1.5 } : {}}
      />
      
      <TextField
        size={compact ? "small" : "medium"}
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        sx={compact ? { mb: 1 } : {}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size={compact ? "small" : "medium"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {compact ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Link to="/forgot-password" style={{
              fontSize: '0.75rem',
              color: 'rgb(23, 92, 182)',
              textDecoration: 'none'
            }}>
              Forgot password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: compact ? 0.8 : 1.5,
              mb: 1.5,
              borderRadius: '6px',
              backgroundColor: 'rgb(23, 92, 182)'
            }}
            disabled={loading?.email}
          >
            {loading?.email ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
          
          <Divider sx={{ my: 1.5, fontSize: '0.75rem' }}>or</Divider>
          
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={onGoogleLogin}
              disabled={loading?.google}
              fullWidth
              size={compact ? "small" : "medium"}
              startIcon={<GoogleIcon fontSize={compact ? "small" : "medium"} />}
              sx={{
                py: compact ? 0.8 : 1.5,
                borderRadius: '6px',
                fontSize: compact ? '0.75rem' : '0.875rem'
              }}
            >
              {loading?.google ? <CircularProgress size={24} /> : "Google"}
            </Button>
            <Button
              variant="outlined"
              onClick={onLinkedInLogin}
              disabled={loading?.linkedin}
              fullWidth
              size={compact ? "small" : "medium"}
              startIcon={<LinkedInIcon fontSize={compact ? "small" : "medium"} />}
              sx={{
                py: compact ? 0.8 : 1.5,
                borderRadius: '6px',
                fontSize: compact ? '0.75rem' : '0.875rem'
              }}
            >
              {loading?.linkedin ? <CircularProgress size={24} /> : "LinkedIn"}
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{
            mt: 2,
            textAlign: 'center',
            fontSize: compact ? '0.75rem' : '0.875rem',
            color: 'rgba(0, 0, 0, 0.6)'
          }}>
            New user?{' '}
            <Link to="/register-form" style={{
              color: 'rgb(23, 92, 182)',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Create account
            </Link>
          </Typography>
        </>
      ) : (
   
     
<Box component="form" onSubmit={handleEmailSignIn} sx={{ width: '100%' }}>
  <TextField
    label="Email Address"
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    variant="outlined"
    fullWidth
    margin="normal"
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
          borderRadius: '8px'
        },
        '&:hover fieldset': {
          borderColor: 'rgb(23, 92, 182)'
        }
      }
    }}
  />
  
  <TextField
    label="Password"
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    variant="outlined"
    fullWidth
    margin="normal"
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
          borderRadius: '8px'
        },
        '&:hover fieldset': {
          borderColor: 'rgb(23, 92, 182)'
        }
      }
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
  
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
    <Link to="/forgot-password" style={{
      color: 'rgb(23, 92, 182)',
      fontSize: '0.875rem',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}>
      Forgot Password?
    </Link>
  </Box>
  
  <Button
    type="submit"
    variant="contained"
    fullWidth
    disabled={loading?.email}
    sx={{
      mt: 1,
      mb: 2,
      py: 1.5,
      borderRadius: '8px',
      backgroundColor: 'rgb(23, 92, 182)',
      '&:hover': {
        backgroundColor: 'rgb(16, 72, 144)'
      }
    }}
  >
    {loading?.email ? <CircularProgress size={24} color="inherit" /> : "Log In"}
  </Button>

  <Divider sx={{ my: 2, color: 'rgba(0, 0, 0, 0.38)' }}>
    <Typography variant="body2" sx={{ px: 1, color: 'rgba(0, 0, 0, 0.6)' }}>
      or continue with
    </Typography>
  </Divider>

  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
    <Button
      variant="outlined"
      onClick={onGoogleLogin}
      disabled={loading?.google}
      startIcon={<GoogleIcon />}
      fullWidth
      sx={{
        py: 1.5,
        borderRadius: '8px',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        color: 'rgba(0, 0, 0, 0.87)',
        '&:hover': {
          borderColor: 'rgb(23, 92, 182)',
          backgroundColor: 'rgba(23, 92, 182, 0.04)'
        }
      }}
    >
      {loading?.google ? <CircularProgress size={24} color="inherit" /> : "Google"}
    </Button>
    <Button
      variant="outlined"
      onClick={onLinkedInLogin}
      disabled={loading?.linkedin}
      startIcon={<LinkedInIcon />}
      fullWidth
      sx={{
        py: 1.5,
        borderRadius: '8px',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        color: 'rgba(0, 0, 0, 0.87)',
        '&:hover': {
          borderColor: 'rgb(23, 92, 182)',
          backgroundColor: 'rgba(23, 92, 182, 0.04)'
        }
      }}
    >
      {loading?.linkedin ? <CircularProgress size={24} /> : "LinkedIn"}
    </Button>
  </Stack>
</Box> )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertCircleIcon className="mr-2 h-4 w-4" />
          {error}
        </Alert>
      )}
    </Box>
  );

  
};

export default LoginForm;