import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const VideoEmptyState = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (!user || user.role === null) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    }
    if (user.role === 'jobseeker' || user.role === 'JobSeeker') {
      navigate('/jobseeker-tabs?group=profileContent&tab=video-upload');
    } else if (user.role === 'employer' || user.role === 'Employer' || user.role === 'company') {
      navigate('/employer-tabs?group=profileContent&tab=video-upload');
    } else {
      // Default to jobseeker page or login
      navigate('/login');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden !bg-gradient-to-br !from-gray-900 !via-gray-800 !to-black"
      style={{ background: 'linear-gradient(to bottom right, #111827, #1f2937, #000000)' }}
    >
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 !bg-gradient-to-br !from-gray-900 !via-gray-800 !to-black animate-pulse-slow"></div>
      
      {/* Enhanced floating geometric shapes with more variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/20 rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-indigo-500/20 rounded-full animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-pink-500/20 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-gradient-to-r from-pink-600/20 to-indigo-600/20 rounded-lg rotate-12 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        {/* New floating elements */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full animate-bounce-slow" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-lg rotate-45 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main content with enhanced styling */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Subtle video icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative cursor-pointer" onClick={handleUploadClick}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg animate-slide-up hover:scale-110 transition-transform duration-300">
              <svg 
                className="w-5 h-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-md opacity-20 animate-pulse-slow"></div>
          </div>
        </div>

        {/* Enhanced main heading with bright yellow text and glowing edges */}
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-6 animate-fade-in drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(253, 224, 71, 0.8), 0 0 20px rgba(253, 224, 71, 0.6), 0 0 30px rgba(253, 224, 71, 0.4)' }}>
          {t('videos.noVideosTitle', 'No videos yet')}
        </h1>

        {/* Enhanced subtitle with bright white text and glowing edges */}
        <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed animate-slide-up drop-shadow-md" style={{ animationDelay: '0.2s', textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6)' }}>
          {t('videos.noVideosSubtitle', 'Be the first to share your story')}
        </p>

        {/* Enhanced call to action with better styling */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button onClick={handleUploadClick} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out">
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              {t('videos.uploadFirst', 'Upload Your First Video')}
            </span>
            {/* Enhanced button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            {/* Button border animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Enhanced additional info with bright white text and glowing edges */}
        <div className="mt-12 text-white animate-fade-in drop-shadow-sm" style={{ animationDelay: '0.6s', textShadow: '0 0 8px rgba(255, 255, 255, 1), 0 0 16px rgba(255, 255, 255, 0.8), 0 0 24px rgba(255, 255, 255, 0.6)' }}>
          <p className="text-sm">
            {t('videos.emptyStateInfo', 'Connect with professionals and showcase your skills through video')}
          </p>
        </div>
      </div>

      {/* Enhanced bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
};

export default VideoEmptyState;