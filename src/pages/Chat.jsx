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
  ArrowBack as ArrowBackIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon
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
import { formatDistanceToNow, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Styled components for chat UI
const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    height: 'calc(100vh - 56px)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ConversationList = styled(Paper)(({ theme, isMobile, showConversations, showAllUsers }) => ({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: showAllUsers ? theme.palette.background.default : theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'flex' : 'none',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    height: 'calc(100vh - 56px)',
  },
}));

const MessageArea = styled(Paper)(({ theme, isMobile, showConversations }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    display: showConversations ? 'none' : 'flex',
    height: 'calc(100vh - 56px)',
  },
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: '3px',
  },
}));

const MessageItem = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  overflow: 'auto',
  flexDirection: isOwn ? 'row-reverse' : 'row',
  marginBottom: theme.spacing(2),
  width: '100%',
  alignItems: 'flex-end',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: isOwn ? '18px 18px 0 18px' : '18px 18px 18px 0',
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.secondary.main,
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
  wordBreak: 'break-word',
  display: 'inline-block',
  boxShadow: theme.shadows[1],
  marginLeft: isOwn ? 'auto' : theme.spacing(1),
  marginRight: isOwn ? theme.spacing(1) : 'auto',
}));

const MessageTime = styled(Typography)(({ theme, isOwn }) => ({
  fontSize: '0.70rem',
  color: isOwn ? theme.palette.text.secondary : theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: isOwn ? 'right' : 'left',
  paddingLeft: isOwn ? 0 : theme.spacing(1),
  paddingRight: isOwn ? theme.spacing(1) : 0,
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  alignItems: 'center',
}));

const UserStatusBadge = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
  fontSize: '0.75rem',
  marginLeft: theme.spacing(0.5),
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 'bold',
}));

const MessageStatusIcon = styled(Box)(({ theme, read }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '0.85rem',
    color: read ? theme.palette.info.main : theme.palette.text.disabled,
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
  const messageListRef = useRef(null);
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
  }, [user?.id]); // Added user.id as dependency

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

  useEffect(() => {
    if (!socket || !user?.id) return;

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
      if (activeConversation && message.conversation_id === activeConversation.id) {
        setMessages(prev => [...prev, message]);
        markAsRead(message.id);
        socket.emit('mark_as_read', { messageId: message.id, senderId: message.sender_id });
      }

      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === message.conversation_id);

        if (index !== -1) {
          const conversation = { ...updated[index], last_message: message };

          if (activeConversation?.id !== message.conversation_id) {
            conversation.unread_count = (conversation.unread_count || 0) + 1;
          } else {
            conversation.unread_count = 0;
          }

          updated.splice(index, 1);
          updated.unshift(conversation);
        }
        return updated;
      });
    };

    const handleMessageRead = (messageId) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
      socket.off('typing', handleTyping);
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket, user, activeConversation]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        setLoading(prev => ({ ...prev, messages: true }));
        const response = await getMessages(activeConversation.id);
        const fetchedMessages = response.data.messages || [];
        setMessages(fetchedMessages);

        const unreadMessagesInActiveConv = fetchedMessages.filter(
          (msg) => msg.receiver_id === user?.id && !msg.read
        );
        if (unreadMessagesInActiveConv.length > 0) {
          unreadMessagesInActiveConv.forEach(async (msg) => {
            await markAsRead(msg.id);
            socket.emit('mark_as_read', { messageId: msg.id, senderId: msg.sender_id });
          });
        }

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

    if (isMobile) {
      setShowConversations(false);
    }
  }, [activeConversation, isMobile, user?.id, socket]);

  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
          conversationId: activeConversation.id,
          userId: String(user.id),
          otherUserId: String(activeConversation.other_user.id),
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
    conversation.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return format(date, 'p', { locale: enUS });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d', { locale: enUS });
    }
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
  };

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
            .filter(u => u.id !== user?.id)
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
                          setConversations(prev => [newConv, ...prev]);
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
                          <Avatar src={userItem.photo_url}>
                            {userItem.display_name?.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={
                        <>
                          {userItem.display_name}
                          {onlineUsers.has(userItem.id) && (
                            <UserStatusBadge>● Online</UserStatusBadge>
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
                              fontStyle: existingConv.unread_count > 0 ? 'bold' : 'normal'
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
            isMobile={isMobile}
            showConversations={showConversations}
            showAllUsers={showAllUsers}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {isMobile && !showConversations && (
                  <IconButton
                    edge="start"
                    onClick={handleBackToConversations}
                    sx={{ mr: 1, ml: -1 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
                }}
                size="small"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold',
                  color: 'primary.main',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: showAllUsers ? 'rgba(0, 123, 255, 0.1)' : 'rgba(25, 118, 210, 0.08)'
                }}>
                  {showAllUsers ? 'All Users' : 'Conversations'}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => {
                    setShowAllUsers(!showAllUsers);
                    if (!showAllUsers && allUsers.length === 0) {
                      fetchAllUsers();
                    }
                  }}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5
                  }}
                >
                  {showAllUsers ? 'Show Conversations' : 'Show All Users'}
                </Button>
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
                        onClick={() => {
                          setActiveConversation(conversation);
                          if (isMobile) setShowConversations(false);
                        }}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            color="primary"
                            badgeContent={conversation.unread_count}
                            invisible={!conversation.unread_count}
                          >
                            <Avatar src={conversation.other_user?.photo_url}>
                              {conversation.other_user?.display_name?.charAt(0)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <>
                              {conversation.other_user?.display_name}
                              {onlineUsers.has(conversation.other_user?.id) && (
                                <UserStatusBadge>● Online</UserStatusBadge>
                              )}
                            </>
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
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
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
                    src={activeConversation.other_user?.photo_url}
                    sx={{ mr: 2, width: 40, height: 40 }}
                  >
                    {activeConversation.other_user?.display_name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {activeConversation.other_user?.display_name}
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
                      return (
                        <MessageItem key={message.id} isOwn={isOwn}>
                          {!isOwn && (
                            <Avatar
                              src={activeConversation.other_user?.photo_url}
                              sx={{ mr: 1, width: 32, height: 32 }}
                            >
                              {activeConversation.other_user?.display_name?.charAt(0)}
                            </Avatar>
                          )}
                          <Box sx={{ maxWidth: 'calc(100% - 48px)' }}>
                            <MessageBubble isOwn={isOwn}>
                              <Typography variant="body1">
                                {message.content}
                              </Typography>
                            </MessageBubble>
                            <MessageTime variant="caption" isOwn={isOwn}>
                              {formatMessageTime(message.created_at)}
                              {isOwn && (
                                <MessageStatusIcon read={message.read}>
                                  {message.read ? <DoneAllIcon /> : <DoneIcon />}
                                </MessageStatusIcon>
                              )}
                            </MessageTime>
                          </Box>
                        </MessageItem>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                  
                  {otherUserTyping && (
                    <Typography 
                      variant="caption" 
                      color="textSecondary" 
                      sx={{
                        color: "rgb(51, 159, 221)",
                        pb: 2,
                        pl: 1,
                        display: 'block'
                      }}
                    >
                      {activeConversation.other_user?.display_name} is typing...
                    </Typography>
                  )}
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
                        borderRadius: 20,
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