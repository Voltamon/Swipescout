import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+'/api' || 'http://localhost:5000/api';

// إنشاء نسخة من axios مع الإعدادات الأساسية
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token;
// إضافة معترض للطلبات لإضافة توكن المصادقة
api.interceptors.request.use(
  (config) => {
     token = localStorage.getItem('accessToken') ;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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

export const logoutUser = () => {
  return api.post('/auth/logout');
};

export const refreshToken = () => {
  return api.post('/auth/refresh');
};

export const forgotPassword = async (data) => {
  
    const response = await api.post(`/auth/forgot-password/`, {
      email: data.email
    });
    return response.data;
  
};

export const resetPassword = async (data) => {
  
    const response = await api.post(`/auth/reset-password/`, {
      oobCode: data.oobCode,
      newPassword: data.newPassword
    });
    return response.data;
 
};

export const getCurrentUser = () => {
  return api.get('/users/me');
};

export const updateCurrentUser = (userData) => {
  return api.put('/users/me', userData);
};


export const uploadAvator = (formData) => {
  return api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadVideoResume = (formData) => {
  return api.post('/videos/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const checkUploadStatus = (id) => {
  return api.get(`/videos/upload-status/${id}`);
};
export const getVideoResume = () => {
  return api.get('/videos/');
};
export const getJobVideos = (id) => {
  return api.get(`/videos/job/${id}`);
};
export const deleteVideo = (id) => {
  return api.delete(`videos/${id}`);
};


export const uploadProfileImage = (formData) => {
  return api.post('/job-seeker/upload-logo/',formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateUserProfile = (formData) => {
  return api.put('/job-seeker/',formData);
};


export const getUserProfile = () => {
  return api.get(`/job-seeker/`); // : api.get('/users/me');
};

export const getJobSeekerProfile = (id) => {
  return api.get(`/job-seeker/${id}`); // : api.get('/users/me');
};


// JobSeeker API services
export const getUserSkills = () => {
  return api.get('/job-seeker/skills');
};

export const addUserSkill = (skill) => {
  return api.post('/job-seeker/skills',  skill );
};

export const updateUserSkill = (id, newSkill) => {
  return api.put(`/job-seeker/skills/${id}`, { skill: newSkill });
};

export const deleteUserSkill = (id) => {
  return api.delete(`/job-seeker/skills/${id}`);
};

export const getUserExperiences = () => {
  return api.get('/experiences/'); 
}; 


export const getJobSeekerExperiences = (id) => { 
  return api.get(`/experiences/user/${id}`); 
}; 

export const addUserExperience = (experience) => {
  return api.post('/experiences/', experience);
};

export const updateUserExperience = (id, experience) => {
  return api.put(`/experiences/${id}`, experience);
  // return api.put(`/experiences/${id}`, experience);
};

export const deleteUserExperience = (id) => {
  return api.delete(`/experiences/${id}`);
  // return api.delete(`/experiences/${id}`);
};

export const getUserEducation = () => {
  return api.get('/education/');
};

export const getJobSeekerEducation = (id) => {
  return api.get(`/education/user/${id}`);
};

export const addUserEducation = (education) => {
  return api.post('/education/', education);
};

export const updateUserEducation = (id, education) => {
  return api.put(`/education/${id}`, education);
};

export const deleteUserEducation = (id) => {
  return api.delete(`/education/${id}`);
};

export const getUserVideos = () => {
  return api.get('/videos');
};

export const getAllVideos = (page = 1, limit = 10) => {
  return api.get('/videos/all', {
    params: {
      page,
      limit,
    },
  });
};


export const getUserVideosByUserId = (id) => {
  return api.get(`/videos/user/${id}`);
};

export const getJobSeekersVideos = (page = 1, limit = 10) => {
  return api.get('/videos/jobseekers', {
    params: {
      page,
      limit,
    },
  });
};

export const getEmployerPublicVideos = (page = 1, limit = 10) => {
  return api.get('/videos/employers', {
    params: {
      page,
      limit,
    },
  });
};

export const getUserVideoById = (id) => {
  return api.get(`/videos/${id}`);
};

export const updateUserVideo = (id, videoData) => {
  return api.put(`/videos/${id}`, videoData);
};

export const deleteUserVideo = (id) => {
  return api.delete(`/videos/${id}`);
};

// Employer API services
export const getEmployerProfile = () => {
  console.log('Fetching employer profile...',token);
  return api.get(`/employer/employer-profile/`) ;//: api.get('/employers/company');
};

export const getEmployerPublicProfile = (id) => {
  return api.get(`/employer/employer-profile/${id}`); // : api.get('/users/me');
};

export const updateEmployerProfile = (companyData) => {
  console.log(companyData);
  return api.put(`/employer/employer-profile/`, companyData);
};

export const createEmployerProfile = (companyData) => {
  console.log(companyData);
  return api.post(`/employer/employer-profile/`, companyData);
};

export const uploadCompanyLogo = (formData) => {
  return api.post(`/employer/upload-logo/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getEmployerJobs = () => {
  return api.get(`employer/jobs/`); //: api.get('/employers/jobs');
};

export const getEmployerPublicJobs = (id) => {
  return api.get(`employer/jobs/${id}`); 
};

export const getJobDetails = (id) => {
  return api.get(`employer/job/${id}`); //: api.get('/employers/jobs');
};

export const getEmployerVideos = () => {
  return api.get(`/videos/`);// : api.get('/employers/videos');
};

// Job API services
export const getAllJobs = (params) => {
  return api.get('/employer/jobs', { params });
};

export const getAllJobsPosted = (params) => {
  return api.get('/job/', { params });
};

export const getJobById = (id) => {
  return api.get(`/employer/job/${id}`);
};

export const postJob = (jobData) => {
  return api.post('/employer/job', jobData);
};

export const updateJob = (id, jobData) => {
  return api.put(`/employer/job/${id}`, jobData);
};

export const deleteJob = (id) => {
  return api.delete(`/employer/job/${id}`);
};

export const getJobCategories = (id) => {
  return api.get(`/categorie/job/${id}`); //.categories
};

export const getCategories = () => {
  return api.get('/categories');
};

export const getEmployerCategories = () => {
  return api.get('/employer/categories');
};


export const addEmployerCategory = (id) => {
  return api.post(`/employer/category/${id}`);
};

export const deleteEmployerCategory = (id) => {
  return api.delete(`/employer/category/${id}`);
};

export const getSkills = () => {
  return api.get('/skills');
};

export const getJobSeekerSkills = (id) => {
  return api.get(`/skills/user/${id}`);
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
  return api.post('/job-seeker/video-resume', formData, {
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
// إضافة معترض للاستجابات للتعامل مع أخطاء المصادقة
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // إذا كان الخطأ 401 (غير مصرح) وليس محاولة تحديث التوكن
//     if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
//       originalRequest._retry = true;
      
//       try {
//         // محاولة تحديث التوكن
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }
        
//         const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refresh_token: refreshToken
//         });
        
//         const { token } = response.data;
//         localStorage.setItem('token', token);
        
//         // إعادة الطلب الأصلي مع التوكن الجديد
//         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // إذا فشل تحديث التوكن، قم بتسجيل الخروج
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//         // window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default api;
