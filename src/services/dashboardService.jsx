import axios from 'axios';
import { getAuthHeader } from './authService';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

// Job Seeker Functions
export const getJobSeekerDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobseeker-dashboard/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job seeker dashboard stats:', error);
    throw error;
  }
};

export const getJobRecommendations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/job-seeker/recommendations`, {
      headers: getAuthHeader(),
      params: {
        limit: 5
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    throw error;
  }
};

// Employer Functions
export const getEmployerDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employer-dashboard/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employer dashboard stats:', error);
    throw error;
  }
};

export const getRecentActivities = async (userType = 'employer') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/activities/recent`, {
      headers: getAuthHeader(),
      params: {
        limit: 5,
        type: userType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getCandidateRecommendations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates/recommendations`, {
      headers: getAuthHeader(),
      params: {
        limit: 5
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate recommendations:', error);
    throw error;
  }
};

export const getJobPostings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employer/jobs`, {
      headers: getAuthHeader(),
      params: {
        status: 'active',
        limit: 5
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
};

export const getApplicantSources = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employer/applicants/sources`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching applicant sources:', error);
    throw error;
  }
};

export const getJobViewsData = async (period = '6m') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employer/jobs/views`, {
      headers: getAuthHeader(),
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job views data:', error);
    throw error;
  }
};