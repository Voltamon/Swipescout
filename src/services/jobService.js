// src/services/jobService.js
import axios from "axios";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Get recommended jobs for the user
export const getRecommendedJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/jobs/recommended`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    throw error;
  }
};

// Record a swipe (like/dislike) action for a job
export const recordSwipe = async ({ job_id, direction, notes }) => {
  try {
    const response = await axios.post(`${API_URL}/jobs/swipe`, {
      job_id,
      direction,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Error recording swipe:", error);
    throw error;
  }
};
