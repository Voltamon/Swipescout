// src/pages/Chat.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    CircularProgress,
    Stack,
    useMediaQuery, // For responsive design if needed
    useTheme, // For responsive design if needed
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Correct import for styled
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check'; // For single check (sent)
import DoneAllIcon from '@mui/icons-material/DoneAll'; // For double check (read)
import { format } from 'date-fns';
import { ar } from 'date-fns/locale'; // Arabic locale for date formatting
import { useAuth } from '../hooks/useAuth'; // Assuming you have an auth hook that provides user info
import {
    getConversations,
    getMessages,
} from '../services/chatService'; // HTTP services for initial data fetching
import { initializeSocket, getSocket, disconnectSocket } from '../services/socketService'; // Socket.io services

// --- Styled Components ---

// ChatContainer: Main layout for the chat interface
const ChatContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isMobile', // Prevent `isMobile` from being passed to DOM
})(({ theme }) => ({
    display: 'flex',
    height: 'calc(100vh - 64px)', // Adjust height based on your app's header/footer
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column', // Stack columns on smaller screens
        height: 'calc(100vh - 56px)', // Adjust for mobile header if different
    },
}));

// ConversationsList: Container for the list of chat conversations
const ConversationsList = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isMobile', // Prevent `isMobile` from being passed to DOM
})(({ theme }) => ({
    width: 320,
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        width: '100%', // Take full width on mobile
        height: 'auto', // Height adjusts to content
        maxHeight: '40%', // Limit height to avoid taking up too much screen
        borderRight: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

// MessageArea: Container for the active chat messages and input
const MessageArea = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isMobile', // Prevent `isMobile` from being passed to DOM
})(({ theme }) => ({
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
}));

// MessageList: Scrollable area for displaying individual messages
const MessageList = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
}));

// MessageBubble: Styling for individual chat bubbles (sent or received)
// `shouldForwardProp` prevents `isOwn` from being passed to the DOM element,
// resolving the React warning.
const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isOwn', // Prevent `isOwn` from being passed to DOM
})(({ theme, isOwn }) => ({
    maxWidth: '70%',
    padding: theme.spacing(1.5),
    borderRadius: 16,
    marginBottom: theme.spacing(1),
    backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[200],
    color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
    alignSelf: isOwn ? 'flex-end' : 'flex-start',
    wordBreak: 'break-word',
}));

// MessageTime: Timestamp for each message
const MessageTime = styled(Typography)(({ theme, isOwn }) => ({
    fontSize: '0.7rem',
    color: isOwn ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
    marginTop: 4,
    textAlign: isOwn ? 'right' : 'left',
}));

// MessageInput: Container for the message input field and send button
const MessageInput = styled(Box)(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    alignItems: 'center',
}));

// SearchInput: Styling for the conversation search field
const SearchInput = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
        borderRadius: 20,
        paddingLeft: theme.spacing(1),
    },
}));

