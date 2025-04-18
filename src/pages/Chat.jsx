import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  TextField, 
  IconButton, 
  Divider, 
  Badge, 
  Grid,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';
// import { 
//   getConversations, 
//   getMessages, 
//   sendMessage, 
//   markAsRead 
// } from '../services/chatService';
import { initializeSocket, disconnectSocket } from '../services/socketService';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 56px)',
  backgroundColor: theme.palette.background.default,
}));

const ConversationsList = styled(Paper)(({ theme }) => ({
  width: 320,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
}));

const MessageArea = styled(Paper)(({ theme }) => ({
  flex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
}));

const MessageList = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: 16,
  marginBottom: theme.spacing(1),
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[200],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
}));

const MessageTime = styled(Typography)(({ theme, isOwn }) => ({
  fontSize: '0.7rem',
  color: isOwn ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
  marginTop: 4,
  textAlign: isOwn ? 'right' : 'left',
}));

const MessageInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const Chat = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  // تحميل المحادثات
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

  // إعداد Socket.io للرسائل في الوقت الفعلي
  useEffect(() => {
    if (user) {
      socket.current = initializeSocket(user.id);
      
      socket.current.on('new_message', (message) => {
        if (message.conversation_id === activeConversation?.id) {
          setMessages(prev => [...prev, message]);
          markAsRead(message.id);
        } else {
          // تحديث عدد الرسائل غير المقروءة للمحادثة
          setConversations(prev => 
            prev.map(conv => 
              conv.id === message.conversation_id 
                ? { ...conv, unread_count: (conv.unread_count || 0) + 1 }
                : conv
            )
          );
        }
      });
      
      socket.current.on('message_read', (messageId) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      });
      
      return () => {
        disconnectSocket(socket.current);
      };
    }
  }, [user, activeConversation]);

  // تحميل المحادثة النشطة
  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversationId, conversations, activeConversation]);

  // تحميل الرسائل للمحادثة النشطة
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        try {
          setLoading(true);
          const response = await getMessages(activeConversation.id);
          setMessages(response.data.messages);
          
          // تحديث عدد الرسائل غير المقروءة
          if (activeConversation.unread_count > 0) {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === activeConversation.id 
                  ? { ...conv, unread_count: 0 }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [activeConversation]);

  // التمرير إلى آخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    try {
      await sendMessage(activeConversation.id, messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
  };

  const filteredConversations = conversations.filter(conversation => 
    conversation.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatContainer>
      <ConversationsList elevation={1}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">المحادثات</Typography>
          <SearchInput
            placeholder="بحث..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>
        
        <List sx={{ overflow: 'auto', flex: 1 }}>
          {loading && conversations.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredConversations.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                لا توجد محادثات
              </Typography>
            </Box>
          ) : (
            filteredConversations.map((conversation) => (
              <React.Fragment key={conversation.id}>
                <ListItem 
                  button 
                  selected={activeConversation?.id === conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={conversation.unread_count}
                      invisible={!conversation.unread_count}
                    >
                      <Avatar src={conversation.other_user.photo_url} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={conversation.other_user.name}
                    secondary={
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        noWrap
                        sx={{ maxWidth: 180 }}
                      >
                        {conversation.last_message?.content || 'لا توجد رسائل'}
                      </Typography>
                    }
                  />
                  <Typography variant="caption" color="textSecondary">
                    {conversation.last_message?.created_at && 
                      format(new Date(conversation.last_message.created_at), 'HH:mm', { locale: ar })}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </ConversationsList>
      
      <MessageArea elevation={0}>
        {activeConversation ? (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
              <Avatar src={activeConversation.other_user.photo_url} sx={{ mr: 1 }} />
              <Box>
                <Typography variant="subtitle1">{activeConversation.other_user.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {activeConversation.other_user.role === 'employer' ? 'صاحب عمل' : 'باحث عن عمل'}
                </Typography>
              </Box>
            </Box>
            
            <MessageList>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body2" color="textSecondary">
                    ابدأ المحادثة بإرسال رسالة
                  </Typography>
                </Box>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === user.id;
                  return (
                    <MessageBubble key={message.id} isOwn={isOwn}>
                      <Typography variant="body1">{message.content}</Typography>
                      <MessageTime isOwn={isOwn}>
                        {format(new Date(message.created_at), 'HH:mm', { locale: ar })}
                        {isOwn && (
                          <span style={{ marginRight: 4 }}>
                            {message.read ? ' ✓✓' : ' ✓'}
                          </span>
                        )}
                      </MessageTime>
                    </MessageBubble>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </MessageList>
            
            <MessageInput>
              <IconButton>
                <AttachFileIcon />
              </IconButton>
              <TextField
                fullWidth
                placeholder="اكتب رسالة..."
                variant="outlined"
                size="small"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
              />
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <SendIcon />
              </IconButton>
            </MessageInput>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="textSecondary">
              اختر محادثة للبدء
            </Typography>
          </Box>
        )}
      </MessageArea>
    </ChatContainer>
  );
};

export default Chat;
