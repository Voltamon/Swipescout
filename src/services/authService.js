// ./services/authService.js

// Get the authentication token from storage (localStorage/sessionStorage)
const getAuthToken = () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  };
  
  // Get the authorization header with the bearer token
  export const getAuthHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  // Get current user data
  export const getCurrentUser = () => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };
  
  // Login function (example)
  export const login = async (credentials) => {
    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Store token and user data 
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  };
  
  // Register function (example)
  export const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Refresh token function (example)
  export const refreshToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/auth/refresh`, {}, {
        headers: getAuthHeader()
      });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };