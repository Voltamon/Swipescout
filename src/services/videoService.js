import axios from 'axios';
import api from './api';

/**
 * Service for handling video-related API requests
 * Provides methods for uploading videos and saving metadata
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Upload a video file with progress tracking
 * @param {FormData} formData - FormData containing the video file
 * @param {Function} progressCallback - Callback function for upload progress
 * @returns {Promise} Promise object with uploaded video data
 */
export const uploadVideo = async (formData, progressCallback) => {
  return api.post(`${API_BASE_URL}/api/job-seekers/video-resume`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (progressCallback) {
        progressCallback(percentCompleted);
      }
    }
  });
};

/**
 * Save video metadata after upload
 * @param {Object} videoData - Object containing video metadata
 * @returns {Promise} Promise object with saved video metadata
 */
export const saveVideoMetadata = async (videoData) => {
  return api.post(`${API_BASE_URL}/api/job-seekers/video-metadata`, videoData);
};

/**
 * Get all videos for the current user
 * @returns {Promise} Promise object with user videos
 */
export const getUserVideos = () => {
  return api.get(`${API_BASE_URL}/api/job-seekers/videos`);
};

/**
 * Get a specific video by ID
 * @param {string} videoId - ID of the video to retrieve
 * @returns {Promise} Promise object with video data
 */
export const getVideoById = (videoId) => {
  return api.get(`${API_BASE_URL}/api/job-seekers/videos/${videoId}`);
};

/**
 * Delete a video
 * @param {string} videoId - ID of the video to delete
 * @returns {Promise} Promise object with deletion confirmation
 */
export const deleteVideo = (videoId) => {
  return api.delete(`${API_BASE_URL}/api/job-seekers/videos/${videoId}`);
};

/**
 * Update video metadata
 * @param {string} videoId - ID of the video to update
 * @param {Object} videoData - Updated video metadata
 * @returns {Promise} Promise object with updated video data
 */
export const updateVideoMetadata = (videoId, videoData) => {
  return api.put(`${API_BASE_URL}/api/job-seekers/videos/${videoId}`, videoData);
};
