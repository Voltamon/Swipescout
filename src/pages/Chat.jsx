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
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  // Removed ArrowBack as ArrowBackIcon from here, as it's being replaced in MessageArea
  Close as CloseIcon, // Added CloseIcon for closing the conversation list on mobile
  FormatListBulleted as FormatListBulletedIcon // New icon for showing the conversation list
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
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import SegmentIcon from '@mui/icons-material/Segment';

// Styled components for chat UI
const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 56px)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ConversationList = styled(Paper)(({ theme, isMobile, showConversations }) => ({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'flex' : 'none', // Control visibility on mobile
    position: 'absolute', // To overlay content
    width: '100%',
    zIndex: 10,
    backgroundColor: theme.palette.background.paper, // Ensure it covers content below
  },
}));

const MessageArea = styled(Paper)(({ theme, isMobile, showConversations }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'none' : 'flex', // Control visibility on mobile
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageItem = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  overflow: 'auto',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  marginBottom: theme.spacing(1),
  width: '100%',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: 16,
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[200],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  wordBreak: 'break-word',
  display: 'inline-block',
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
  const [showConversations, setShowConversations] = useState(true); // Default to showing conversations
  const messagesEndRef = useRef(null);
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const isMobile = window.innerWidth < 960;

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
    console.log("typing:::", data);
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

    // Clear existing timeout
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
          otherUserId: String(activeConversation.other_user.id),
          isTyping: true,
        });
      }

      // Set timeout to send "not typing" after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          conversationId: activeConversation?.id,
          userId: String(user.id),
          otherUserId: String(activeConversation.other_user.id),
          isTyping: false,
        });
      }, 1300);
    } else if (isTyping) {
      // Immediately stop typing if input is empty
      setIsTyping(false);
      socket.emit('typing', {
        conversationId: activeConversation?.id,
        userId: String(user.id),
        otherUserId: String(activeConversation.other_user.id),
        isTyping: false,
      });
    }
  };


  // Fetch conversations on component mount
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


  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("userid::::", user?.id);
    socket.off('typing', handleTyping);
    if (!user?.id) return;

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('register', String(user.id));
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


  // Set up socket listeners for real-time messaging
  useEffect(() => {
    if (!socket || !user?.id) return;

    // Register user with socket server
    // socket.emit('register', user.id);


    // When a user comes online
    socket.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    });

    // When a user goes offline
    socket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });


    // Listen for new messages
    const handleNewMessage = (message) => {
      // Clean up previous listeners first (this might be causing issues with multiple listeners)
      // Remove this line
      // socket.off('message_read'); // Remove this line

      console.log("msg2222222:::", message);
      if (activeConversation && message.conversation_id === activeConversation.id) {
        setMessages(prev => [...prev, message]);
        markAsRead(message.id);
        socket.emit('mark_as_read', { messageId: message.id, senderId: message.sender_id });
      }

      // Update conversation list
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === message.conversation_id);

        if (index !== -1) {
          const conversation = { ...updated[index], last_message: message };

          if (activeConversation?.id !== message.conversation_id) {
            conversation.unread_count = (conversation.unread_count || 0) + 1;
          }

          // Move to top
          updated.splice(index, 1);
          updated.unshift(conversation);
        }
