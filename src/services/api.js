import axios from 'axios';
import i18n from '../i18n';

// Build a safe API base URL. Accept two forms in env:
// - a host-only value like `http://localhost:5000`
// - a host + path value like `http://localhost:5000/api`
// We want the final base to always include a single `/api` path segment.
const _raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const cleaned = String(_raw).replace(/\/+$/g, '');
const API_BASE_URL = cleaned.match(/\/api(?:$|\/)/) ? cleaned : `${cleaned}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Send cookies and support same-site cookie auth when backend requires credentials
  withCredentials: true
});

let token;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    
    // Add language header for multilingual support
    const currentLanguage = i18n.language || 'en';
    config.headers['x-language'] = currentLanguage;
    config.headers['Accept-Language'] = currentLanguage;
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token. If the failing request is for a public API endpoint
        // (public profiles, public videos, etc.) we should NOT force a global
        // redirect to the app root — allow the request to fail so the page can
        // render a public view. Only redirect for protected endpoints.
        const publicApiPrefixes = [
          '/job-seeker/', // job seeker public profile endpoints
          '/videos/user/',
          '/employer/employer-profile/',
          '/profile/'
        ];

        const reqUrl = originalRequest?.url || '';
        const isPublicApi = publicApiPrefixes.some(p => reqUrl.startsWith(p) || reqUrl.indexOf(p) !== -1);

        processQueue(error, null);
        isRefreshing = false;

        if (isPublicApi) {
          // Don't clear storage or redirect for public endpoints — return the error
          console.warn('[api] no refresh token for public API request -> skipping global redirect', { origin: reqUrl, status: (error.response?.status || 'unknown') });
          return Promise.reject(error);
        }

        // Non-public endpoint: clear auth and redirect to the root/login flow
        localStorage.clear();
        console.warn('[api] no refresh token -> redirecting to /', { origin: reqUrl, status: (error.response?.status || 'unknown') });
        try { console.trace && console.trace('[api] redirect trace'); } catch (e) {}
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken, accessExpiresIn, refreshExpiresIn } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('accessExpiresTime', (Date.now() + (accessExpiresIn * 1000)).toString());
        if (refreshExpiresIn) {
          localStorage.setItem('refreshExpiresTime', (Date.now() + (refreshExpiresIn * 1000)).toString());
        }

        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        
        processQueue(null, accessToken);
        isRefreshing = false;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        const publicApiPrefixes = [
          '/job-seeker/',
          '/videos/user/',
          '/employer/employer-profile/',
          '/profile/'
        ];
        const reqUrl = originalRequest?.url || '';
        const isPublicApi = publicApiPrefixes.some(p => reqUrl.startsWith(p) || reqUrl.indexOf(p) !== -1);

        if (isPublicApi) {
          console.warn('[api] token refresh failed for public API request -> skipping global redirect', { origin: reqUrl });
          return Promise.reject(refreshError);
        }

        localStorage.clear();
        console.warn('[api] refresh failed -> redirecting to /', { origin: reqUrl, status: (error.response?.status || 'unknown') });
        try { console.trace && console.trace('[api] refresh failed trace'); } catch (e) {}
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // If 403, user doesn't have permission
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const logoutUser = () => api.post('/auth/logout');
export const refreshToken = () => api.post('/auth/refresh');
export const forgotPassword = (data) => api.post('/auth/forgot-password', { email: data.email }).then(r => r.data);
export const resetPassword = (data) => api.post('/auth/reset-password', { oobCode: data.oobCode, newPassword: data.newPassword }).then(r => r.data);
export const sendVerificationEmail = () => api.post('/auth/send-verification-email').then(r => r.data);
export const verifyEmail = (token) => api.post('/auth/verify-email', { token }).then(r => r.data);

// User
export const getCurrentUser = () => api.get('/users/me');
export const updateCurrentUser = (userData) => api.put('/users/me', userData);
export const uploadAvator = (formData) => api.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
 
// Videos (general)
export const uploadVideoResume = (formData) => api.post('/videos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const checkUploadLimit = async () => {
  const response = await api.get('/videos/upload-limit');
  return response.data;
};
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
// If id is provided returns public user settings endpoint, otherwise returns current user's settings
export const getUserNotificationSettings = (id) => id ? api.get(`/notifications/${id}/settings`) : api.get('/notifications/settings');
export const getUserSavedVideos = (id) => api.get(`/videos/${id}/getUserSavedVideos`);
export const getUserLikedVideos = (id) => api.get(`/videos/${id}/getUserLikedVideos`);
 
// Job seeker profile (mounted under /api/job-seeker on the backend)
export const uploadProfileImage = (formData) => api.post('/job-seeker/upload-logo/', formData, { headers: { 'Content-Type': undefined } });
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
export const getUserVideos = (role) => api.get('/videos', { params: { role } });
// Allow optional filter params to be passed (e.g. { title, uploader, status })
export const getAllVideos = (page = 1, limit = 10, filters = {}) => {
  // Remove empty/null/undefined filter values so backend doesn't receive blank params
  const cleanedFilters = Object.keys(filters || {}).reduce((acc, key) => {
    const v = filters[key];
    if (v !== undefined && v !== null && String(v).trim() !== '') acc[key] = v;
    return acc;
  }, {});

  return api.get('/videos/all', { params: { page, limit, ...cleanedFilters } });
};
export const getUserVideosByUserId = (id) => api.get(`/videos/user/${id}`);
export const getJobSeekersVideos = (page = 1, limit = 10) => api.get('/videos/jobseekers', { params: { page, limit } });
export const getEmployerPublicVideos = (page = 1, limit = 10) => api.get('/videos/employers', { params: { page, limit } });
export const getUserVideoById = (id) => api.get(`/videos/${id}`);
export const updateUserVideo = (id, videoData) => api.put(`/videos/${id}`, videoData);
export const archiveAndReplaceVideo = (id, newVideoData) => api.post(`/videos/${id}/archive-and-replace`, newVideoData);
export const deleteUserVideo = (id) => api.delete(`/videos/${id}`);

// Employer
export const getEmployerProfile = () => api.get('/employer/employer-profile/');
export const getEmployerPublicProfile = (id) => api.get(`/employer/employer-profile/${id}`);
export const updateEmployerProfile = (companyData) => api.put(`/employer/employer-profile/`, companyData);
export const createEmployerProfile = (companyData) => api.post(`/employer/employer-profile/`, companyData);
export const uploadCompanyLogo = (formData) => api.post(`/employer/upload-logo/`, formData);
export const getEmployerJobs = () => api.get('/employer/jobs/');
export const getEmployerPublicJobs = (id) => api.get(`/employer/jobs/${id}`);
export const getJobDetails = (id) => api.get(`/employer/job/${id}`);
export const getEmployerVideos = () => api.get(`/videos/`);
export const checkJobLimit = async () => {
  const response = await api.get('/employer/job-limit');
  return response.data;
};

// Jobs CRUD
export const getAllJobs = (params) => api.get('/employer/jobs', { params });
export const getAllJobsPosted = (params) => api.get('/job/', { params });
export const getJobById = (id) => api.get(`/employer/job/${id}`);
export const postJob = (jobData) => api.post('/employer/job', jobData);
export const updateJob = (id, jobData) => api.put(`/employer/job/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/employer/job/${id}`);
export const getJobCategories = (id) => api.get(`/categorie/job/${id}`);
export const getCategories = () => api.get('/categories');
// Optional endpoint that backend may expose to return distinct skill_type values
export const getSkillTypes = () => api.get('/categories/types');
export const getEmployerCategories = () => api.get('/employer/categories');
export const addEmployerCategory = (id) => api.post(`/employer/category/${id}`);
export const deleteEmployerCategory = (id) => api.delete(`/employer/category/${id}`);

// Accept optional search string to filter skills on the server
export const getSkills = (search) => api.get('/skills', { params: search ? { search } : {} });
// Create a new global skill (admin/general endpoint). We will call this when the user types a skill
export const createSkill = (skill) => api.post('/skills', skill);
export const getJobSeekerSkills = (id) => api.get(`/job-seeker/skills/${id}`);

// Locations (countries & cities)
export const getCountries = () => api.get('/locations/countries');
export const getCities = (countryId) => api.get('/locations/cities', { params: countryId ? { countryId } : {} });

// Swipe
export const swipeJob = (jobId, direction) => api.post('/swipe', { jobId, direction });
export const getSwipeHistory = () => api.get('/swipe/history');
export const getMatches = () => api.get('/swipe/matches');

// Chat (Note: chat-related API calls are also in chatService.js)
export const getConversations = () => api.get('/chat/conversations');
export const getConversationById = (id) => api.get(`/chat/conversation/${id}`);
export const getConversationMessages = (id) => api.get(`/chat/conversation/${id}`);
export const sendMessage = (conversationId, content) => api.post(`/chat/send`, { conversationId, content });
export const deleteMessage = (id) => api.delete(`/chat/message/${id}`);

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
export const getProfileViewStats = (params = {}) => api.get('/analytics/profile-views', { params });
export const getSwipeStats = () => api.get('/analytics/swipe-stats');
export const getJobStats = () => api.get('/analytics/job-stats');
export const getCandidateEngagement = () => api.get('/analytics/candidate-engagement');
export const getJobseekerStats = (params = {}) => api.get('/analytics/jobseeker-stats', { params });
export const getEmployerStats = (params = {}) => api.get('/analytics/employer-stats', { params });
export const getVideoEngagement = () => api.get('/analytics/video-engagement');

// Profile
export const getPublicProfile = (userId, profileType = null) => api.get(`/profile/${userId}`, { params: profileType ? { profileType } : {} });
export const getMyProfileViewStats = (params = {}) => api.get('/profile/stats/views', { params });
// Lightweight endpoint to record a profile view without fetching profile
export const recordProfileView = (userId, profileType = null) => api.post(`/profile/${userId}/view`, { profileType });

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

// Added for consistency - using correct user-specific saved/liked videos endpoints
export const getUserSavedVideosForUser = () => api.get('/videos/saved');
export const getUserLikedVideosForUser = () => api.get('/videos/liked');


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
export const updateResume = (id, resumeData) => api.put(`/resume/${id}`, resumeData);
export const deleteResume = (id) => api.delete(`/resume/${id}`);
export const getUserResumes = () => api.get('/resume/user');

// Search & Connect
export const searchJobs = (params) => {
  // Call the search controller mounted under /api/search (route: /search/jobs/search)
  // Do not remap `q` — the backend expects `q`.
  return api.get('/search/jobs/search', { params });
};
export const searchCandidates = (params) => api.get('/search/candidates/search', { params });
export const getFilterOptions = () => api.get('/search/filters');
export const connectWithCandidate = (candidateId, message) => api.post(`/employer/connect/${candidateId}`, { message });
export const applyToJob = (jobId, applicationData) => api.post(`/job/${jobId}/apply`, applicationData);
export const getApplications = () => api.get('/job/applications');
export const getJobApplications = (jobId) => api.get(`/employer/job/${jobId}/applications`);
// Get applicants for a specific job (public/employer endpoint)
export const getJobApplicants = (jobId) => api.get(`/job/applications/${jobId}`);
// Update the status of a job application. Note: backend endpoint may vary.
export const updateJobApplicationStatus = (applicationId, status) => api.patch(`/job/applications/${applicationId}`, { status });
export const incrementJobView = (jobId) => api.post(`/job/${jobId}/view`);

// Notifications
export const getNotifications = (page = 1, limit = 20, unreadOnly = false, role = null) => {
  const params = { page, limit, unreadOnly };
  if (role) params.role = role;
  return api.get('/notifications', { params });
};
export const getUnreadNotificationCount = (role = null) => {
  const params = role ? { role } : {};
  return api.get('/notifications/unread-count', { params });
};
export const markNotificationAsRead = (notificationId) => api.patch(`/notifications/${notificationId}/read`);
export const markNotificationAsUnread = (notificationId) => api.patch(`/notifications/${notificationId}/unread`);
export const markAllNotificationsAsRead = () => api.patch('/notifications/mark-all-read');
export const markAllNotificationsAsUnread = () => api.patch('/notifications/mark-all-unread');
export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`);
export const getNotificationSettings = () => api.get('/notifications/settings');
export const updateNotificationSettings = (settings) => api.put('/notifications/settings', { settings });
export const createNotification = (notificationData) => api.post('/notifications/create', notificationData);
export const testNotification = (notificationData) => api.post('/notifications/test', notificationData);
export const sendBulkNotifications = (notificationData) => api.post('/notifications/bulk', notificationData);
export const registerNotificationDevice = (payload) => api.post('/notifications/register', payload);
export const deregisterNotificationDevice = () => api.delete('/notifications/register');

