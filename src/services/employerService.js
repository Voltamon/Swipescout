import api from './api';

const employerService = {
  // Get employer profile data
  getEmployerProfile: async () => {
    try {
      const response = await api.get(`/employer/company-profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      throw error;
    }
  },

  // Get employer's videos
  getEmployerVideos: async () => {
    try {
      const response = await api.get(`/employer/company/videos`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer videos:', error);
      throw error;
    }
  },

  // Get employer's job listings
  getEmployerJobs: async () => {
    try {
      const response = await api.get(`/employer/jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      throw error;
    }
  },

  // Update employer profile
  updateEmployerProfile: async (employerId, profileData) => {
    try {
      const response = await api.put(`/employers/${employerId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating employer profile:', error);
      throw error;
    }
  },

  // Upload employer video
  uploadEmployerVideo: async (employerId, videoData) => {
    try {
      const response = await api.post(`/employers/${employerId}/videos`, videoData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading employer video:', error);
      throw error;
    }
  },

  // Post a new job
  postJob: async (employerId, jobData) => {
    try {
      const response = await api.post(`/employers/${employerId}/jobs`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error posting job:', error);
      throw error;
    }
  },

  // Get job applicants
  getJobApplicants: async (employerId, jobId) => {
    try {
      const response = await api.get(`/employers/${employerId}/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job applicants:', error);
      throw error;
    }
  }
};

export default employerService;