socket.off('new_message'); 
        return updated;
      });
    };

    // Listen for message read confirmations
    const handleMessageRead = (messageId) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
      socket.off('typing', handleTyping); // Ensure typing is cleaned up
      socket.off('user_online');
      socket.off('user_offline');

    };
  }, [socket, user, activeConversation]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const response = await getMessages(activeConversation.id);
        setMessages(response.data.messages || []);

        // Update unread count
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

    // On mobile, if an active conversation is set, hide the conversation list
    if (isMobile && activeConversation) {
      setShowConversations(false); // Hide the conversation list
    }
  }, [activeConversation, isMobile]);

  useEffect(() => {
    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping); // Clean up
    };
  }, [socket, activeConversation]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send stop typing when component unmounts if user was typing
      if (isTyping && activeConversation) {
        socket.emit('typing', {
          conversationId: activeConversation.id,
          userId: String(user.id),
          isTyping: false,
        });
      }
    };
  }, [isTyping, activeConversation, socket, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !activeConversation) return;

    try {
      const response = await sendMessage(activeConversation.id, newMessage);
      const sentMessage = response.data.message;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        setIsTyping(false);
        socket.emit('typing', {
          conversationId: activeConversation?.id,
          userId: String(user.id),
          isTyping: false,
        });
      }
      setMessages(prev => [...prev, sentMessage]);

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

      if (socket) {
        console.log("socket send messeg::", socket.id);
        console.log("sent data:", {
          receiverId: String(activeConversation.other_user.id),
          message: sentMessage
        });
        socket.emit('send_message', {
          receiverId: activeConversation.other_user.id,
          message: sentMessage
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: enUS
    });
  };

  // Function to go back to the conversations list and clear active conversation
  const handleBackToConversations = () => {
    setActiveConversation(null); // Clear active conversation
    setShowConversations(true); // Show conversations list
    setShowAllUsers(false); // Make sure to show conversations not all users initially
  };

  // Function to handle starting a conversation or switching to existing one
  const handleConversationOrUserClick = async (userItem, existingConv) => {
    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      try {
        const response = await startConversation(
          userItem.id,
          `Hi ${userItem.display_name}, \nI'd like to connect with you!`
        );
        const newConv = response.data.conversation;
        setConversations(prev => [newConv, ...prev]);
        setActiveConversation(newConv);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    }
    // The useEffect watching activeConversation will handle setShowConversations(false) for mobile
  };


  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderUsersList = () => {
    if (usersLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <List sx={{ overflow: 'auto', flex: 1 }}>
        {allUsers.length === 0 ? (
          <ListItem>
            <ListItemText primary="No users found" />
          </ListItem>
        ) : (
          allUsers
            .filter(u => u.id !== user?.id) // Exclude current user
            .map((userItem) => {
              // Check if there's an existing conversation
              const existingConv = conversations.find(c =>
                c.other_user.id === userItem.id
              );

              return (
                <React.Fragment key={userItem.id}>
                  <ListItem
                    button
                    onClick={() => handleConversationOrUserClick(userItem, existingConv)}
                  >
                      
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        color="success"
                        invisible={!onlineUsers.has(userItem.id)}
                      >
                        <Avatar src={userItem.photo_url}>
                          {userItem.display_name?.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          {userItem.display_name}
                          {onlineUsers.has(userItem.id) && (
                            <span style={{ color: 'green', fontSize: '0.75rem', marginLeft: '5px' }}>
                              ● Online
                            </span>
                          )}
                        </>
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
                              fontWeight: existingConv.unread_count > 0 ? 'bold' : 'normal'
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

  return (
    <ChatContainer sx={{ width: '100%' }}>
      <Grid container sx={{ height: '100%', width: '100%' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <ConversationList
            elevation={0}
            isMobile={isMobile}
            showConversations={showConversations}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Messages
                </Typography>
                {/* 'X' Close icon for conversation list on mobile when a conversation is active */}
                {isMobile && activeConversation && (
                  <IconButton
                    edge="end"
                    onClick={() => setShowConversations(false)} // Hide the conversation list
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
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
                }}
                size="small"
              />

              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography gutterBottom sx={{
                    fontWeight: 'bold',
                    background: 'rgba(178, 209, 224, 0.73)',
                    borderBottom: '2px solid #ccc',
                    borderColor: 'primary.main',
                    px: 2,
                    pt: 1,
                    display: 'inline-block',
                    color: 'primary.main',
                    pb: 0.5,
                  }}>
                    {showAllUsers ? 'All Users' : 'Conversations'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      let newval = !showAllUsers;
                      setShowAllUsers(newval);
                      if (!showAllUsers && allUsers.length === 0) {
                        fetchAllUsers();
                      }
                    }}
                  >
                    {showAllUsers ? 'Conversations' : 'All Users'}
                  </Button>
                </Box>
              </Box>
            </Box>

            {showAllUsers ? renderUsersList() : (

              <List sx={{ overflow: 'auto', flex: 1 }}>
                {loading.conversations && conversations.length === 0 ? (
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
                        onClick={() => handleConversationOrUserClick(null, conversation)} // Pass conversation directly
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            badgeContent={conversation.unread_count}
                            invisible={!conversation.unread_count}
                          >
                            <Avatar src={conversation.other_user.photo_url}>
                              {conversation.other_user.display_name?.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        <ListItemText
                          primary={<>{conversation.other_user.display_name}  {onlineUsers.has(conversation.other_user.id) && (
                            <span style={{ color: 'green', fontSize: '0.75rem', marginLeft: '5px' }}>
                              ● Online
                            </span>
                          )}</>}
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
            )}
          </ConversationList>

        </Grid>

        {/* Message Area */}
        <Grid item xs={12} md={8} sx={{ height: '100%', flexGrow: 2 }}>
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
                  width: '80%', // Consider adjusting this if it causes layout issues
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {isMobile && (
                    <IconButton
                      edge="start"
                      onClick={handleBackToConversations} // This will show the conversation list
                      sx={{ ml: 3,mt:3 }}
                    >
                      <SegmentIcon />
                    </IconButton>
                  )}
                  <Avatar
                    src={activeConversation.other_user.photo_url}
                    sx={{ mr: 2 }}
                  >
                    {activeConversation.other_user.display_name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1, width: '100%', }}>
                    <Typography variant="h6">
                      {activeConversation.other_user.display_name}

                    </Typography>
                     {/* New icon for showing the conversation list on mobile */}
                 
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
                  {loading.messages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, width: '100%', }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%', width: '100%',
                    }}>
                      <Typography variant="body1" color="textSecondary">
                        No messages yet
                      </Typography>
                      <Typography variant="body2" color="textSecondary" align="center">
                        Start the conversation by sending a message
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message) => {
                      if (!message.sender_id || !user?.id) return null; // Added null return for safety
                      const isOwn = message.sender_id === user?.id;
                      return (
                        <MessageItem key={message.id} isOwn={isOwn} sx={{ width: '100%' }}>
                          {!isOwn && (
                            <Avatar
                              src={activeConversation.other_user.photo_url}
                              sx={{ mr: 1, width: 36, height: 36 }}
                            >
                              {activeConversation.other_user.display_name?.charAt(0)}
                            </Avatar>
                          )}
                          <Box >
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

                  {otherUserTyping && (
                    <Typography variant="caption" color="textSecondary" sx={{ color: "rgb(51, 159, 221)", pb: 2 }}>
                      {activeConversation.other_user.display_name} is typing...
                    </Typography>
                  )}
                </MessageList>

                {/* Message Input */}
                <MessageInput component="form" onSubmit={handleSendMessage} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleChange}
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
                height: '100%', width: '100%',
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