import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('timport axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api' || 'http://localhost:5000/api';

// Create an Axios instance with base settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor to handle authentication errors (if uncommented)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // If error is 401 (unauthorized) and not a token refresh attempt
//     if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
//       originalRequest._retry = true;

//       try {
//         // Attempt to refresh token
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }

//         const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refresh_token: refreshToken
//         });

//         const { token } = response.data;
//         localStorage.setItem('token', token);

//         // Retry original request with new token
//         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If token refresh fails, logout
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         // window.location.href = '/login'; // Redirect to login page
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// ------------------------------------------
// User and Auth API services
// ------------------------------------------
// UPDATED: No direct changes to these paths, they seem correct based on index.ts
export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const logoutUser = () => {
  return api.post('/auth/logout');
};

export const refreshToken = () => {
  return api.post('/auth/refresh');
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

// NEW: Password reset route
export const resetPassword = (token, password) => {
  return api.post('/auth/reset-password', { token, password });
};


// ------------------------------------------
// Chat API services
// ------------------------------------------
// UPDATED: Path updated to match index.ts (from /conversations to /chat/conversations)
export const getConversations = () => {
  return api.get('/chat/conversations');
};

// UPDATED: Path updated to match index.ts (from /messages to /chat/messages)
export const getMessages = (conversationId) => {
  return api.get(`/chat/conversations/${conversationId}/messages`);
};

// UPDATED: Path updated to match index.ts (from /messages to /chat/messages)
export const sendMessage = (conversationId, content) => {
  return api.post(`/chat/conversations/${conversationId}/messages`, { content });
};

// NEW: Start Conversation
export const startConversation = (otherUserId, initialMessageContent) => {
  return api.post('/chat/conversations', { otherUserId, initialMessageContent });
};

// NEW: Mark message as read (from chatService, assuming backend route /chat/messages/:id/read)
export const markAsRead = (messageId) => {
  return api.put(`/chat/messages/${messageId}/read`);
};

// NEW: Get All Users (from chatService, assuming backend route /users)
// This might conflict if there's a dedicated user management route for admin.
// For chat context, this route seems to align with /api/users
export const getAllUsers = () => {
  return api.get('/users');
};

// ------------------------------------------
// Job Seeker API services (from job-seeker.routes.ts)
// ------------------------------------------
// UPDATED: Path for skills routes are now under /job-seekers/skills

// NEW: Get Job Seeker Videos (from VideosPage.jsx usage)
// Based on usage in VideosPage.jsx: GET /api/job-seekers/videos
// Assuming this route is managed by job-seeker.routes.ts or a dedicated video controller for job seekers
export const getJobSeekerVideos = (page, limit) => {
  return api.get(`/job-seekers/videos?page=${page}&limit=${limit}`);
};

// NEW: Check Upload Limit (from VideosPage.jsx usage)
// Based on usage in VideosPage.jsx: GET /api/job-seekers/upload-limit
export const checkUploadLimit = () => {
  return api.get('/job-seekers/upload-limit');
};

// NEW: Check Upload Status (from job-seeker.routes.ts)
export const checkUploadStatus = (uploadId) => {
  return api.get(`/job-seekers/upload-status/${uploadId}`);
};

// NEW: Upload Video Resume (Assuming POST /job-seekers/video-resume with file upload)
// This route was commented out in job-seeker.routes.ts. If it's needed, it should be uncommented there first.
// For now, providing a placeholder, but note it might require FormData for file uploads.
export const uploadVideoResume = (file) => {
  const formData = new FormData();
  formData.append('video', file); // 'video' should match your backend's expected field name for the file
  return api.post('/job-seekers/video-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// NEW: Get Video Resume (if needed, assuming GET /job-seekers/video-resume)
export const getVideoResume = () => {
  return api.get('/job-seekers/video-resume');
};

// NEW: Delete Video Resume (if needed, assuming DELETE /job-seekers/video-resume)
export const deleteVideoResume = () => {
  return api.delete('/job-seekers/video-resume');
};

// ------------------------------------------
// Employer API services (from employer.routes.ts)
// ------------------------------------------
// NEW: Create Company Profile
export const createCompanyProfile = (profileData) => {
  return api.post('/employer/company-profile', profileData);
};

// NEW: Update Company Profile
export const updateCompanyProfile = (id, profileData) => {
  return api.put(`/employer/company-profile/${id}`, profileData);
};

// NEW: Get Company Profile
export const getCompanyProfile = () => {
  return api.get('/employer/company-profile');
};

// NEW: Upload Company Video (assuming form-data for file upload)
export const uploadCompanyVideo = (file) => {
  const formData = new FormData();
  formData.append('video', file); // 'video' should match your backend's expected field name
  return api.post('/employer/a-company-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// NEW: Get Company Videos
export const getCompanyVideos = () => {
  return api.get('/employer/company/videos');
};

// NEW: Get Company Video By ID
export const getCompanyVideoById = (videoId) => {
  return api.get(`/employer/company/videos/${videoId}`);
};

// NEW: Get Job Video (specific to a job ID)
export const getJobVideo = (jobId) => {
  return api.get(`/employer/jobs/${jobId}/video`);
};

// NEW: Post Job
export const postJob = (jobData) => {
  return api.post('/employer/job', jobData);
};

// NEW: Update Job
export const updateJob = (id, jobData) => {
  return api.put(`/employer/job/${id}`, jobData);
};

// NEW: Delete Job
export const deleteJob = (id) => {
  return api.delete(`/employer/job/${id}`);
};

// NEW: Get Jobs (Employer's own jobs)
export const getJobs = () => {
  return api.get('/employer/jobs');
};

// NEW: Get Job by ID (Employer's job)
export const getJob = (id) => {
  return api.get(`/employer/job/${id}`);
};

// NEW: Upload Logo (assuming form-data for file upload)
export const uploadLogo = (id, file) => {
  const formData = new FormData();
  formData.append('logo', file); // 'logo' should match your backend's expected field name
  return api.post(`/employer/upload-logo/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// NEW: Upload Video (generic employer video upload, separate from company video)
export const uploadEmployerVideo = (id, file) => {
  const formData = new FormData();
  formData.append('video', file); // 'video' should match your backend's expected field name
  return api.post(`/employer/upload-video/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


// ------------------------------------------
// Experience API services (from experience.routes.ts)
// ------------------------------------------
// NEW: Create Experience
export const createExperience = (experienceData) => {
  return api.post('/experiences', experienceData);
};

// NEW: Get User Experiences
export const getUserExperiences = () => {
  return api.get('/experiences');
};

// NEW: Get Experience By ID
export const getExperienceById = (id) => {
  return api.get(`/experiences/${id}`);
};

// NEW: Update Experience
export const updateExperience = (id, experienceData) => {
  return api.put(`/experiences/${id}`, experienceData);
};

// NEW: Delete Experience
export const deleteExperience = (id) => {
  return api.delete(`/experiences/${id}`);
};


// ------------------------------------------
// Category API services (from category.routes.ts)
// ------------------------------------------
// NEW: Get All Categories
export const getAllCategories = () => {
  return api.get('/categories');
};

// NEW: Get Category By ID
export const getCategory = (id) => {
  return api.get(`/categories/${id}`);
};

// NEW: Create Category
export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

// NEW: Restore Category
export const restoreCategory = (id) => {
  return api.post(`/categories/${id}/restore`);
};

// NEW: Update Category
export const updateCategory = (id, categoryData) => {
  return api.put(`/categories/${id}`, categoryData);
};

// NEW: Delete Category
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

// NEW: Add Category to Job
export const addCategoryToJob = (jobId, categoryId) => {
  return api.post('/categories/jobs', { job_id: jobId, category_id: categoryId });
};

// NEW: Remove Category from Job
export const removeCategoryFromJob = (jobId, categoryId) => {
  return api.delete(`/categories/jobs/${jobId}/${categoryId}`);
};


// ------------------------------------------
// General Skills API services (from skills.routes.ts)
// These are for managing the *master list* of skills, not user-specific skills.
// ------------------------------------------
// NEW: Get All Skills (General)
export const getGeneralSkills = () => {
  return api.get('/skills');
};

// NEW: Get Skills By Category
export const getSkillsByCategory = (categoryId) => {
  return api.get(`/skills/category/${categoryId}`);
};

// NEW: Create Skill (General)
export const createSkill = (skillData) => {
  return api.post('/skills', skillData);
};

// NEW: Restore Skill (General)
export const restoreSkill = (id) => {
  return api.post(`/skills/${id}/restore`);
};

// NEW: Update Skill (General)
export const updateSkill = (id, skillData) => {
  return api.put(`/skills/${id}`, skillData);
};

// NEW: Delete Skill (General)
export const deleteSkill = (id) => {
  return api.delete(`/skills/${id}`);
};


// ------------------------------------------
// Other API services (Placeholder for routes from index.ts not yet detailed)
// ------------------------------------------
// NEW: Profile Routes
export const getUserProfile = () => api.get('/profile');
export const updateProfile = (profileData) => api.put('/profile', profileData);

// NEW: Swipes Routes
export const createSwipe = (swipeData) => api.post('/swipes', swipeData);
export const getSwipes = () => api.get('/swipes');

// NEW: Matching Routes
export const getMatches = () => api.get('/matching');

// NEW: Video Routes (General, distinct from job-seeker/employer specific videos)
// This might overlap with getJobSeekerVideos or getCompanyVideos depending on context.
// Assuming this is for generic public video access if implemented.
export const getVideos = () => api.get('/videos');
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`);

// NEW: Admin Routes (Placeholder - specific routes would be added as needed)
export const getAdminDashboard = () => api.get('/admin/dashboard');

// NEW: Analytics Routes (Placeholder)
export const getAnalytics = () => api.get('/analytics');

// NEW: Interviews Routes (Placeholder)
export const getInterviews = () => api.get('/interviews');

// NEW: User Routes (General user management, possibly for admin)
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// NEW: Recommendations Routes (Placeholder)
export const getRecommendations = () => api.get('/recommendations');

// NEW: Notifications Routes (Placeholder)
export const getNotifications = () => api.get('/notifications');

// Export all services
export default api;oken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User and Auth API services
export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};


export const getCurrentUser = () => {
  return api.get('/users/me');
};

export const updateCurrentUser = (userData) => {
  return api.put('/users/me', userData);
};

export const uploadProfileImage = (formData) => {
  return api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserProfile = (userId) => {
  return userId ? api.get(`/users/${userId}`) : api.get('/users/me');
};

// JobSeeker API services
export const uploadVideoResume = (formData) => {
  return api.post('/job-seekers/video-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVideoResume = () => {
  return api.get('/job-seekers/video-resume');
};

export const deleteVideoResume = () => {
  return api.delete('/job-seekers/video-resume');
};

export const getUserSkills = () => {
  return api.get('/job-seekers/skills');
};

export const addUserSkill = (skill) => {
  return api.post('/job-seekers/skills', { skill });
};

export const updateUserSkill = (oldSkill, newSkill) => {
  return api.put(`/job-seekers/skills/${encodeURIComponent(oldSkill)}`, { skill: newSkill });
};

export const deleteUserSkill = (skill) => {
  return api.delete(`/job-seekers/skills/${encodeURIComponent(skill)}`);
};

export const getUserExperiences = () => {
  return api.get('/job-seekers/experiences');
};

export const addUserExperience = (experience) => {
  return api.post('/job-seekers/experiences', experience);
};

export const updateUserExperience = (id, experience) => {
  return api.put(`/job-seekers/experiences/${id}`, experience);
};

export const deleteUserExperience = (id) => {
  return api.delete(`/job-seekers/experiences/${id}`);
};

export const getUserEducation = () => {
  return api.get('/job-seekers/education');
};

export const addUserEducation = (education) => {
  return api.post('/job-seekers/education', education);
};

export const updateUserEducation = (id, education) => {
  return api.put(`/job-seekers/education/${id}`, education);
};

export const deleteUserEducation = (id) => {
  return api.delete(`/job-seekers/education/${id}`);
};

export const getUserVideos = () => {
  return api.get('/job-seekers/videos');
};

export const getUserVideoById = (id) => {
  return api.get(`/job-seekers/videos/${id}`);
};

export const updateUserVideo = (id, videoData) => {
  return api.put(`/job-seekers/videos/${id}`, videoData);
};

export const deleteUserVideo = (id) => {
  return api.delete(`/job-seekers/videos/${id}`);
};

// Employer API services
export const getEmployerProfile = (id) => {
  return id ? api.get(`/employers/${id}`) : api.get('/employers/company');
};

export const updateEmployerProfile = (companyData) => {
  return api.put('/employers/company', companyData);
};

export const uploadCompanyLogo = (formData) => {
  return api.post('/employers/company/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getEmployerJobs = (employerId) => {
  return employerId ? api.get(`/employers/${employerId}/jobs`) : api.get('/employers/jobs');
};

export const getEmployerVideos = (employerId) => {
  return employerId ? api.get(`/employers/${employerId}/videos`) : api.get('/employers/videos');
};

// Job API services
export const getAllJobs = (params) => {
  return api.get('/jobs', { params });
};

export const getJobById = (id) => {
  return api.get(`/jobs/${id}`);
};

export const postJob = (jobData) => {
  return api.post('/employers/jobs', jobData);
};

export const updateJob = (id, jobData) => {
  return api.put(`/employers/jobs/${id}`, jobData);
};

export const deleteJob = (id) => {
  return api.delete(`/employers/jobs/${id}`);
};

export const getJobCategories = () => {
  return api.get('/jobs/categories');
};

export const getSkills = () => {
  return api.get('/skills');
};

// Swipe API services
export const swipeJob = (jobId, direction) => {
  return api.post('/swipe', { jobId, direction });
};

export const getSwipeHistory = () => {
  return api.get('/swipe/history');
};

export const getMatches = () => {
  return api.get('/swipe/matches');
};

// Chat API services
export const getConversations = () => {
  return api.get('/messages/conversations');
};

export const getConversationById = (id) => {
  return api.get(`/messages/conversations/${id}`);
};

export const getConversationMessages = (id) => {
  return api.get(`/messages/conversations/${id}/messages`);
};

export const sendMessage = (conversationId, content) => {
  return api.post(`/messages/conversations/${id}/messages`, { content });
};

export const deleteMessage = (id) => {
  return api.delete(`/messages/${id}`);
};

// Interview API services
export const scheduleInterview = (interviewData) => {
  return api.post('/interviews', interviewData);
};

export const getInterviews = () => {
  return api.get('/interviews');
};

export const getInterviewById = (id) => {
  return api.get(`/interviews/${id}`);
};

export const updateInterview = (id, interviewData) => {
  return api.put(`/interviews/${id}`, interviewData);
};

export const cancelInterview = (id) => {
  return api.delete(`/interviews/${id}`);
};

export const joinInterview = (id) => {
  return api.post(`/interviews/${id}/join`);
};

// Recommendation API services
export const getJobRecommendations = () => {
  return api.get('/recommendations/jobs');
};

export const getCandidateRecommendations = () => {
  return api.get('/recommendations/candidates');
};

export const submitRecommendationFeedback = (feedbackData) => {
  return api.post('/recommendations/feedback', feedbackData);
};

// Notification API services
export const getNotifications = () => {
  return api.get('/notifications');
};

export const markNotificationAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};

export const getUnreadNotificationCount = () => {
  return api.get('/notifications/unread-count');
};

// Analytics API services
export const getProfileViewStats = () => {
  return api.get('/analytics/profile-views');
};

export const getSwipeStats = () => {
  return api.get('/analytics/swipe-stats');
};

export const getJobStats = () => {
  return api.get('/analytics/job-stats');
};

export const getCandidateEngagement = () => {
  return api.get('/analytics/candidate-engagement');
};

// Video processing services
export const uploadVideo = (formData, onUploadProgress) => {
  return api.post('/job-seekers/video-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });
};


// ------------------------------------------
// Authentication API services (from auth.routes.ts)
// ------------------------------------------
// UPDATED: Renamed from registerUser to signupUser and path to /auth/signup
export const signupUser = (userData) => {
  return api.post('/auth/signup', userData);
};

// UPDATED: Renamed from loginUser to signInUser and path to /auth/signin
export const signInUser = (credentials) => {
  return api.post('/auth/signin', credentials);
};

// UPDATED: No change in path, but route confirmed
export const logoutUser = () => {
  return api.post('/auth/logout');
};

// UPDATED: Path updated to /auth/refresh-token from /auth/refresh
export const refreshToken = () => {
  return api.post('/auth/refresh-token');
};

// UPDATED: No change in path, but route confirmed
export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

// UPDATED: No change in path, but route confirmed
export const resetPassword = (token, password) => {
  return api.post('/auth/reset-password', { token, password });
};

// NEW: Sign In with Google
export const signInWithGoogle = (token) => {
  return api.post('/auth/google', { token }); // Matches /auth/google from auth.routes.ts
};

// NEW: Sign Up with Google
export const signUpWithGoogle = (token) => {
  return api.post('/auth/signup/google', { token });
};

// NEW: Sign In with LinkedIn
export const linkedinSignIn = (code) => { // Assuming code is sent
  return api.post('/auth/signin/linkedin', { code });
};

// NEW: Sign Up with LinkedIn
export const linkedinSignUp = (code) => { // Assuming code is sent
  return api.post('/auth/signup/linkedin', { code });
};

// NEW: Exchange LinkedIn Token (for backend processing)
export const exchangeLinkedinToken = (tokenData) => {
  return api.post('/auth/linkedin/token', tokenData);
};

// NEW: Verify Token (useful for client-side token validation)
export const verifyAuthToken = () => {
  return api.post('/auth/verify-token');
};

// NEW: Delete User (from auth context, possibly for user to delete their own account)
export const deleteAuthUser = () => { // Or by ID if admin needs it
  return api.post('/auth/delete-user');
};


// ------------------------------------------
// Chat API services (inferred from index.ts and Chat.jsx)
// ------------------------------------------
// UPDATED: No change in path, previously inferred, now confirmed as common pattern
export const getConversations = () => {
  return api.get('/chat/conversations');
};

// UPDATED: No change in path, previously inferred, now confirmed as common pattern
export const getMessages = (conversationId) => {
  return api.get(`/chat/conversations/${conversationId}/messages`);
};

// UPDATED: No change in path, previously inferred, now confirmed as common pattern
export const sendMessage = (conversationId, content) => {
  return api.post(`/chat/conversations/${conversationId}/messages`, { content });
};

// NEW: Start Conversation
export const startConversation = (otherUserId, initialMessageContent) => {
  return api.post('/chat/conversations', { otherUserId, initialMessageContent });
};

// NEW: Mark message as read (based on Chat.jsx usage, assuming backend route /chat/messages/:id/read)
export const markAsRead = (messageId) => {
  return api.put(`/chat/messages/${messageId}/read`);
};


// ------------------------------------------
// Job Seeker API services (from job-seeker.routes.ts, and VideosPage.jsx usage)
// ------------------------------------------
// UPDATED: Paths for skill routes now consistently under /job-seekers/skills
export const getSkills = () => {
  return api.get('/job-seekers/skills');
};

// UPDATED: Path for addSkill
export const addSkill = (skillData) => {
  return api.post('/job-seekers/skills', skillData);
};

// UPDATED: Path for updateSkill
export const updateSkill = (id, skillData) => {
  return api.put(`/job-seekers/skills/${id}`, skillData);
};

// UPDATED: Path for deleteSkill
export const deleteSkill = (id) => {
  return api.delete(`/job-seekers/skills/${id}`);
};

// UPDATED: Get Job Seeker Videos
// Based on video.routes.ts: GET /api/videos/
export const getJobSeekerVideos = (page, limit) => {
  return api.get(`/videos?page=${page}&limit=${limit}`);
};

// NEW: Check Upload Limit (from VideosPage.jsx usage, assumed route)
// Note: This route was used in VideosPage.jsx but not explicitly found in provided backend route files.
// If your backend does not have this, it will result in a network error.
export const checkUploadLimit = () => {
  return api.get('/job-seekers/upload-limit');
};

// UPDATED: Check Upload Status (from job-seeker.routes.ts)
export const checkUploadStatus = (uploadId) => {
  return api.get(`/job-seekers/upload-status/${uploadId}`);
};

// NEW: Upload Video Resume (from video.routes.ts: POST /api/videos/video-resume)
// export const uploadVideoResume = (file) => {
//   const formData = new FormData();
//   formData.append('video', file); // 'video' should match your backend's expected field name
//   return api.post('/videos/video-resume', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// NEW: Delete Video (from video.routes.ts: DELETE /api/videos/:videoId)
export const deleteVideo = (videoId) => {
  return api.delete(`/videos/${videoId}`);
};

// NEW: Get Job Videos (from video.routes.ts: GET /api/videos/job/:jobId)
export const getVideosForJob = (jobId) => {
  return api.get(`/videos/job/${jobId}`);
};


// ------------------------------------------
// Employer API services (from employer.routes.ts)
// ------------------------------------------
// NEW: Create Company Profile
export const createCompanyProfile = (profileData) => {
  return api.post('/employer/company-profile', profileData);
};

// NEW: Update Company Profile
export const updateCompanyProfile = (id, profileData) => {
  return api.put(`/employer/company-profile/${id}`, profileData);
};

// NEW: Get Company Profile
export const getCompanyProfile = () => {
  return api.get('/employer/company-profile');
};

// NEW: Upload Company Video (assuming form-data for file upload)
export const uploadCompanyVideo = (file) => {
  const formData = new FormData();
  formData.append('video', file);
  return api.post('/employer/a-company-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// NEW: Get Company Videos
export const getCompanyVideos = () => {
  return api.get('/employer/company/videos');
};

// NEW: Get Company Video By ID
export const getCompanyVideoById = (videoId) => {
  return api.get(`/employer/company/videos/${videoId}`);
};

// NEW: Get Job Video (specific to a job ID)
export const getJobVideo = (jobId) => {
  return api.get(`/employer/jobs/${jobId}/video`);
};

// NEW: Post Job
export const postJob = (jobData) => {
  return api.post('/employer/job', jobData);
};

// NEW: Update Job
export const updateJob = (id, jobData) => {
  return api.put(`/employer/job/${id}`, jobData);
};

// NEW: Delete Job
export const deleteJob = (id) => {
  return api.delete(`/employer/job/${id}`);
};

// NEW: Get Jobs (Employer's own jobs)
export const getJobs = () => {
  return api.get('/employer/jobs');
};

// NEW: Get Job by ID (Employer's job)
export const getJob = (id) => {
  return api.get('/employer/job/${id}');
};

// NEW: Upload Logo (assuming form-data for file upload)
export const uploadLogo = (id, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  return api.post(`/employer/upload-logo/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// NEW: Upload Video (generic employer video upload, separate from company video)
export const uploadEmployerVideo = (id, file) => {
  const formData = new FormData();
  formData.append('video', file);
  return api.post(`/employer/upload-video/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


// ------------------------------------------
// Experience API services (from experience.routes.ts)
// ------------------------------------------
// NEW: Create Experience
export const createExperience = (experienceData) => {
  return api.post('/experiences', experienceData);
};

// NEW: Get User Experiences
export const getUserExperiences = () => {
  return api.get('/experiences');
};

// NEW: Get Experience By ID
export const getExperienceById = (id) => {
  return api.get(`/experiences/${id}`);
};

// NEW: Update Experience
export const updateExperience = (id, experienceData) => {
  return api.put(`/experiences/${id}`, experienceData);
};

// NEW: Delete Experience
export const deleteExperience = (id) => {
  return api.delete(`/experiences/${id}`);
};


// ------------------------------------------
// Category API services (from category.routes.ts)
// ------------------------------------------
// NEW: Get All Categories
export const getAllCategories = () => {
  return api.get('/categories');
};

// NEW: Get Category By ID
export const getCategory = (id) => {
  return api.get(`/categories/${id}`);
};

// NEW: Create Category
export const createCategory = (categoryData) => {
  return api.post('/categories', categoryData);
};

// NEW: Restore Category
export const restoreCategory = (id) => {
  return api.post(`/categories/${id}/restore`);
};

// NEW: Update Category
export const updateCategory = (id, categoryData) => {
  return api.put(`/categories/${id}`, categoryData);
};

// NEW: Delete Category
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

// NEW: Add Category to Job
export const addCategoryToJob = (jobId, categoryId) => {
  return api.post('/categories/jobs', { job_id: jobId, category_id: categoryId });
};

// NEW: Remove Category from Job
export const removeCategoryFromJob = (jobId, categoryId) => {
  return api.delete(`/categories/jobs/${jobId}/${categoryId}`);
};


// ------------------------------------------
// General Skills API services (from skills.routes.ts)
// These are for managing the *master list* of skills, not user-specific skills.
// ------------------------------------------
// NEW: Get All Skills (General)
export const getGeneralSkills = () => {
  return api.get('/skills');
};

// NEW: Get Skills By Category
export const getSkillsByCategory = (categoryId) => {
  return api.get(`/skills/category/${categoryId}`);
};

// NEW: Create Skill (General)
export const createSkill = (skillData) => {
  return api.post('/skills', skillData);
};

// NEW: Restore Skill (General)
export const restoreSkill = (id) => {
  return api.post(`/skills/${id}/restore`);
};

// NEW: Update Skill (General)
export const updateSkill = (id, skillData) => {
  return api.put(`/skills/${id}`, skillData);
};

// NEW: Delete Skill (General)
export const deleteSkill = (id) => {
  return api.delete(`/skills/${id}`);
};


// ------------------------------------------
// Admin API services (from admin.routes.ts)
// ------------------------------------------
// NEW: Get Users (Admin)
export const getAdminUsers = (params) => { // params can include filters/search queries
  return api.get('/admin/users', { params });
};

// NEW: Delete User (Admin)
export const deleteAdminUser = (id) => {
  return api.delete(`/admin/users/${id}`);
};

// NEW: Ban User (Admin)
export const banUser = (id) => {
  return api.post(`/admin/users/${id}/ban`);
};

// NEW: Get Reported Content (Admin)
export const getReportedContent = () => {
  return api.get('/admin/reports');
};

// NEW: Remove or Dismiss Reported Content (Admin)
export const removeReportedContent = (id, actionData) => {
  return api.post(`/admin/reports/${id}/action`, actionData);
};


// ------------------------------------------
// Analytics API services (from analytics.routes.ts)
// ------------------------------------------
// NEW: Get Profile View Stats
export const getProfileViewStats = () => {
  return api.get('/analytics/profile-views');
};

// NEW: Get Swipe Stats (Analytics)
export const getAnalyticsSwipeStats = () => {
  return api.get('/analytics/swipe-stats');
};

// NEW: Get Job Stats
export const getJobStats = () => {
  return api.get('/analytics/job-stats');
};

// NEW: Get Candidate Engagement
export const getCandidateEngagement = () => {
  return api.get('/analytics/candidate-engagement');
};


// ------------------------------------------
// Interview API services (from interview.routes.ts)
// ------------------------------------------
// NEW: Schedule Interview
export const scheduleInterview = (interviewData) => {
  return api.post('/interviews', interviewData);
};

// NEW: Get Interviews (list)
export const getInterviews = () => {
  return api.get('/interviews');
};

// NEW: Get Interview Details by ID
export const getInterviewDetails = (id) => {
  return api.get(`/interviews/${id}`);
};

// NEW: Update Interview
export const updateInterview = (id, updateData) => {
  return api.put(`/interviews/${id}`, updateData);
};

// NEW: Cancel Interview
export const cancelInterview = (id) => {
  return api.delete(`/interviews/${id}`);
};

// NEW: Join Interview
export const joinInterview = (id) => {
  return api.get(`/interviews/${id}/join`);
};


// ------------------------------------------
// Matching API services (from matching.routes.ts)
// ------------------------------------------
// NEW: Get Matching Jobs
export const getMatchingJobs = () => {
  return api.get('/matching/jobs');
};

// NEW: Get Matching Users (for a specific job)
export const getMatchingUsers = (jobId) => {
  return api.get(`/matching/users/${jobId}`);
};

// NEW: Get User Recommendations (from matching context)
export const getMatchingUserRecommendations = () => { // Renamed to avoid clash with general recommendations
  return api.get('/matching/recommendations');
};


// ------------------------------------------
// Notifications API services (from notification.routes.ts)
// ------------------------------------------
// NEW: Get User Notifications
export const getUserNotifications = () => {
  return api.get('/notifications');
};

// NEW: Mark Notification as Read
export const markNotificationAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};

// NEW: Delete Notification
export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};

// NEW: Create Notification (typically for backend/admin use)
export const createNotification = (notificationData) => {
  return api.post('/notifications', notificationData);
};


// ------------------------------------------
// Recommendations API services (from recommendation.routes.ts)
// ------------------------------------------
// NEW: Get Job Recommendations
export const getJobRecommendations = () => {
  return api.get('/recommendations/jobs');
};

// NEW: Get Candidate Recommendations
export const getCandidateRecommendations = () => {
  return api.get('/recommendations/candidates');
};

// NEW: Submit Recommendation Feedback
export const submitRecommendationFeedback = (feedbackData) => {
  return api.post('/recommendations/feedback', feedbackData);
};


// ------------------------------------------
// Swipes API services (from swipe.routes.ts)
// ------------------------------------------
// NEW: Record Swipe
export const recordSwipe = (swipeData) => {
  return api.post('/swipes', swipeData);
};

// NEW: Get Swipe History
export const getSwipeHistory = () => {
  return api.get('/swipes');
};

// NEW: Get Matches (general, from swipe context)
export const getMatches = () => {
  return api.get('/swipes/matches');
};

// NEW: Get Match Details
export const getMatchDetails = (id) => {
  return api.get(`/swipes/matche/${id}`);
};

// NEW: Accept Match
export const acceptMatch = (id) => {
  return api.post(`/swipes/matche/${id}/accept`);
};

// NEW: Reject Match
export const rejectMatch = (id) => {
  return api.post(`/swipes/matche/${id}/reject`);
};

// NEW: Get Swipe Stats
export const getSwipeStats = () => {
  return api.get('/swipes/stats');
};


// ------------------------------------------
// User Profile API services (from user.routes.ts)
// Note: These are for the *authenticated user's own profile*.
// ------------------------------------------
// NEW: Get Current User's Profile
export const getMe = () => {
  return api.get('/users/me');
};

// NEW: Update Current User's Profile
export const updateMe = (profileData) => {
  return api.put('/users/me', profileData);
};

// NEW: Upload Current User's Avatar
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file); // 'avatar' should match your backend's expected field name
  return api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Export the axios instance for direct use if needed
export default api;