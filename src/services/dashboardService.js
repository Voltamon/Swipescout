import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get employer dashboard statistics
 */
export const getEmployerDashboardStats = () => {
  return api.get('/analytics/employer-stats');
};

/**
 * Get recent activities for user (jobseeker or employer)
 */
export const getRecentActivities = (role = 'jobseeker') => {
  return api.get('/analytics/recent-activities', { params: { role } });
};

/**
 * Get candidate recommendations
 */
export const getCandidateRecommendations = () => {
  return api.get('/recommendations/candidates');
};

/**
 * Get job postings for employer
 */
export const getJobPostings = () => {
  return api.get('/employer/jobs');
};

/**
 * Get jobseeker dashboard statistics
 */
export const getJobSeekerDashboardStats = () => {
  return api.get('/analytics/jobseeker-stats');
};

/**
 * Get job recommendations for jobseeker
 */
export const getJobRecommendations = () => {
  return api.get('/recommendations/jobs');
};

export default {
  getEmployerDashboardStats,
  getRecentActivities,
  getCandidateRecommendations,
  getJobPostings,
  getJobSeekerDashboardStats,
  getJobRecommendations,
};
