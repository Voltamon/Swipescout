import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Adjust this to your backend URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add authorization headers if needed
    // 'Authorization': `Bearer ${your_token}`
  }
});

// =================================================================
// Personality & Skill Analysis Services
// =================================================================

/**
 * Submits personality assessment data to the backend.
 * @param {number} userId - The ID of the user.
 * @param {any} assessmentData - The user's answers to the assessment.
 * @returns {Promise<any>} The user's personality profile.
 */
export const analyzeUserPersonality = (userId, assessmentData) => {
  return apiClient.post(`/enhanced-personality-matching/analyze-personality`, { userId, assessmentData });
};

/**
 * Fetches compatible jobs based on a user's personality.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<any>} A list of compatible jobs.
 */
export const findCompatibleJobs = (userId) => {
  return apiClient.get(`/enhanced-personality-matching/compatible-jobs/${userId}`);
};

/**
 * Analyzes skill gaps for a user against a specific job.
 * @param {number} userId - The ID of the user.
 * @param {number} jobId - The ID of the job to compare against.
 * @returns {Promise<any>} The skill gap analysis report.
 */
export const analyzeSkillGaps = (userId, jobId) => {
  return apiClient.get(`/enhanced-personality-matching/skill-gaps/${userId}/${jobId}`);
};

/**
 * Fetches career path recommendations for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<any>} A list of career path recommendations.
 */
export const generateCareerPathRecommendations = (userId) => {
    return apiClient.get(`/enhanced-personality-matching/career-recommendations/${userId}`);
};

/**
 * Fetches all jobs.
 * @returns {Promise<any>} A list of all jobs.
 */
export const getAllJobs = () => {
    // This is a placeholder. You should have a real endpoint for this.
    // return apiClient.get('/jobs');
    
    // Returning mock data for now
    return Promise.resolve({
        data: [
            { id: 1, title: 'Frontend Developer' },
            { id: 2, title: 'Backend Developer' },
            { id: 3, title: 'Data Scientist' },
            { id: 4, title: 'UX/UI Designer' },
        ]
    });
}
