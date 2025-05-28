import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
        }
      });
      setConversations(response.data.conversations);
      if (response.data.conversations.length > 0 && !activeConversation) {
        setActiveConversation(response.data.conversations[0].partner.id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (partnerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/chat/messages/${partnerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      const response = await axios.post(`${apiUrl}/api/chat/send`, {
        receiverId: activeConversation,
        message: newMessage
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setMessages([...messages, response.data.chatMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  return (
    <Box sx={{ display: 'flex', height: '80vh', border: '1px solid #ddd' }}>
      {/* Conversations sidebar */}
      <Box sx={{ width: 250, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2 }}>Conversations</Typography>
        {loading && conversations.length === 0 ? (
          <Typography sx={{ p: 2 }}>Loading...</Typography>
        ) : (
          <List>
            {conversations.map((conv) => (
              <ListItem 
                key={conv.partner.id}
                button
                selected={activeConversation === conv.partner.id}
                onClick={() => setActiveConversation(conv.partner.id)}
              >
                <Avatar src={conv.partner.photo_url} sx={{ mr: 2 }} />
                <ListItemText 
                  primary={conv.partner.display_name || conv.partner.email}
                  secondary={conv.lastMessage?.message || 'No messages'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Chat area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConversation ? (
          <>
            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {loading && messages.length === 0 ? (
                <Typography>Loading messages...</Typography>
              ) : messages.length === 0 ? (
                <Typography>No messages yet. Start the conversation!</Typography>
              ) : (
                messages.map((msg) => (
                  <Box 
                    key={msg.id}
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      justifyContent: msg.sender_id === activeConversation ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <Box sx={{ 
                      bgcolor: msg.sender_id === activeConversation ? '#eee' : '#1976d2',
                      color: msg.sender_id === activeConversation ? '#000' : '#fff',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '70%'
                    }}>
                      <Typography>{msg.message}</Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        textAlign: 'right',
                        color: msg.sender_id === activeConversation ? '#666' : 'rgba(255,255,255,0.7)'
                      }}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message input */}
            <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button 
                variant="contained" 
                sx={{ ml: 1 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography>Select a conversation to start chatting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;