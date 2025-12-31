import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  styled,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LinkedIn as LinkedInIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import RoleCard from "../components/RoleCard";

// Styled components
const SignupContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  padding: theme.spacing(4, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
  },
}));

const SignupFormContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 500,
  margin: '0 auto',
  padding: theme.spacing(4),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05)',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1,
  animation: 'slideUp 0.6s ease-out',
  '@keyframes slideUp': {
    '0%': { 
      opacity: 0, 
      transform: 'translateY(30px) scale(0.95)' 
    },
    '100%': { 
      opacity: 1, 
      transform: 'translateY(0) scale(1)' 
    },
  },
}));

const SignupTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

const SignupSubtitle = styled(Typography)(({ theme }) => ({
  color: '#6b7280',
  textAlign: 'center',
  fontSize: '1.1rem',
  marginBottom: theme.spacing(4),
}));

const InputField = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1.5, 0),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  },
  '& input': {
    padding: theme.spacing(1.5),
    fontSize: '1rem',
  },
}));

const SignupButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.75),
  marginTop: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1.5),
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

const GoogleButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#db4437',
  border: '2px solid #db4437',
  '&:hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    boxShadow: '0 4px 12px rgba(219, 68, 55, 0.2)',
  },
}));

const LinkedInButton = styled(SocialButton)(({ theme }) => ({
  backgroundColor: '#0077b5',
  color: 'white',
  border: '2px solid #0077b5',
  '&:hover': {
    backgroundColor: '#005885',
    borderColor: '#005885',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)',
  },
}));

const LoginLink = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
  color: '#6b7280',
  fontSize: '0.875rem',
  '& a': {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#5a67d8',
    },
  },
}));

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roles = [
    {
      icon: <PersonIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: "Job Seeker",
      description: "Find your dream job and showcase your skills through video profiles."
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: "Employer",
      description: "Discover top talent and create engaging video job postings."
    }
  ];

  return (
    <SignupContainer>
      <Container maxWidth="md">
        <SignupFormContainer>
          <SignupTitle variant="h3">Join SwipeScout Today!</SignupTitle>
          <SignupSubtitle>
            Connect with opportunities through the power of video
          </SignupSubtitle>
          
          <Box sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {roles.map((role, index) => (
                <RoleCard 
                  key={index} 
                  {...role} 
                  sx={{
                    flex: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box component="form">
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
            />
            
            <InputField
              label="Password"
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
            
            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <SignupButton type="submit">
              Create Account
            </SignupButton>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ 
                color: '#6b7280', 
                px: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 500,
              }}>
                Or sign up with
              </Typography>
            </Divider>
            
            <Stack direction="row" spacing={2}>
              <GoogleButton
                startIcon={<GoogleIcon />}
                fullWidth
              >
                Google
              </GoogleButton>
              <LinkedInButton
                startIcon={<LinkedInIcon />}
                fullWidth
              >
                LinkedIn
              </LinkedInButton>
            </Stack>
            
            <LoginLink>
              Already have an account? <Link to="/login">Sign In</Link>
            </LoginLink>
          </Box>
        </SignupFormContainer>
      </Container>
    </SignupContainer>
  );
};

export default SignupPage;
