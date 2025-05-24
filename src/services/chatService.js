import axios from 'axios';
import { getAuthHeader } from './authService';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

export const getConversations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/chat/conversations/${conversationId}/messages`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}; 

export const sendMessage = async (conversationId, content) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages`,
      { content },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markAsRead = async (messageId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/chat//messages/${messageId}/read`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const startConversation = async (recipientId, content) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/conversations`,
      { recipient_id: recipientId, content },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};