import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =================================================================
// Personality & Skill Analysis Services
// =================================================================

/**
 * Submits personality assessment data to the backend.
 * @param {any} assessmentData - The user's answers to the assessment.
 * @returns {Promise<any>} The user's personality profile.
 */
export const analyzeUserPersonality = (assessmentData) => {
  return apiClient.post(`/personality/analyze`, { assessmentData });
};

/**
 * Fetches compatible jobs based on a user's personality.
 * @returns {Promise<any>} A list of compatible jobs.
 */
export const findCompatibleJobs = () => {
  return apiClient.get(`/personality/compatible-jobs`);
};

/**
 * Analyzes skill gaps for a user against a specific job.
 * @param {number} jobId - The ID of the job to compare against.
 * @returns {Promise<any>} The skill gap analysis report.
 */
export const analyzeSkillGaps = (jobId) => {
  return apiClient.get(`/personality/skill-gaps/${jobId}`);
};

/**
 * Fetches career path recommendations for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<any>} A list of career path recommendations.
 */
export const generateCareerPathRecommendations = (userId) => {
    return apiClient.get(`/personality/career-recommendations/${userId}`);
};

/**
 * Fetches all jobs.
 * @returns {Promise<any>} A list of all jobs.
 */
export const getAllJobs = () => {
    return apiClient.get('/job');
}
