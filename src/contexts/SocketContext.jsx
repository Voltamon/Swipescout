import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

/* eslint-disable react-refresh/only-export-components -- TODO: move non-component helpers to separate modules */
const SocketContext = createContext({ socket: null, isConnected: false });

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const SOCKET_URL = useMemo(() => {
    // Use API base without any trailing `/api` path so socket.io connects at the server root
    const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    // remove trailing slashes
    let base = String(raw).replace(/\/+$/g, '');
    // if it ends with `/api` remove that segment
    base = base.replace(/\/api(?:$|\/)$/i, '');
    return base;
  }, []);

  useEffect(() => {
    // Initialize once
    if (!socketRef.current) {
      const token = localStorage.getItem('accessToken');
      console.log('[SocketContext] Initializing socket connection to:', SOCKET_URL);
      console.log('[SocketContext] Auth token present:', !!token);
      
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        auth: token ? { token } : undefined
      });

      socketRef.current.on('connect', () => {
        console.log('[SocketContext] Socket connected. Socket ID:', socketRef.current.id);
        setIsConnected(true);
      });
      socketRef.current.on('disconnect', () => {
        console.log('[SocketContext] Socket disconnected');
        setIsConnected(false);
      });
    }
    return () => {
      // Don't auto-disconnect on provider unmount (app-level)
    };
  }, [SOCKET_URL]);

  useEffect(() => {
    // Register the authenticated user id with the socket server
    const id = user?.id || user?.userId || user?.uid;
    console.log('[SocketContext] User object:', user);
    console.log('[SocketContext] Extracted user ID for socket registration:', id);
    
    if (socketRef.current && id) {
      console.log('[SocketContext] Emitting register event with user ID:', id);
      socketRef.current.emit('register', id);
    } else if (socketRef.current && !id) {
      console.warn('[SocketContext] Socket available but no user ID found');
    }
  }, [user]);

  const value = useMemo(() => ({ socket: socketRef.current, isConnected }), [isConnected]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
