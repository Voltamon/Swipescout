import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

let token;
api.interceptors.request.use(
  (config) => {
    token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');
export const refreshToken = () => api.post('/auth/refresh');
export const forgotPassword = (data) => api.post('/auth/forgot-password', { email: data.email }).then(r => r.data);
export const resetPassword = (data) => api.post('/auth/reset-password', { oobCode: data.oobCode, newPassword: data.newPassword }).then(r => r.data);

// User
export const getCurrentUser = () => api.get('/users/me');
export const updateCurrentUser = (userData) => api.put('/users/me', userData);
export const uploadAvator = (formData) => api.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
 
// Videos (general)
export const uploadVideoResume = (formData) => api.post('/videos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const checkUploadStatus = (id) => api.get(`/videos/upload-status/${id}`);
export const getVideoResume = () => api.get('/videos/');
export const getJobVideos = (id) => api.get(`/videos/job/${id}`);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
export const saveVideo = (id) => api.post(`/videos/${id}/save`, {});
export const unsaveVideo = (id) => api.delete(`/videos/${id}/save`);
export const likeVideo = (id) => api.post(`/videos/${id}/likeVideo`, {});
export const addVideoComment = (id, payload) => api.post(`/videos/${id}/comments`, payload);
export const getVideoComments = (id) => api.get(`/videos/${id}/comments`);
export const unlikeVideo = (id) => api.delete(`/videos/${id}/likeVideo`);
export const shareVideo = (id, payload = {}) => api.post(`/videos/${id}/share`, payload);
export const searchVideos = (formData) => api.post(`/videos/searchVideos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const connectWithUser = (id) => api.post(`/users/${id}/connectWithUser`);
export const addComment = (id) => api.post(`/videos/${id}/addComment`);
export const getVideosForHomePage = () => api.get(`/videos/getVideosForHomePage`);
export const getUserNotificationSettings = (id) => api.get(`/notifications/${id}/settings`);
export const getUserSavedVideos = (id) => api.get(`/videos/${id}/getUserSavedVideos`);
export const getUserLikedVideos = (id) => api.get(`/videos/${id}/getUserLikedVideos`);
 
// Job seeker profile
export const uploadProfileImage = (formData) => api.post('/job-seeker/upload-logo/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateUserProfile = (formData) => api.put('/job-seeker/', formData);
export const getUserProfile = () => api.get('/job-seeker/');
export const getJobSeekerProfile = (id) => api.get(`/job-seeker/${id}`);
 
// Skills, experiences, education
export const getUserSkills = () => api.get('/job-seeker/skills');
export const addUserSkill = (skill) => api.post('/job-seeker/skills', skill);
export const updateUserSkill = (id, newSkill) => api.put(`/job-seeker/skills/${id}`, { skill: newSkill });
export const deleteUserSkill = (id) => api.delete(`/job-seeker/skills/${id}`);

export const getUserExperiences = () => api.get('/experiences/');
export const getJobSeekerExperiences = (id) => api.get(`/experiences/user/${id}`);
export const addUserExperience = (experience) => api.post('/experiences/', experience);
export const updateUserExperience = (id, experience) => api.put(`/experiences/${id}`, experience);
export const deleteUserExperience = (id) => api.delete(`/experiences/${id}`);

export const getUserEducation = () => api.get('/education/');
export const getJobSeekerEducation = (id) => api.get(`/education/user/${id}`);
export const addUserEducation = (education) => api.post('/education/', education);
export const updateUserEducation = (id, education) => api.put(`/education/${id}`, education);
export const deleteUserEducation = (id) => api.delete(`/education/${id}`);

// Video listings & paginator
export const getUserVideos = () => api.get('/videos');
export const getAllVideos = (page = 1, limit = 10) => api.get('/videos/all', { params: { page, limit } });
export const getUserVideosByUserId = (id) => api.get(`/videos/user/${id}`);
export const getJobSeekersVideos = (page = 1, limit = 10) => api.get('/videos/jobseekers', { params: { page, limit } });
export const getEmployerPublicVideos = (page = 1, limit = 10) => api.get('/videos/employers', { params: { page, limit } });
export const getUserVideoById = (id) => api.get(`/videos/${id}`);
export const updateUserVideo = (id, videoData) => api.put(`/videos/${id}`, videoData);
export const deleteUserVideo = (id) => api.delete(`/videos/${id}`);

// Employer
export const getEmployerProfile = () => api.get('/employer/employer-profile/');
export const getEmployerPublicProfile = (id) => api.get(`/employer/employer-profile/${id}`);
export const updateEmployerProfile = (companyData) => api.put(`/employer/employer-profile/`, companyData);
export const createEmployerProfile = (companyData) => api.post(`/employer/employer-profile/`, companyData);
export const uploadCompanyLogo = (formData) => api.post(`/employer/upload-logo/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getEmployerJobs = () => api.get('employer/jobs/');
export const getEmployerPublicJobs = (id) => api.get(`employer/jobs/${id}`);
export const getJobDetails = (id) => api.get(`employer/job/${id}`);
export const getEmployerVideos = () => api.get(`/videos/`);

// Jobs CRUD
export const getAllJobs = (params) => api.get('/employer/jobs', { params });
export const getAllJobsPosted = (params) => api.get('/job/', { params });
export const getJobById = (id) => api.get(`/employer/job/${id}`);
export const postJob = (jobData) => api.post('/employer/job', jobData);
export const updateJob = (id, jobData) => api.put(`/employer/job/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/employer/job/${id}`);
export const getJobCategories = (id) => api.get(`/categorie/job/${id}`);
export const getCategories = () => api.get('/categories');
export const getEmployerCategories = () => api.get('/employer/categories');
export const addEmployerCategory = (id) => api.post(`/employer/category/${id}`);
export const deleteEmployerCategory = (id) => api.delete(`/employer/category/${id}`);

// Accept optional search string to filter skills on the server
export const getSkills = (search) => api.get('/skills', { params: search ? { search } : {} });
// Create a new global skill (admin/general endpoint). We will call this when the user types a skill
export const createSkill = (skill) => api.post('/skills', skill);
export const getJobSeekerSkills = (id) => api.get(`/skills/user/${id}`);

// Swipe
export const swipeJob = (jobId, direction) => api.post('/swipe', { jobId, direction });
export const getSwipeHistory = () => api.get('/swipe/history');
export const getMatches = () => api.get('/swipe/matches');

// Chat
export const getConversations = () => api.get('/messages/conversations');
export const getConversationById = (id) => api.get(`/messages/conversations/${id}`);
export const getConversationMessages = (id) => api.get(`/messages/conversations/${id}/messages`);
export const sendMessage = (conversationId, content) => api.post(`/messages/conversations/${conversationId}/messages`, { content });
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

// Interviews
export const scheduleInterview = (interviewData) => api.post('/interviews', interviewData);
export const getInterviews = () => api.get('/interviews');
export const getUserInterviews = () => api.get('/interviews');
export const getInterviewById = (id) => api.get(`/interviews/${id}`);
export const updateInterview = (id, interviewData) => api.put(`/interviews/${id}`, interviewData);
export const cancelInterview = (id) => api.delete(`/interviews/${id}`);
export const updateInterviewStatus = (interviewId, status) => api.patch(`/interviews/${interviewId}/status`, { status });
export const joinInterview = (interviewId) => api.post(`/interviews/${interviewId}/join`);
export const getInterviewDetails = (interviewId) => api.get(`/interviews/${interviewId}`);
export const rescheduleInterview = (interviewId, newDateTime) => api.patch(`/interviews/${interviewId}/reschedule`, { newDateTime });

// Recommendations
export const getJobRecommendations = () => api.get('/recommendations/jobs');
export const getCandidateRecommendations = () => api.get('/recommendations/candidates');
export const submitRecommendationFeedback = (feedbackData) => api.post('/recommendations/feedback', feedbackData);

// Analytics
export const getProfileViewStats = () => api.get('/analytics/profile-views');
export const getSwipeStats = () => api.get('/analytics/swipe-stats');
export const getJobStats = () => api.get('/analytics/job-stats');
export const getCandidateEngagement = () => api.get('/analytics/candidate-engagement');
export const getJobseekerStats = () => api.get('/analytics/jobseeker-stats');
export const getEmployerStats = () => api.get('/analytics/employer-stats');
export const getVideoEngagement = () => api.get('/analytics/video-engagement');

// Video processing / Edit
export const uploadVideo = (formData, onUploadProgress) => api.post('/job-seeker/video-resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (progressEvent) => {
    if (onUploadProgress) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onUploadProgress(percentCompleted);
    }
  }
});

export const editVideo = (formData) => api.post('/video-edit/edit', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const exportVideo = (formData) => api.post('/video-edit/export', formData, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' });
export const getVideoInfo = (videoId) => api.get(`/video-edit/video/${videoId}`);
export const deleteEditedVideo = (videoId) => api.delete(`/video-edit/video/${videoId}`);
export const getUserEditedVideos = () => api.get('/video-edit/user/videos');

export const deleteVideoComment = (videoId, commentId) => api.delete(`/videos/${videoId}/comments/${commentId}`);
export const getSavedVideos = () => api.get('/videos/saved');
export const getLikedVideos = () => api.get('/videos/liked');


// Payments
export const getPlansAndServices = () => api.get('/payment/plans');
export const createSubscription = (subscriptionData) => api.post('/payment/subscription', subscriptionData);
export const getSubscriptionStatus = (userId) => api.get(`/payment/subscription/${userId}`);
export const cancelSubscription = (userId) => api.post('/payment/subscription/cancel', { userId });
export const purchaseService = (serviceData) => api.post('/payment/service', serviceData);
export const getServicePurchases = (userId) => api.get(`/payment/services/${userId}`);

// Resume
export const extractCVData = (formData) => api.post('/resume/extract', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const generateResume = (resumeData) => api.post('/resume/generate', resumeData, { responseType: 'blob' });
export const previewResume = (resumeData) => api.post('/resume/preview', resumeData);
export const saveResume = (resumeData) => api.post('/resume/save', resumeData);
export const getUserResumes = () => api.get('/resume/user');

// Search & Connect
export const searchJobs = (params) => api.get('/jobs/search', { params });
export const searchCandidates = (params) => api.get('/candidates/search', { params });
export const getFilterOptions = () => api.get('/search/filters');
export const connectWithCandidate = (candidateId, message) => api.post(`/employer/connect/${candidateId}`, { message });
export const applyToJob = (jobId, applicationData) => api.post(`/job-seeker/apply/${jobId}`, applicationData);
export const getApplications = () => api.get('/job-seeker/applications');
export const getJobApplications = (jobId) => api.get(`/employer/job/${jobId}/applications`);

// Notifications
export const getNotifications = (page = 1, limit = 20, unreadOnly = false) => api.get('/notifications', { params: { page, limit, unreadOnly } });
export const getUnreadNotificationCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/read`);
export const markAllNotificationsAsRead = () => api.patch('/notifications/mark-all-read');
export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`);
export const getNotificationSettings = () => api.get('/notifications/settings');
export const updateNotificationSettings = (settings) => api.put('/notifications/settings', { settings });
export const createNotification = (notificationData) => api.post('/notifications/create', notificationData);
export const testNotification = (notificationData) => api.post('/notifications/test', notificationData);
export const sendBulkNotifications = (notificationData) => api.post('/notifications/bulk', notificationData);

// AI
export const getAutoInitialInterviewResults = (userId, videoId) => api.get(`/ai/interview-results/${userId}/${videoId}`);
export const getMatchingVideos = (userId, limit = 10, page = 1) => api.get(`/ai/matching-videos/${userId}`, { params: { limit, page } });
export const getUserAIAnalysis = (userId) => api.get(`/ai/user-analysis/${userId}`);
export const getVideoAIAnalysis = (videoId) => api.get(`/ai/video-analysis/${videoId}`);
export const generateAIInterviewQuestions = (userId, jobId) => api.post('/ai/generate-interview-questions', { userId, jobId });
export const getVideoStats = (id) => api.get(`/videos/${id}/stats`);

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getPlatformAnalytics = (params) => api.get('/admin/analytics', { params });
export const getUsers = (params) => api.get('/admin/users', { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const banUser = (id, data) => api.post(`/admin/users/${id}/ban`, data);
export const getReportedContent = (params) => api.get('/admin/reports', { params });
export const handleReport = (id, data) => api.post(`/admin/reports/${id}/action`, data);

// Blog
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlog = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const getBlogCategories = () => api.get('/blogs/categories');
export const getBlogTags = () => api.get('/blogs/tags');

export default api;

