import axios from "axios";

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// User and Auth API services
export const registerUser = userData => {
  return api.post("/auth/register", userData);
};

export const loginUser = credentials => {
  return api.post("/auth/login", credentials);
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const refreshToken = () => {
  return api.post("/auth/refresh");
};

export const forgotPassword = email => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token, password) => {
  return api.post("/auth/reset-password", { token, password });
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateCurrentUser = userData => {
  return api.put("/users/me", userData);
};

export const uploadProfileImage = formData => {
  return api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getUserProfile = userId => {
  return userId ? api.get(`/users/${userId}`) : api.get("/users/me");
};

// JobSeeker API services
export const uploadVideoResume = formData => {
  return api.post("/job-seekers/video-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getVideoResume = () => {
  return api.get("/job-seekers/video-resume");
};

export const deleteVideo = () => {
  return api.delete("/job-seekers/video-resume");
};

export const getUserSkills = () => {
  return api.get("/job-seekers/skills");
};

export const addUserSkill = skill => {
  return api.post("/job-seekers/skills", { skill });
};

export const updateUserSkill = (oldSkill, newSkill) => {
  return api.put(`/job-seekers/skills/${encodeURIComponent(oldSkill)}`, {
    skill: newSkill
  });
};

export const deleteUserSkill = skill => {
  return api.delete(`/job-seekers/skills/${encodeURIComponent(skill)}`);
};

export const getUserExperiences = () => {
  return api.get("/job-seekers/experiences");
};

export const addUserExperience = experience => {
  return api.post("/job-seekers/experiences", experience);
};

export const updateUserExperience = (id, experience) => {
  return api.put(`/job-seekers/experiences/${id}`, experience);
};

export const deleteUserExperience = id => {
  return api.delete(`/job-seekers/experiences/${id}`);
};

export const getUserEducation = () => {
  return api.get("/job-seekers/education");
};

export const addUserEducation = education => {
  return api.post("/job-seekers/education", education);
};

export const updateUserEducation = (id, education) => {
  return api.put(`/job-seekers/education/${id}`, education);
};

export const deleteUserEducation = id => {
  return api.delete(`/job-seekers/education/${id}`);
};

export const getUserVideos = () => {
  return api.get("/job-seekers/videos");
};

export const getUserVideoById = id => {
  return api.get(`/job-seekers/videos/${id}`);
};

export const updateUserVideo = (id, videoData) => {
  return api.put(`/job-seekers/videos/${id}`, videoData);
};

export const deleteUserVideo = id => {
  return api.delete(`/job-seekers/videos/${id}`);
};

// Employer API services
export const getEmployerProfile = id => {
  return id ? api.get(`/employers/${id}`) : api.get("/employers/company");
};

export const updateEmployerProfile = companyData => {
  return api.put("/employers/company", companyData);
};

export const uploadCompanyLogo = formData => {
  return api.post("/employers/company/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getEmployerJobs = employerId => {
  return employerId
    ? api.get(`/employers/${employerId}/jobs`)
    : api.get("/employers/jobs");
};

export const getEmployerVideos = employerId => {
  return employerId
    ? api.get(`/employers/${employerId}/videos`)
    : api.get("/employers/videos");
};

// Job API services
export const getAllJobs = params => {
  return api.get("/jobs", { params });
};

export const getJobById = id => {
  return api.get(`/jobs/${id}`);
};

export const postJob = jobData => {
  return api.post("/employers/jobs", jobData);
};

export const updateJob = (id, jobData) => {
  return api.put(`/employers/jobs/${id}`, jobData);
};

export const deleteJob = id => {
  return api.delete(`/employers/jobs/${id}`);
};

export const getJobCategories = () => {
  return api.get("/jobs/categories");
};

export const getSkills = () => {
  return api.get("/skills");
};

// Swipe API services
export const swipeJob = (jobId, direction) => {
  return api.post("/swipe", { jobId, direction });
};

export const getSwipeHistory = () => {
  return api.get("/swipe/history");
};

export const getMatches = () => {
  return api.get("/swipe/matches");
};

// Chat API services
export const getConversations = () => {
  return api.get("/messages/conversations");
};

export const getConversationById = id => {
  return api.get(`/messages/conversations/${id}`);
};

export const getConversationMessages = id => {
  return api.get(`/messages/conversations/${id}/messages`);
};

export const sendMessage = (conversationId, content) => {
  return api.post(`/messages/conversations/${id}/messages`, { content });
};

export const deleteMessage = id => {
  return api.delete(`/messages/${id}`);
};

// Interview API services
export const scheduleInterview = interviewData => {
  return api.post("/interviews", interviewData);
};

export const getInterviews = () => {
  return api.get("/interviews");
};

export const getInterviewById = id => {
  return api.get(`/interviews/${id}`);
};

export const updateInterview = (id, interviewData) => {
  return api.put(`/interviews/${id}`, interviewData);
};

export const cancelInterview = id => {
  return api.delete(`/interviews/${id}`);
};

export const joinInterview = id => {
  return api.post(`/interviews/${id}/join`);
};

// Recommendation API services
export const getJobRecommendations = () => {
  return api.get("/recommendations/jobs");
};

export const getCandidateRecommendations = () => {
  return api.get("/recommendations/candidates");
};

export const submitRecommendationFeedback = feedbackData => {
  return api.post("/recommendations/feedback", feedbackData);
};

// Notification API services
export const getNotifications = () => {
  return api.get("/notifications");
};

export const markNotificationAsRead = id => {
  return api.put(`/notifications/${id}/read`);
};

export const deleteNotification = id => {
  return api.delete(`/notifications/${id}`);
};

export const getUnreadNotificationCount = () => {
  return api.get("/notifications/unread-count");
};

// Analytics API services
export const getProfileViewStats = () => {
  return api.get("/analytics/profile-views");
};

export const getSwipeStats = () => {
  return api.get("/analytics/swipe-stats");
};

export const getJobStats = () => {
  return api.get("/analytics/job-stats");
};

export const getCandidateEngagement = () => {
  return api.get("/analytics/candidate-engagement");
};

// Video processing services
export const uploadVideo = (formData, onUploadProgress) => {
  return api.post("/job-seekers/video-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: progressEvent => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          progressEvent.loaded * 100 / progressEvent.total
        );
        onUploadProgress(percentCompleted);
      }
    }
  });
};

export default api;