// AI
export const getAutoInitialInterviewResults = (userId, videoId) => api.get(`/ai/interview-results/${userId}/${videoId}`);
export const getMatchingVideos = (userId, limit = 10, page = 1) => api.get(`/ai/matching-videos/${userId}`, { params: { limit, page } });
export const getUserAIAnalysis = (userId) => api.get(`/ai/user-analysis/${userId}`);
export const getVideoAIAnalysis = (videoId) => api.get(`/ai/video-analysis/${videoId}`);
export const generateAIInterviewQuestions = (userId, jobId) => api.post('/ai/generate-interview-questions', { userId, jobId });
export const getVideoStats = (id) => api.get(`/videos/${id}/stats`);

// Career advice content (frontend reads all grouped content)
export const getCareerAdvice = () => api.get('/career-advice');

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getPlatformAnalytics = (params) => api.get('/admin/analytics', { params });
export const getAdminSettings = () => api.get('/admin/settings');
export const updateAdminSettings = (settings) => api.put('/admin/settings', settings);
export const getUsers = (params) => api.get('/admin/users', { params });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const banUser = (id, data) => api.post(`/admin/users/${id}/ban`, data);
export const updateUserRole = (id, data) => api.patch(`/admin/users/${id}/role`, data);
export const getReportedContent = (params) => api.get('/admin/reports', { params });
export const handleReport = (id, data) => api.post(`/admin/reports/${id}/action`, data);
// Public reporting endpoints (for normal users)
export const reportContent = (payload) => api.post('/reports', payload);
export const getMyReports = (params) => api.get('/reports/mine', { params });

