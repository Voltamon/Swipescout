import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Send, ArrowLeft, MoreVertical, Check, CheckCheck,
  RefreshCw, Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { ScrollArea } from '@/components/UI/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '../lib/utils';

const Chat = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({ conversations: true, messages: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [pendingMessages, setPendingMessages] = useState({});
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socket = useSocket();
  const isMobile = window.innerWidth < 960;

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
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
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
      });
    } catch (e) {
      return '';
    }
  };

  const normalizeUser = (u) => ({
    ...u,
    display_name: u.display_name || u.displayName,
    photo_url: u.photo_url || u.photoUrl || u.photoURL,
  });

  const normalizeMessage = (m) => ({
    ...m,
    id: m.id,
    content: m.content || m.text || m.body,
    sender_id: m.sender_id || m.senderId,
    receiver_id: m.receiver_id || m.receiverId,
    conversation_id: m.conversation_id || m.conversationId,
    created_at: m.created_at || m.createdAt,
    read: !!m.read,
  });

  const normalizeConversation = (c) => ({
    ...c,
    id: c.id,
    other_user: c.other_user ? normalizeUser(c.other_user) : (c.otherUser ? normalizeUser(c.otherUser) : null),
    last_message: c.last_message ? normalizeMessage(c.last_message) : (c.lastMessage ? normalizeMessage(c.lastMessage) : null),
    unread_count: c.unread_count ?? c.unreadCount ?? 0,
  });

  const fetchAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await getAllUsers();
      const users = (response.data.users || []).map(normalizeUser);
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleStartConversation = async (otherUser) => {
    try {
      const response = await startConversation(otherUser.id);
      const newConv = normalizeConversation(response.data.conversation || response.conversation);
      
      setConversations(prev => {
        const exists = prev.find(c => c.id === newConv.id);
        return exists ? prev : [newConv, ...prev];
      });
      
      setActiveConversation(newConv);
      setShowAllUsers(false);
      setShowConversations(false);
      await fetchMessages(newConv.id);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({ description: "Failed to start conversation", variant: "destructive" });
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const response = await getMessages(conversationId);
      const msgs = (response.data.messages || []).map(normalizeMessage);
      setMessages(msgs);
      
      msgs.forEach(msg => {
        if (!msg.read && msg.sender_id !== user.id) {
          markAsRead(msg.id).catch(console.error);
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      id: tempId,
      content: newMessage,
      sender_id: user.id,
      conversation_id: activeConversation.id,
      created_at: new Date().toISOString(),
      read: false,
      pending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setPendingMessages(prev => ({ ...prev, [tempId]: true }));
    setNewMessage('');

    try {
      const response = await sendMessage(activeConversation.id, newMessage);
      const sentMessage = normalizeMessage(response.data.message || response.message);
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? sentMessage : msg
      ));
      setPendingMessages(prev => {
        const updated = { ...prev };
        delete updated[tempId];
        return updated;
      });
      
      if (socket) {
        socket.emit('send_message', sentMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setPendingMessages(prev => {
        const updated = { ...prev };
        delete updated[tempId];
        return updated;
      });
      toast({ description: "Failed to send message", variant: "destructive" });
    }
  };

  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    setShowConversations(false);
    await fetchMessages(conversation.id);
    
    setConversations(prev => prev.map(c =>
      c.id === conversation.id ? { ...c, unread_count: 0 } : c
    ));
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        const response = await getConversations();
        const convs = (response.data.conversations || []).map(normalizeConversation);
        setConversations(convs);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    socket.connect();
    socket.emit('register', String(user.id));

    socket.on('user_status_update', ({ userId, isOnline }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        isOnline ? updated.add(userId) : updated.delete(userId);
        return updated;
      });
    });

    socket.on('new_message', (message) => {
      const normalizedMessage = normalizeMessage(message);
      if (activeConversation && normalizedMessage.conversation_id === activeConversation.id) {
        setMessages(prev => [...prev, normalizedMessage]);
        markAsRead(normalizedMessage.id);
      }
    });

    socket.on('typing', ({ userId, isTyping: typing }) => {
      if (activeConversation && userId === activeConversation.other_user?.id) {
        setOtherUserTyping(typing);
      }
    });

    return () => {
      socket.off('user_status_update');
      socket.off('new_message');
      socket.off('typing');
      socket.disconnect();
    };
  }, [socket, user?.id, activeConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    u.id !== user?.id &&
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-80 bg-white border-r flex flex-col",
        !showConversations && isMobile && "hidden"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={!showAllUsers ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAllUsers(false)}
              className="flex-1"
            >
              Conversations
            </Button>
            <Button
              variant={showAllUsers ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowAllUsers(true);
                if (allUsers.length === 0) fetchAllUsers();
              }}
              className="flex-1"
            >
              All Users
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {showAllUsers ? (
            usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map(otherUser => (
                  <div
                    key={otherUser.id}
                    onClick={() => handleStartConversation(otherUser)}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={otherUser.photo_url} />
                        <AvatarFallback>{otherUser.display_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      {onlineUsers.has(otherUser.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{otherUser.display_name}</p>
                      <p className="text-xs text-gray-500">{otherUser.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : loading.conversations ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={cn(
                    "p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3",
                    activeConversation?.id === conv.id && "bg-purple-50"
                  )}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conv.other_user?.photo_url} />
                      <AvatarFallback>{conv.other_user?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    {onlineUsers.has(conv.other_user?.id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium truncate">{conv.other_user?.display_name}</p>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(conv.last_message?.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.last_message?.content || 'No messages yet'}</p>
                  </div>
                  {conv.unread_count > 0 && (
                    <Badge className="bg-purple-600">{conv.unread_count}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Message Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100",
        showConversations && isMobile && "hidden"
      )}>
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b p-4 flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConversations(true)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Avatar>
                <AvatarImage src={activeConversation.other_user?.photo_url} />
                <AvatarFallback>{activeConversation.other_user?.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{activeConversation.other_user?.display_name}</p>
                {onlineUsers.has(activeConversation.other_user?.id) && (
                  <p className="text-xs text-green-600">● Online</p>
                )}
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading.messages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user.id;
                    const isPending = pendingMessages[msg.id];
                    
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                      >
                        <div className={cn("max-w-[75%] space-y-1")}>
                          <div
                            className={cn(
                              "px-4 py-2 rounded-2xl",
                              isOwn
                                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm shadow",
                              isPending && "opacity-70"
                            )}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                          </div>
                          <div className={cn("flex items-center gap-1 text-xs text-gray-500", isOwn && "justify-end")}>
                            <span>{formatMessageTime(msg.created_at)}</span>
                            {isOwn && (
                              isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : msg.read ? (
                                <CheckCheck className="h-3 w-3 text-cyan-600" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {otherUserTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t p-4 flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
