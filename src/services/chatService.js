import axios from "axios";
import api from "./api.js";

/** 
 * Service for handling chat-related API requests
 * Provides methods for fetching conversations, messages, and sending messages
 */

/**
 * Get all conversations for the current user
 * @returns {Promise} Promise object with conversations data
 */
export const getConversations = () => {
  return api.get("/chat/conversations");
};

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise} Promise object with messages data
 */
export const getMessages = conversationId => {
  return api.get(`/chat/conversation/${conversationId}`);
};

/**
 * Get all users from the database
 * @returns {Promise} Promise object with all users data
 */
export const getAllUsers = () => {
  return api.get("/chat/users/all"); // Backend endpoint for all users
};

/**
 * Send a new message in a conversation
 * @param {string} conversationId - ID of the conversation
 * @param {string} content - Message content
 * @returns {Promise} Promise object with the sent message data
 */
export const sendMessage = (conversationId, content) => {
  return api.post(`/chat/send`, {
    conversationId,
    content
  });
};

/**
 * Mark a message as read
 * @param {string} messageId - ID of the message
 * @returns {Promise} Promise object with the updated message data
 */
export const markAsRead = messageId => {
  return api.post(`/chat/read/${messageId}`);
};

/**
 * Start a new conversation with another user
 * @param {string} receiverId - ID of the message recipient
 * @param {string} initialMessage - First message content
 * @returns {Promise} Promise object with the new conversation data
 */
export const startConversation = (receiverId, initialMessage) => {
  return api.post("/chat/start", { receiverId, initialMessage });
};

/**
 * Delete a message
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise} Promise object with deletion confirmation
 */
export const deleteMessage = messageId => {
  return api.delete(`/chat/message/${messageId}`);
};

/**
 * Get count of unread messages
 * @returns {Promise} Promise object with unread message count
 */
export const getUnreadCount = () => {
  return api.get("/chat/unread/count");
};
