//complete Chat.jsx file with all the requested enhancements, incorporating better contrast, improved message time display, distinct sent/read indicators, refined online status presentation, and clear background differentiation for conversation and user lists.
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
  InputAdornment,
  Tooltip , alpha
} from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  Done as DoneIcon, // For sent
  DoneAll as DoneAllIcon, // For read
  Refresh as RefreshIcon // For retry failed message
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  startConversation,
  getAllUsers
} from '../services/chatService';
import { useSocket } from '../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns'; // Still useful for general relative time, but replaced by custom for messages
import { enUS } from 'date-fns/locale';
import { Weight } from 'lucide-react';

// Styled components with beautiful design
const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  
  backgroundColor: '#f5f7fa', // Light background for the overall chat area
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 56px)',
  },
}));

const ConversationList = styled(Paper)(({ theme, showConversations, showAllUsers }) => ({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.palette.divider}`,
  // Different background for "All Users" vs. "Conversations"
  backgroundColor: showAllUsers ? '#edf2f7' : '#ffffff',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'flex' : 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    height: 'calc(100vh - 56px)',
  },
}));

const MessageArea = styled(Paper)(({ theme, showConversations }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgb(167, 191, 226)', // Light background for message area
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'none' : 'flex',
    height: 'calc(100vh - 56px)',
    marginLeft: showConversations ? 0 : '0px', // Adjust margin for mobile when conversation is active
    transition: 'margin-left 0.3s ease',
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)', // Gradient background for message list
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1', // Scrollbar thumb color
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1', // Scrollbar track color
  },
}));

const MessageItem = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  marginBottom: theme.spacing(1.5), // Slightly reduced margin for a tighter feel
  width: '100%',
  alignItems: 'flex-end',
  // Removed transition from here as bubble itself handles its transitions
}));

// MessageBubble controls the background, border, and text color
const MessageBubble = styled(Box)(({ theme, isOwn, isPending, hasError }) => ({
  maxWidth: '75%', // Slightly reduced max-width for better multi-line readability
  minWidth: '250px', // Allow it to shrink below 120px for very short messages
  padding: '10px 14px', // Slightly adjusted padding
  borderRadius: isOwn ? '20px 4px 20px 20px' : '4px 20px 20px 20px', // More rounded corners, distinctive sent/received
  wordBreak: 'break-word',
  display: 'inline-block', // Keep inline-block for fitting content
  position: 'relative', // For potential future absolute positioning of indicators
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Smooth transition for all properties
  
  // Background Colors
  backgroundColor: isOwn
    ? (isPending ? alpha('rgb(145, 207, 187)', 0.7) : (hasError ? theme.palette.error.dark : 'rgb(107, 161, 185)'))
    : (isPending ? alpha(theme.palette.grey[200], 0.7) : (hasError ? theme.palette.error.light : 'rgb(84, 179, 147)')),
  
  // Text Colors
  color: isOwn 
    ? 'rgb(12, 55, 73)' // White for own messages
    : (hasError ? theme.palette.error.contrastText : 'rgb(13, 57, 77)'), // Darker text for received, contrast for error
  
  // Box Shadow
  boxShadow: isPending || hasError
    ? '0 0 8px rgba(0,0,0,0.1)' // More subtle shadow for pending/error
    : theme.shadows[3], // Slightly elevated shadow for normal messages
  
  // Margins to align bubbles
  marginLeft: isOwn ? 'auto' : theme.spacing(1),
  marginRight: isOwn ? theme.spacing(1) : 'auto',
  
  // Border for received messages (optional, can be removed if a strong shadow is enough)
  border: isOwn ? 'none' : `1px solid ${theme.palette.grey[300]}`,
  
  // Opacity for pending/error states
  opacity: isPending ? 0.7 : (hasError ? 0.9 : 1),

  // Hover Effect
  '&:hover': {
    boxShadow: isPending || hasError 
      ? '0 0 10px rgba(0,0,0,0.15)' 
      : theme.shadows[6], // More pronounced shadow on hover
    transform: 'translateY(-2px)', // Subtle lift on hover
  },

  // Specific styles for error messages
  ...(hasError && {
    border: `1px solid ${theme.palette.error.main}`,
    animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both', // Subtle shake animation for errors
    transformOrigin: '50% 100%',
    '@keyframes shake': {
      '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
      '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
      '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
      '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
    },
  }),
}));

const MessageTime = styled(Typography)(({ isOwn }) => ({
  fontSize: '0.65rem', // Smaller font size for message time
  color: isOwn ? 'rgba(22, 22, 73, 0.7)' : 'rgba(22, 22, 73, 0.7)', // Consistent color, slightly transparent for own
  marginTop: '4px',
  textAlign: isOwn ? 'right' : 'left',
  paddingLeft: isOwn ? 0 : '8px',
  paddingRight: isOwn ? '8px' : 0,
  display: 'flex',
  alignItems: 'center',
  gap: '4px', // Space between time and status icon
  fontFamily: 'inherit', // Inherit font for consistency
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: '1px solid #e5e7eb', // Border above input
  backgroundColor: '#ffffff', // White background for input area
  alignItems: 'center',
}));

const UserStatusBadge = styled('span')(({ theme }) => ({
  color: '#10b981', // Green for online status
  fontSize: '0.75rem',
  marginLeft: theme.spacing(0.5),
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 500,
  '&::before': {
    content: '"•"', // Dot for online status
    marginRight: '2px',
  },
}));

const MessageStatusIcon = styled(Box)(({ read, isOwn }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.85rem', // Smaller icon size
    color: read ? '#a5d6a7' : (isOwn ? 'rgba(255,255,255,0.6)' : '#9ca3af'), // Greenish for read, greyish for sent
  },
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  left: '-50px', // Position off-screen for mobile
  top: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
  [theme.breakpoints.up('md')]: {
    display: 'none', // Hide on larger screens
  },
}));

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    conversations: true,
    messages: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null); // Reference for message list scroll
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  const [pendingMessages, setPendingMessages] = useState({}); // To track messages being sent
  const [failedMessages, setFailedMessages] = useState({}); // To track messages that failed to send
  const [textToggel, setTextToggel] = useState('All Users'); 

  const isMobile = window.innerWidth < 960;

  // Improved time formatting function for brevity and clarity
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined // Show year only if different
    });
  };

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await getAllUsers();
      setAllUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTyping = (data) => {
    if (
      data.conversationId === activeConversation?.id &&
      data.userId !== user.id
    ) {
      setOtherUserTyping(data.isTyping);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const trimmed = value.trim();

    if (trimmed) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', {
          conversationId: activeConversation?.id,
          userId: String(user.id),
          otherUserId: String(activeConversation?.other_user?.id),
          isTyping: true,
        });
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          conversationId: activeConversation?.id,
          userId: String(user.id),
          otherUserId: String(activeConversation?.other_user?.id),
          isTyping: false,
        });
      }, 1300);
    } else if (isTyping) {
      setIsTyping(false);
      socket.emit('typing', {
        conversationId: activeConversation?.id,
        userId: String(user.id),
        otherUserId: String(activeConversation?.other_user?.id),
        isTyping: false,
      });
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        const response = await getConversations();
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, [user?.id]); // Depend on user.id to refetch if user changes

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('register', String(user.id)); // Register user with socket server
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    // Listen for user online/offline status
    socket.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    socket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    const handleNewMessage = (message) => {
      // If the new message is for the currently active conversation
      if (activeConversation && message.conversation_id === activeConversation.id) {
        setMessages(prev => [...prev, message]); // Add to messages displayed
        markAsRead(message.id); // Mark as read via API
        socket.emit('mark_as_read', { messageId: message.id, senderId: message.sender_id }); // Emit read event
      }

      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === message.conversation_id);

        if (index !== -1) {
          const conversation = { ...updated[index], last_message: message };

          if (activeConversation?.id !== message.conversation_id) {
            conversation.unread_count = (conversation.unread_count || 0) + 1; // Increment unread if not active
          } else {
            conversation.unread_count = 0; // Reset unread if active
          }

          updated.splice(index, 1); // Remove old position
          updated.unshift(conversation); // Move to top
        }
        return updated;
      });
    };

    const handleMessageRead = (messageId) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg // Update read status of message
        )
      );
    };

    // Attach socket listeners
    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);
    socket.on('typing', handleTyping);

    // Clean up listeners on component unmount
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
      socket.off('typing', handleTyping);
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket, user, activeConversation]); // Re-run if socket, user, or active conversation changes

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const response = await getMessages(activeConversation.id);
        const fetchedMessages = response.data.messages || [];
        setMessages(fetchedMessages);

        // Mark all newly fetched unread messages as read when conversation is opened
        const unreadMessagesInActiveConv = fetchedMessages.filter(
          (msg) => msg.receiver_id === user?.id && !msg.read
        );
        if (unreadMessagesInActiveConv.length > 0) {
          unreadMessagesInActiveConv.forEach(async (msg) => {
            await markAsRead(msg.id); // Call API to mark as read
            socket.emit('mark_as_read', { messageId: msg.id, senderId: msg.sender_id }); // Notify other users
          });
        }

        // Reset unread count for the active conversation in the conversations list
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversation.id
              ? { ...conv, unread_count: 0 }
              : conv
          )
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    fetchMessages();

  
  }, [activeConversation, isMobile, user?.id, socket]); // Dependencies for message fetching

  useEffect(() => {
    // Scroll to the bottom of the message list when messages update, unless there are pending messages
    // This prevents auto-scrolling when a pending message is added, allowing user to type
    if (messages.length > 0 && messagesEndRef.current && !Object.keys(pendingMessages).length) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, pendingMessages]); // Depend on messages and pendingMessages

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    // Create a temporary message with a unique ID for optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      content: newMessage,
      sender_id: user.id,
      receiver_id: activeConversation.other_user.id,
      conversation_id: activeConversation.id,
      created_at: new Date().toISOString(),
      read: false,
      isPending: true // Custom flag for pending state
    };

    // Add to pending messages tracker
    setPendingMessages(prev => ({ ...prev, [tempId]: tempMessage }));
    
    // Update UI immediately with the temporary message
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage(''); // Clear input field
    setShowAllUsers(false);

    try {
      const response = await sendMessage(activeConversation.id, newMessage);
      const sentMessage = response.data.message;

      // Clear typing timeout if message was sent while typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Emit stop typing if currently typing
      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', {
          conversationId: activeConversation.id,
          userId: String(user.id),
          isTyping: false,
        });
      }

      // Replace the temporary message with the actual sent message
      setPendingMessages(prev => {
        const { [tempId]: _, ...rest } = prev; // Remove from pending
        return rest;
      });
      
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? sentMessage : msg)
      );

      // Update conversations list with the last message
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === activeConversation.id);

        if (index !== -1) {
          const conversation = { ...updated[index], last_message: sentMessage };
          updated.splice(index, 1);
          updated.unshift(conversation);
        }

        return updated;
      });

      // Emit message via socket
      if (socket) {
        socket.emit('send_message', {
          receiverId: activeConversation.other_user.id,
          message: sentMessage
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Mark as failed
      setPendingMessages(prev => {
        const { [tempId]: _, ...rest } = prev;
        return rest;
      });
      setFailedMessages(prev => ({ ...prev, [tempId]: tempMessage })); // Add to failed messages
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, isPending: false, hasError: true } // Update status flags for UI
            : msg
        )
      );
    }
  };

  const handleRetryMessage = async (tempId) => {
    const failedMsg = failedMessages[tempId];
    if (!failedMsg) return;

    try {
      // Move from failed back to pending state for UI feedback
      setFailedMessages(prev => {
        const { [tempId]: _, ...rest } = prev;
        return rest;
      });
      setPendingMessages(prev => ({ ...prev, [tempId]: failedMsg }));
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, isPending: true, hasError: false } 
            : msg
        )
      );

      // Retry sending the message
      const response = await sendMessage(activeConversation.id, failedMsg.content);
      const sentMessage = response.data.message;

      // Replace pending message with successful message
      setPendingMessages(prev => {
        const { [tempId]: _, ...rest } = prev;
        return rest;
      });
      
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? sentMessage : msg)
      );

      // Update conversations list
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === activeConversation.id);

        if (index !== -1) {
          const conversation = { ...updated[index], last_message: sentMessage };
          updated.splice(index, 1);
          updated.unshift(conversation);
        }

        return updated;
      });

      // Emit message via socket
      if (socket) {
        socket.emit('send_message', {
          receiverId: activeConversation.other_user.id,
          message: sentMessage
        });
      }
    } catch (error) {
      console.error('Error retrying message:', error);
      // If retry fails, mark as failed again
      setPendingMessages(prev => {
        const { [tempId]: _, ...rest } = prev;
        return rest;
      });
      setFailedMessages(prev => ({ ...prev, [tempId]: failedMsg }));
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, isPending: false, hasError: true } 
            : msg
        )
      );
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackToConversations = () => {
    setShowConversations(true);
  };

  const renderUsersList = () => {
    if (usersLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }
  
    return (
      <List sx={{ overflow: 'auto', flex: 1, bgcolor: '#edf2f7', pl: isMobile ? 0 : 2,}}> {/* Background for All Users list */}
        {allUsers.length === 0 ? (
          <ListItem>
            <ListItemText primary="No users found" />
          </ListItem>
        ) : (
          allUsers
            .filter(u => u.id !== user?.id) // Filter out current user
            .map((userItem) => {
              const existingConv = conversations.find(c => 
                c.other_user?.id === userItem.id
              );
  
              return (
                <React.Fragment key={userItem.id}>
                  <ListItem
                    button
                    onClick={async () => {
                      setStartingConversation(true);
                      try {
                        if (existingConv) {
                          setActiveConversation(existingConv);
                          setShowConversations(false);
                        } else {
                          const response = await startConversation(
                            userItem.id, 
                            `Hi ${userItem.display_name}, \nI'd like to connect with you!`
                          );
                          const newConv = response.data.conversation;
                          setConversations(prev => [newConv, ...prev]); // Add new conversation
                          setActiveConversation(newConv);
                          setShowConversations(false);
                        }
                      } catch (error) {
                        console.error('Error starting conversation:', error);
                      } finally {
                        setStartingConversation(false);
                      }
                    }}
                    disabled={startingConversation}
                    sx={{
                      '&:hover': { backgroundColor: '#e2e8f0' }, // Hover effect
                      '&.Mui-selected': { backgroundColor: '#cbd5e0' } // Selected state
                    }}
                  >
                    {startingConversation && existingConv?.other_user?.id === userItem.id ? (
                      <CircularProgress size={24} sx={{ mr: 2 }} />
                    ) : (
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          color="success"
                          invisible={!onlineUsers.has(userItem.id)}
                        >
                          <Avatar 
                            src={userItem.photo_url}
                            sx={{ bgcolor: '#3f51b5', width: 40, height: 40 }}
                          >
                            {userItem.display_name?.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 500 }}>
                            {userItem.display_name}
                          </Typography>
                          {onlineUsers.has(userItem.id) && (
                            <UserStatusBadge>Online</UserStatusBadge>
                          )}
                        </Box>
                      }
                      secondary={
                        existingConv ? (
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                            noWrap
                            sx={{
                              display: 'inline-block',
                              maxWidth: '180px',
                              fontWeight: existingConv.unread_count > 0 ? 600 : 400
                            }}
                          >
                            {existingConv.last_message
                              ? existingConv.last_message.content
                              : "Existing conversation"}
                          </Typography>
                        ) : (
                          "Click to start conversation"
                        )
                      }
                    />
                    {existingConv && existingConv.last_message && (
                      <Typography variant="caption" color="textSecondary">
                        {formatMessageTime(existingConv.last_message.created_at)}
                      </Typography>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })
        )}
      </List>
    );
  };

  if (authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        bgcolor: 'background.default'
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <ChatContainer sx={{ width: '100%' }}>
      <Grid container sx={{ height: '100%', width: '100%' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <ConversationList
            elevation={0}
            showConversations={showConversations}
            showAllUsers={showAllUsers}
          >
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e5e7eb',
            bgcolor: 'background.paper'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              ml: isMobile ? 0 : 6, 
            }}>
                {isMobile && !showConversations && (
                  <IconButton
                    
                    onClick={handleBackToConversations}
                    sx={{ 
                      paddingLeft: 0,  
                      marginRight: 2, 
                      position: 'relative', 
                      zIndex: 1, 
                    }}
                  >
                    <ArrowBackIcon    />
                  </IconButton>
                )}
                <Typography variant="h6" sx={{ ml:4,flexGrow: 1, fontWeight: 600 }}>
                  Messages
                </Typography>
              </Box>
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
                  sx: {
                    borderRadius: '12px',
                    bgcolor: '#f3f4f6' // Light grey background for search input
                  }
                }}
                size="small"
                sx={{ mb: 2 }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1 
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  px: 1,
                  py: 0.5,
                  borderRadius: '6px',
                  // Different background for active mode
                  bgcolor: showAllUsers ? 'rgba(63, 81, 181, 0.1)' : 'rgba(63, 81, 181, 0.08)'
                }}>
                  {showAllUsers ? 'All Users' : 'Conversations'}
                </Typography>
                <Typography 
                  variant="outlined" 
                  size="small"
                 
                  onClick={() => {
                    setShowAllUsers(!showAllUsers);
                    console.log("setShowAllUsers:::", showAllUsers)
                    showAllUsers?setTextToggel("All Users"):setTextToggel("Conversations");
                    console.log("text:::", textToggel)
                    if (!showAllUsers && allUsers.length === 0) {
                      fetchAllUsers(); // Fetch all users only when switching to that view
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '12px',
                    px: 3,
                    py: 0.4,
                     bgcolor:'rgba(53, 84, 150, 0.1)',
                  
                    color: 'rgb(27, 57, 107)',
                    border:'1px solid rgb(41, 91, 190)',
                    '&:hover': {
                      borderColor: '#3f51b5',
                      color: '#3f51b5'
                    }
                  }}
                >
                  {(textToggel ? textToggel : textToggel)}
                  
                </Typography>
              </Box>
            </Box>
                               
            {showAllUsers ? renderUsersList() : ( 
              <List sx={{ overflow: 'auto', flex: 1, bgcolor: 'background.paper' }}> {/* Background for Conversations list */}
                {loading.conversations && conversations.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
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
                        onClick={() => {
                          setActiveConversation(conversation);
                          if (isMobile) setShowConversations(false); // Hide list on mobile when selected
                        }}
                        sx={{
                          '&:hover': { bgcolor: '#f3f4f6' }, // Hover effect
                          '&.Mui-selected': {
                            bgcolor: '#e5e7eb', // Selected background
                            '&:hover': { bgcolor: '#e5e7eb' }
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            badgeContent={conversation.unread_count}
                            invisible={!conversation.unread_count}
                          >
                            <Avatar 
                              src={conversation.other_user?.photo_url}
                              sx={{ 
                                bgcolor: '#3f51b5', 
                                width: isMobile?40:20, 
                                height: isMobile?40:20,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {conversation.other_user?.display_name?.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ fontWeight: 500 }}>
                                {conversation.other_user?.display_name}
                              </Typography>
                              {onlineUsers.has(conversation.other_user?.id) && (
                                <UserStatusBadge>Online</UserStatusBadge>
                              )}
                            </Box>
                          }
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
                                  fontWeight: conversation.unread_count > 0 ? 600 : 400
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
            )}
          </ConversationList>
        </Grid>

        {/* Message Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%', flexGrow: 2 }}>
          <MessageArea
            elevation={0}
            showConversations={showConversations}
          >
            {isMobile && !showConversations && (
              <BackButton onClick={handleBackToConversations}>
                <ArrowBackIcon />
              </BackButton>
            )}
            
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <Box sx={{
                  p: 2,
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)' // Shadow for header
                }}>
                  {isMobile && (
                    <IconButton
                      edge="start" 
                      onClick={handleBackToConversations}
                      sx={{ ml: 4 ,mr:2 ,Weight:'bold', color:'rgb(16, 63, 70)'}}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Avatar
                    src={activeConversation.other_user?.photo_url}
                    sx={{ 
                      mr: 2, 
                      width: 40, 
                      height: 40,
                      bgcolor: '#3f51b5',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {activeConversation.other_user?.display_name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {activeConversation.other_user?.display_name}
                      {onlineUsers.has(activeConversation.other_user?.id) && (
                        <UserStatusBadge sx={{ ml: 1 }}>Online</UserStatusBadge>
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {activeConversation.other_user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
                    </Typography>
                  </Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Messages */}
                <MessageList ref={messageListRef}>
                  {loading.messages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      p: 3
                    }}>
                      <Typography variant="body1" color="textSecondary" gutterBottom>
                        No messages yet
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Start the conversation by sending a message
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message) => {
                      if (!message.sender_id || !user?.id) return null;
                      const isOwn = message.sender_id === user?.id;
                      const isPending = message.isPending; // Check if message is pending
                      const hasError = message.hasError; // Check if message failed

                      return (
                        <MessageItem key={message.id} isOwn={isOwn}>
                          {!isOwn && (
                            <Avatar
                              src={activeConversation.other_user?.photo_url}
                              sx={{ 
                                mr: 1, 
                                width: 32, 
                                height: 32,
                                bgcolor: '#3f51b5',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            >
                              {activeConversation.other_user?.display_name?.charAt(0)}
                            </Avatar>
                          )}
                          <Box sx={{ maxWidth: 'calc(100% - 48px)' }}>
                            <MessageBubble 
                              isOwn={isOwn} 
                              isPending={isPending}
                              hasError={hasError}
                            >
                              <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
                                {message.content}
                              </Typography>
                            </MessageBubble>
                            <MessageTime variant="caption" isOwn={isOwn}>
                              {formatMessageTime(message.created_at)}
                              {isOwn && !isPending && !hasError && ( // Show status icons only if not pending or failed
                                <MessageStatusIcon read={message.read} isOwn={isOwn}>
                                  {message.read ? <DoneAllIcon /> : <DoneIcon />}
                                </MessageStatusIcon>
                              )}
                              {hasError && ( // Show retry icon for failed messages
                                <Tooltip title="Failed to send. Click to retry">
                                  <IconButton
                                    size="small"
                                    sx={{ 
                                      ml: 0.5,
                                      color: isOwn ? 'rgba(255,255,255,0.7)' : '#6b7280',
                                      p: 0.5
                                    }}
                                    onClick={() => handleRetryMessage(message.id)}
                                  >
                                    <RefreshIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {isPending && ( // Show loading spinner for pending messages
                                <CircularProgress 
                                  size={12} 
                                  thickness={4}
                                  sx={{ 
                                    ml: 0.5,
                                    color: isOwn ? 'rgba(255,255,255,0.7)' : '#6b7280',
                                  }} 
                                />
                              )}
                            </MessageTime>
                          </Box>
                        </MessageItem>
                      );
                    })
                  )}
                  
                  
                  {otherUserTyping && ( // Display typing indicator
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: "#3f51b5", // Distinct color for typing indicator
                        pb: 2,
                        pl: 1,
                        display: 'block'
                      }}
                    >
                      {activeConversation.other_user?.display_name} is typing...
                    </Typography>
                  )}
                      <div ref={messagesEndRef} />

                </MessageList>

                {/* Message Input */}
                <MessageInput component="form" onSubmit={handleSendMessage}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 20, // Rounded input field
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  <IconButton
                    color="primary"
                    type="submit"
                    disabled={!newMessage.trim()}
                    sx={{ 
                      ml: 1,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '&:disabled': {
                        backgroundColor: 'action.disabledBackground',
                        color: 'action.disabled'
                      }
                    }}
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
                p: 3,
                textAlign: 'center'
              }}>
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="textSecondary">
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