// Blog
export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlog = (id) => api.get(`/blogs/${id}`);
export const getFeaturedBlogs = (limit) => api.get('/blogs/featured', { params: { limit } });
export const getRelatedBlogs = (id, limit) => api.get(`/blogs/${id}/related`, { params: { limit } });
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
export const bulkImportBlogs = (blogs) => api.post('/blogs/bulk-import', { blogs });

// Saves (bookmarks) - generic endpoints for multiple target types (blog, employer, jobseeker, etc.)
export const saveItem = (targetId, type) => api.post('/saves', { targetId, type });
export const unsaveItem = (targetId, type) => api.delete('/saves', { params: { targetId, type } });
export const checkSaved = (targetId, type) => api.get('/saves/check', { params: { targetId, type } });
// convenience helpers for blog saves
export const saveBlog = (blogId) => saveItem(blogId, 'blog');
export const unsaveBlog = (blogId) => unsaveItem(blogId, 'blog');
export const checkBlogSaved = (blogId) => checkSaved(blogId, 'blog');
export const getSavedItems = (type) => api.get('/saves', { params: type ? { type } : {} });
export const getSavedBlogs = () => getSavedItems('blog');

// Admin: connections and audit
export const getAdminConnections = (params = {}) => api.get('/admin/connections', { params });
export const purgeRemovedConnections = (data = {}) => api.delete('/admin/connections/purge', { params: data });