// Main Chat Component
const Chat = () => {
    const { user } = useAuth(); // Get current user from auth hook
    const { partnerId: urlPartnerId } = useParams(); // Get partnerId from URL for direct chat links
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if on mobile breakpoint

    // State variables for conversations, messages, active chat partner, etc.
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

    // New states for real-time features
    const [isTyping, setIsTyping] = useState(false); // Tracks if the partner is typing
    const [partnerOnlineStatus, setPartnerOnlineStatus] = useState('offline'); // Tracks partner's online status

    // Ref to debounce typing events
    const typingTimeoutRef = useRef(null);

    // Effect for Socket.io initialization and event listeners
    useEffect(() => {
        if (user?.id) {
            const currentSocket = initializeSocket(user.id); // Initialize socket connection

            // Listener for new incoming messages
            currentSocket.on('new_message', (newMessage) => {
                console.log('Received new message:', newMessage);
                setMessages(prevMessages => {
                    // Only add the message to the active conversation's message list
                    if (newMessage.sender_id === activePartner?.id || newMessage.receiver_id === activePartner?.id) {
                        // If the message is for the current active conversation AND it's for me
                        // AND it hasn't been read yet, mark it as read immediately.
                        if (newMessage.receiver_id === user.id && !newMessage.read_at) {
                            currentSocket.emit('mark_as_read', { message_id: newMessage.id, user_id: user.id });
                            // Optimistically update the message as read in the UI
                            return [...prevMessages, { ...newMessage, read_at: new Date() }];
                        }
                        return [...prevMessages, newMessage];
                    }
                    return prevMessages; // If not for active conversation, don't add to current messages
                });

                // Update the conversation list with the latest message and unread count
                setConversations(prevConversations => {
                    let conversationFound = false;
                    const updatedConversations = prevConversations.map(conv => {
                        const otherUserId = conv.partner?.id; // The ID of the other person in this conversation

                        // Check if the new message belongs to this conversation
                        if ((newMessage.sender_id === user.id && newMessage.receiver_id === otherUserId) ||
                            (newMessage.receiver_id === user.id && newMessage.sender_id === otherUserId)) {
                            conversationFound = true;
                            return {
                                ...conv,
                                message: newMessage.message, // Update last message content
                                sent_at: newMessage.sent_at, // Update last message timestamp
                                read_at: newMessage.read_at, // Update read status of last message
                                // Increment unread count only if the message is for the current user
                                // AND the conversation is NOT currently active AND the message is unread
                                unread_count: (otherUserId !== activePartner?.id && newMessage.receiver_id === user.id && !newMessage.read_at)
                                    ? (conv.unread_count || 0) + 1
                                    : conv.unread_count, // Otherwise, keep the existing unread count
                            };
                        }
                        return conv;
                    });

                    // If the new message is for a conversation that wasn't in the list (e.g., first message ever)
                    if (!conversationFound) {
                        // In a real application, you'd fetch the details of the new partner here
                        // to create a proper conversation object. For simplicity, we'll refetch all conversations.
                        console.log("New conversation detected, refetching conversations...");
                        fetchConversations(); // Trigger a full refetch to include the new conversation
                    }

                    // Sort conversations to bring the most recent one to the top
                    return updatedConversations.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
                });
            });

            // Listener for message read confirmations (e.g., sender sees double checkmark)
            currentSocket.on('message_read', ({ message_id }) => {
                console.log('Message marked as read by receiver:', message_id);
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        // Update the specific message to show it's been read
                        msg.id === message_id ? { ...msg, read_at: new Date() } : msg
                    )
                );
            });

            // Listener for unread messages sent by the backend upon user registration/login
            currentSocket.on('unread_messages', (unreadMsgs) => {
                console.log('Received unread messages on registration:', unreadMsgs);
                // This event can be used to update badge counts on conversations that have new unread messages
                // without requiring a full conversation list refresh.
                setConversations(prevConversations => {
                    const updatedConversations = [...prevConversations];
                    unreadMsgs.forEach(unreadMsg => {
                        const partnerId = unreadMsg.sender_id; // The sender of the unread message is the partner
                        const convIndex = updatedConversations.findIndex(conv => conv.partner?.id === partnerId);

                        if (convIndex !== -1) {
                            // If conversation exists, increment its unread count
                            if (updatedConversations[convIndex].partner?.id !== activePartner?.id) {
                                updatedConversations[convIndex].unread_count = (updatedConversations[convIndex].unread_count || 0) + 1;
                            }
                        } else {
                            // If conversation doesn't exist, you'd ideally create a new one here
                            // or trigger a fetch of conversations to get the full context.
                            console.warn(`Unread message from unknown partner ${partnerId}. Consider refetching conversations.`);
                            fetchConversations(); // Fallback to refetching
                        }
                    });
                    return updatedConversations.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
                });
            });

            // Listener for confirmation that a message was successfully sent and saved by the server
            currentSocket.on('message_sent', (sentMessage) => {
                console.log('Message sent confirmation from server:', sentMessage);
                // If you optimistically added a temporary message, you can replace it with the real one here.
                // For now, `new_message` handles adding the final message.
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id.startsWith('temp-') && msg.message === sentMessage.message && msg.receiver_id === sentMessage.receiver_id
                            ? { ...sentMessage, read_at: null } // Replace temp with real, ensure read_at is null initially
                            : msg
                    )
                );
            });

            // Listener for typing events from the partner
            currentSocket.on('typing_event', ({ senderId, receiverId }) => {
                if (activePartner?.id === senderId && user?.id === receiverId) {
                    setIsTyping(true);
                }
            });

            // Listener for stop typing events from the partner
            currentSocket.on('stop_typing_event', ({ senderId, receiverId }) => {
                if (activePartner?.id === senderId && user?.id === receiverId) {
                    setIsTyping(false);
                }
            });

            // Listener for user online status updates
            currentSocket.on('user_online', (onlineUserId) => {
                if (activePartner?.id === onlineUserId) {
                    setPartnerOnlineStatus('online');
                }
                // Also update the status in the conversations list
                setConversations(prev => prev.map(conv =>
                    conv.partner?.id === onlineUserId ? { ...conv, partner: { ...conv.partner, status: 'online' } } : conv
                ));
            });

            // Listener for user offline status updates
            currentSocket.on('user_offline', (offlineUserId) => {
                if (activePartner?.id === offlineUserId) {
                    setPartnerOnlineStatus('offline');
                }
                // Also update the status in the conversations list
                setConversations(prev => prev.map(conv =>
                    conv.partner?.id === offlineUserId ? { ...conv, partner: { ...conv.partner, status: 'offline' } } : conv
                ));
            });


            // Cleanup function: disconnect socket when component unmounts or user changes
            return () => {
                disconnectSocket();
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            };
        }
    }, [user, activePartner]); // Re-run this effect if user or activePartner changes

    // Function to fetch conversations from the backend (HTTP API)
    const fetchConversations = useCallback(async () => {
        if (!user?.id) return; // Ensure user is logged in
        try {
            setLoadingConversations(true);
            const response = await getConversations(); // Call your HTTP API service
            const fetchedConversations = response.data.conversations;

            // Format fetched conversations to match frontend expectations
            const formattedConversations = fetchedConversations.map(conv => {
                // The backend's getUserConversations should ideally return 'partner' directly
                // with display_name, photo_url, etc., and 'unread_count'.
                // If your backend query structure provides 'sender' and 'receiver' on the top-level
                // message object, then this logic extracts the 'partner'.
                const partner = conv.sender_id === user.id ? conv.receiver : conv.sender;

                return {
                    id: conv.id, // ID of the latest message in this conversation
                    message: conv.message, // Last message content
                    sent_at: conv.sent_at, // Last message timestamp
                    read_at: conv.read_at, // Read status of the last message
                    partner: { // Ensure partner object has required fields
                        id: partner?.id,
                        display_name: partner?.display_name || partner?.email, // Use email if display_name is missing
                        email: partner?.email,
                        photo_url: partner?.photo_url || '/default-avatar.png', // Fallback avatar
                        role: partner?.role,
                        status: partner?.status || 'offline', // Assume offline if not provided
                    },
                    // Use unread_count provided by backend, or default to 0
                    unread_count: conv.unread_count || 0,
                };
            });

            setConversations(formattedConversations);

            // If a partnerId is provided in the URL, try to set the initial active conversation
            if (urlPartnerId && !activePartner) { // Only set if not already set
                const initialPartnerConv = formattedConversations.find(conv => conv.partner?.id === urlPartnerId);
                if (initialPartnerConv) {
                    setActivePartner(initialPartnerConv.partner);
                    setPartnerOnlineStatus(initialPartnerConv.partner.status || 'offline');
                } else {
                    // If URL partner ID doesn't match an existing conversation,
                    // you might want to fetch that user's details to start a new chat.
                    console.log(`URL partner ${urlPartnerId} not found in existing conversations.`);
                    // A real app might have an API like `getUserById(urlPartnerId)` here.
                    // For now, it will just show "Select a conversation..."
                }
            } else if (formattedConversations.length > 0 && !activePartner && !urlPartnerId) {
                // If no URL partner and no active conversation, set the first one as active
                setActivePartner(formattedConversations[0].partner);
                setPartnerOnlineStatus(formattedConversations[0].partner.status || 'offline');
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoadingConversations(false);
        }
    }, [user, urlPartnerId, activePartner]); // Dependencies for useCallback

    // Effect to load conversations on component mount or user change
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]); // `fetchConversations` is a stable memoized function due to useCallback

    // Effect to load messages for the active conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (activePartner && user?.id) {
                try {
                    setLoadingMessages(true);
                    const response = await getMessages(activePartner.id); // Call HTTP API for messages
                    setMessages(response.data.messages);

                    // Mark all received unread messages in this conversation as read via socket
                    const socketInstance = getSocket();
                    if (socketInstance) {
                        response.data.messages.forEach(msg => {
                            if (msg.receiver_id === user.id && !msg.read_at) {
                                socketInstance.emit('mark_as_read', { message_id: msg.id, user_id: user.id });
                            }
                        });
                        // Optimistically update the unread count for this conversation to 0 in the UI
                        setConversations(prev =>
                            prev.map(conv =>
                                conv.partner?.id === activePartner.id
                                    ? { ...conv, unread_count: 0 }
                                    : conv
                            )
                        );
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoadingMessages(false);
                }
            } else {
                setMessages([]); // Clear messages if no active partner is selected
            }
        };

        fetchMessages();
    }, [activePartner, user]); // Re-fetch messages when activePartner or user changes

    // Effect for auto-scrolling to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loadingMessages]); // Scroll when messages load or update

    // Handler for sending a message
    const handleSendMessage = async () => {
        if (!messageText.trim() || !activePartner || !user) return; // Prevent sending empty messages or if no active partner/user

        const currentSocket = getSocket();
        if (currentSocket) {
            const messageData = {
                sender_id: user.id,
                receiver_id: activePartner.id,
                message: messageText.trim(),
            };
            console.log('Emitting send_message:', messageData);
            currentSocket.emit('send_message', messageData); // Send message via Socket.io

            // Optimistically add the message to the UI immediately
            setMessages(prev => [
                ...prev,
                {
                    id: `temp-${Date.now()}`, // Use a temporary ID until confirmed by server
                    sender_id: user.id,
                    receiver_id: activePartner.id,
                    message: messageText.trim(),
                    sent_at: new Date().toISOString(), // Use current time
                    read_at: null, // Not read yet by receiver
                }
            ]);

            setMessageText(''); // Clear the input field

            // Emit stop typing event immediately after sending message
            currentSocket.emit('stop_typing', {
                senderId: user.id,
                receiverId: activePartner.id,
            });
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }


            // Update the last message in the conversations list immediately
            setConversations(prevConversations => {
                const updatedConversations = prevConversations.map(conv => {
                    if (conv.partner?.id === activePartner.id) {
                        return {
                            ...conv,
                            message: messageText.trim(),
                            sent_at: new Date().toISOString(),
                            read_at: null, // Reset read status for this conversation's last message
                            unread_count: 0, // Sender's own sent messages are not unread for them
                        };
                    }
                    return conv;
                });

                // If this was a brand new conversation (not in the list yet), add it
                // This handles the case where you initiate a chat with someone not in your list
                if (!updatedConversations.some(conv => conv.partner?.id === activePartner.id)) {
                    // Create a new conversation entry for the current activePartner
                    const newConversation = {
                        id: `temp-conv-${Date.now()}`, // Temporary ID for the conversation entry
                        message: messageText.trim(),
                        sent_at: new Date().toISOString(),
                        read_at: null,
                        partner: activePartner, // The full partner object
                        unread_count: 0,
                    };
                    updatedConversations.unshift(newConversation); // Add to the beginning
                }

                // Sort again to bring the latest conversation to the top
                return updatedConversations.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
            });

        } else {
            console.error('Socket not available to send message. Please check connection.');
        }
    };

    // Handler for typing events (keydown and keyup)
    const handleTyping = (e) => {
        setMessageText(e.target.value); // Update message text state

        const currentSocket = getSocket();
        if (!currentSocket || !user || !activePartner) return;

        // Emit typing event
        currentSocket.emit('typing', {
            senderId: user.id,
            receiverId: activePartner.id,
        });

        // Clear previous timeout and set a new one to emit 'stop_typing'
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            currentSocket.emit('stop_typing', {
                senderId: user.id,
                receiverId: activePartner.id,
            });
        }, 3000); // Stop typing after 3 seconds of inactivity
    };

    // Handler for pressing Enter key in the message input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for new line
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handler for clicking on a conversation in the list
    const handleConversationClick = (conversation) => {
        setActivePartner(conversation.partner);
        // Set partner's online status when conversation is selected
        setPartnerOnlineStatus(conversation.partner.status || 'offline');
        // On mobile, hide the conversation list and show the message area
        if (isMobile) {
            // You might manage a state variable here like `showConversationsList`
            // and set it to false to hide the list and show the messages.
            // For now, this example simply sets the active partner.
        }
    };

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(conversation =>
        conversation.partner?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.partner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Render the chat UI
    return (
        <ChatContainer>
            {/* Conversations List (visible on desktop, conditionally visible on mobile) */}
            {(!isMobile || !activePartner) && ( // Show list if not mobile OR if mobile and no active partner selected
                <ConversationsList elevation={1}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6">Conversations</Typography>
                        <SearchInput
                            placeholder="Search users..."
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

                    <List sx={{ overflow: 'auto', flex: 1, py: 0 }}>
                        {loadingConversations && conversations.length === 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : filteredConversations.length === 0 ? (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="textSecondary">
                                    No conversations yet.
                                </Typography>
                            </Box>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <React.Fragment key={conversation.partner.id}>
                                    <ListItem
                                        button
                                        selected={activePartner?.id === conversation.partner.id}
                                        onClick={() => handleConversationClick(conversation)}
                                        sx={{ py: 1.5 }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                color="error"
                                                badgeContent={conversation.unread_count}
                                                // Hide badge if no unread messages or if the conversation is currently active
                                                invisible={!conversation.unread_count || conversation.partner?.id === activePartner?.id}
                                            >
                                                <Avatar src={conversation.partner.photo_url || '/default-avatar.png'} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={conversation.partner.display_name || conversation.partner.email}
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    noWrap
                                                    sx={{ maxWidth: 180 }}
                                                >
                                                    {conversation.message || 'No messages'}
                                                </Typography>
                                            }
                                        />
                                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1, alignSelf: 'flex-start' }}>
                                            {conversation.sent_at &&
                                                format(new Date(conversation.sent_at), 'HH:mm', { locale: ar })}
                                        </Typography>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </ConversationsList>
            )}

            {/* Message Area (visible on desktop, conditionally visible on mobile) */}
            {(!isMobile || activePartner) && ( // Show message area if not mobile OR if mobile and an active partner is selected
                <MessageArea elevation={0}>
                    {activePartner ? (
                        <>
                            {/* Chat Header with Partner Info */}
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                                {/* On mobile, add a back button */}
                                {isMobile && (
                                    <IconButton onClick={() => setActivePartner(null)} sx={{ mr: 1 }}>
                                        {/* You might use an ArrowBackIcon here */}
                                        &#8592; {/* Left arrow character */}
                                    </IconButton>
                                )}
                                <Avatar src={activePartner.photo_url || '/default-avatar.png'} sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="subtitle1">{activePartner.display_name || activePartner.email}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {activePartner.role === 'employer' ? 'Employer' : 'Job Seeker'}
                                        {/* Display online/offline status */}
                                        {' '}•{' '}
                                        <Box component="span" sx={{
                                            color: partnerOnlineStatus === 'online' ? 'success.main' : 'text.secondary'
                                        }}>
                                            {partnerOnlineStatus === 'online' ? 'Online' : 'Offline'}
                                        </Box>
                                        {/* Display typing indicator */}
                                        {isTyping && (
                                            <Box component="span" sx={{ ml: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                                (Typing...)
                                            </Box>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Message List */}
                            <MessageList>
                                {loadingMessages ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : messages.length === 0 ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <Typography variant="body2" color="textSecondary">
                                            No messages yet. Start the conversation!
                                        </Typography>
                                    </Box>
                                ) : (
                                    messages.map((message) => {
                                        const isOwn = message.sender_id === user.id;
                                        return (
                                            <MessageBubble key={message.id} isOwn={isOwn}>
                                                <Typography variant="body1">{message.message}</Typography>
                                                <Stack direction="row" alignItems="center" justifyContent={isOwn ? 'flex-end' : 'flex-start'} spacing={0.5} sx={{ mt: 0.5 }}>
                                                    <MessageTime isOwn={isOwn}>
                                                        {format(new Date(message.sent_at), 'HH:mm', { locale: ar })}
                                                    </MessageTime>
                                                    {isOwn && (
                                                        message.read_at ? (
                                                            <DoneAllIcon sx={{ fontSize: 14, color: isOwn ? 'rgba(255, 255, 255, 0.7)' : 'primary.main' }} />
                                                        ) : (
                                                            <CheckIcon sx={{ fontSize: 14, color: isOwn ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }} />
                                                        )
                                                    )}
                                                </Stack>
                                            </MessageBubble>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                            </MessageList>

                            {/* Message Input Area */}
                            <MessageInput>
                                <IconButton>
                                    <AttachFileIcon /> {/* Attach file icon */}
                                </IconButton>
                                <TextField
                                    fullWidth
                                    placeholder="Write a message..."
                                    variant="outlined"
                                    size="small"
                                    value={messageText}
                                    onChange={handleTyping} // Use handleTyping here
                                    onKeyPress={handleKeyPress}
                                    multiline
                                    maxRows={4}
                                    sx={{ borderRadius: 20, '& .MuiOutlinedInput-root': { borderRadius: 20, pr: 0 } }}
                                />
                                <IconButton color="primary" onClick={handleSendMessage} disabled={!messageText.trim()}>
                                    <SendIcon /> {/* Send message icon */}
                                </IconButton>
                            </MessageInput>
                        </>
                    ) : (
                        // Placeholder when no conversation is selected
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="h6" color="textSecondary">
                                Select a conversation to start chatting.
                            </Typography>
                        </Box>
                    )}
                </MessageArea>
            )}
        </ChatContainer>
    );
};

export default Chat;
