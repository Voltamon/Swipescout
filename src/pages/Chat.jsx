import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,  
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  TextField, 
  IconButton, 
  Badge, 
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Send as SendIcon, 
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markAsRead 
} from '../services/chatService';
import { useSocket } from '../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Styled components for chat UI
const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 56px)',
  },
}));

const ConversationList = styled(Paper)(({ theme, isMobile, showConversations }) => ({
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'flex' : 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
}));

const MessageArea = styled(Paper)(({ theme, isMobile, showConversations }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'none' : 'flex',
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageItem = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: 16,
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[200],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  wordBreak: 'break-word',
}));

const MessageTime = styled(Typography)(({ theme, isOwn }) => ({
  fontSize: '0.75rem',
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: isOwn ? 'right' : 'left',
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = useSocket();
  
  const isMobile = window.innerWidth < 960;

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    }; 

    fetchConversations();
  }, []);

  // Set up socket listeners for real-time messaging
  useEffect(() => {
    if (!socket) return;

    // Register user with socket server
    socket.emit('register', user.id);

    // Listen for new messages
    socket.on('new_message', (message) => {
      if (activeConversation && message.conversation_id === activeConversation.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        markAsRead(message.id);
        socket.emit('mark_as_read', { messageId: message.id, senderId: message.sender_id });
      }
      
      // Update conversation list
      setConversations((prevConversations) => {
        const updatedConversations = [...prevConversations];
        const conversationIndex = updatedConversations.findIndex(
          (conv) => conv.id === message.conversation_id
        );
        
        if (conversationIndex !== -1) {
          const conversation = { ...updatedConversations[conversationIndex] };
          conversation.last_message = message;
          
          if (activeConversation?.id !== message.conversation_id) {
            conversation.unread_count = (conversation.unread_count || 0) + 1;
          }
          
          updatedConversations[conversationIndex] = conversation;
          
          // Move conversation to top
          updatedConversations.splice(conversationIndex, 1);
          updatedConversations.unshift(conversation);
        }
        
        return updatedConversations;
      });
    });

    // Listen for message read confirmations
    socket.on('message_read', (messageId) => {
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('new_message');
      socket.off('message_read');
    };
  }, [socket, user, activeConversation]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      
      try {
        setLoading(true);
        const response = await getMessages(activeConversation.id);
        setMessages(response.data.messages);
        
        // Update unread count in conversations list
        setConversations((prevConversations) => 
          prevConversations.map((conv) => 
            conv.id === activeConversation.id 
              ? { ...conv, unread_count: 0 } 
              : conv
          )
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    if (isMobile) {
      setShowConversations(false);
    }
  }, [activeConversation, isMobile]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      const response = await sendMessage(activeConversation.id, newMessage);
      const sentMessage = response.data.message;
      
      // Add message to the list
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      
      // Update conversation in the list
      setConversations((prevConversations) => {
        const updatedConversations = [...prevConversations];
        const conversationIndex = updatedConversations.findIndex(
          (conv) => conv.id === activeConversation.id
        );
        
        if (conversationIndex !== -1) {
          const conversation = { ...updatedConversations[conversationIndex] };
          conversation.last_message = sentMessage;
          
          updatedConversations[conversationIndex] = conversation;
          
          // Move conversation to top
          updatedConversations.splice(conversationIndex, 1);
          updatedConversations.unshift(conversation);
        }
        
        return updatedConversations;
      });
      
      // Emit socket event
      if (socket) {
        socket.emit('send_message', {
          receiverId: activeConversation.other_user.id,
          message: sentMessage
        });
      }
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => 
    conversation.other_user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: enUS
    });
  };

  // Handle back button on mobile
  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  return (
    <ChatContainer>
      <Grid container sx={{ height: '100%' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <ConversationList 
            elevation={0} 
            isMobile={isMobile} 
            showConversations={showConversations}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>
            
            <List sx={{ overflow: 'auto', flex: 1 }}>
              {loading && conversations.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : filteredConversations.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No conversations found" 
                    secondary={searchQuery ? "Try a different search term" : "Start a new conversation"} 
                  />
                </ListItem>
              ) : (
                filteredConversations.map((conversation) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem 
                      button 
                      selected={activeConversation?.id === conversation.id}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="primary"
                          badgeContent={conversation.unread_count}
                          invisible={conversation.unread_count === 0}
                        >
                          <Avatar src={conversation.other_user.photo_url}>
                            {conversation.other_user.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.other_user.name}
                        secondary={
                          conversation.last_message ? (
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                              noWrap
                              sx={{ 
                                display: 'inline-block', 
                                maxWidth: '180px',
                                fontWeight: conversation.unread_count > 0 ? 'bold' : 'normal'
                              }}
                            >
                              {conversation.last_message.content}
                            </Typography>
                          ) : "No messages yet"
                        }
                      />
                      {conversation.last_message && (
                        <Typography variant="caption" color="textSecondary">
                          {formatMessageTime(conversation.last_message.created_at)}
                        </Typography>
                      )}
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </ConversationList>
        </Grid>
        
        {/* Message Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <MessageArea 
            elevation={0} 
            isMobile={isMobile} 
            showConversations={showConversations}
          >
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {isMobile && (
                    <IconButton 
                      edge="start" 
                      onClick={handleBackToConversations}
                      sx={{ mr: 1 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Avatar 
                    src={activeConversation.other_user.photo_url}
                    sx={{ mr: 2 }}
                  >
                    {activeConversation.other_user.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {activeConversation.other_user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {activeConversation.other_user.role === 'employer' ? 'Employer' : 'Job Seeker'}
                    </Typography>
                  </Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                {/* Messages */}
                <MessageList>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%'
                    }}>
                      <Typography variant="body1" color="textSecondary">
                        No messages yet
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Start the conversation by sending a message
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.sender_id === user.id;
                      return (
                        <MessageItem key={message.id} isOwn={isOwn}>
                          {!isOwn && (
                            <Avatar 
                              src={activeConversation.other_user.photo_url}
                              sx={{ mr: 1, width: 36, height: 36 }}
                            >
                              {activeConversation.other_user.name.charAt(0)}
                            </Avatar>
                          )}
                          <Box>
                            <MessageBubble isOwn={isOwn}>
                              <Typography variant="body1">
                                {message.content}
                              </Typography>
                            </MessageBubble>
                            <MessageTime variant="caption" isOwn={isOwn}>
                              {formatMessageTime(message.created_at)}
                              {isOwn && (
                                <span style={{ marginLeft: 4 }}>
                                  {message.read ? ' • Read' : ' • Sent'}
                                </span>
                              )}
                            </MessageTime>
                          </Box>
                        </MessageItem>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </MessageList>
                
                {/* Message Input */}
                <MessageInput component="form" onSubmit={handleSendMessage}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                  />
                  <IconButton 
                    color="primary" 
                    type="submit"
                    disabled={!newMessage.trim()}
                    sx={{ ml: 1 }}
                  >
                    <SendIcon />
                  </IconButton>
                </MessageInput>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 3
              }}>
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Choose a conversation from the list to start chatting
                </Typography>
              </Box>
            )}
          </MessageArea>
        </Grid>
      </Grid>
    </ChatContainer>
  );
};

export default Chat;