// Blog Categories
export const getBlogCategories = () => api.get('/blogs/categories');
export const createBlogCategory = (data) => api.post('/blogs/categories', data);
export const updateBlogCategory = (id, data) => api.put(`/blogs/categories/${id}`, data);
export const deleteBlogCategory = (id) => api.delete(`/blogs/categories/${id}`);

// Blog Tags
export const getBlogTags = (limit) => api.get('/blogs/tags', { params: { limit } });
export const createBlogTag = (data) => api.post('/blogs/tags', data);
export const updateBlogTag = (id, data) => api.put(`/blogs/tags/${id}`, data);
export const deleteBlogTag = (id) => api.delete(`/blogs/tags/${id}`);

// Career advice quick tips & career paths
export const getQuickTips = (limit = 20) => api.get('/career-advice/quick-tips', { params: { limit } });
export const getCareerPaths = (limit = 20) => api.get('/career-advice/career-paths', { params: { limit } });

// Admin CRUD (requires auth)
export const createQuickTip = (payload) => api.post('/career-advice/quick-tips', payload);
export const updateQuickTip = (id, payload) => api.put(`/career-advice/quick-tips/${id}`, payload);
export const deleteQuickTip = (id) => api.delete(`/career-advice/quick-tips/${id}`);

export const createCareerPath = (payload) => api.post('/career-advice/career-paths', payload);
export const updateCareerPath = (id, payload) => api.put(`/career-advice/career-paths/${id}`, payload);
export const deleteCareerPath = (id) => api.delete(`/career-advice/career-paths/${id}`);

// Career advice (quick tips & career paths)
// (duplicates removed) getQuickTips/getCareerPaths are defined above with default params

export const createSupportTicket = async (ticketData) => {
  const response = await api.post('/support', ticketData);
  return response.data;
};

export const getUserTickets = async () => {
  const response = await api.get('/support');
  return response.data;
};

export default api;

