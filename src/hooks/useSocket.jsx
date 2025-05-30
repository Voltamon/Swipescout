// useSocket.jsx
import { io } from 'socket.io-client';
import {useMemo} from "react";

export const useSocket = () => {
  const socket = useMemo(() =>io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }),[]);

  return socket;
};

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { useAuth } from './useAuth';

// /**
//  * Socket context for managing WebSocket connections
//  */
// const SocketContext = createContext(null);

// /**
//  * Provider component for socket connections
//  * Manages connection, reconnection, and authentication with the chat server
//  */


// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { user } = useAuth();
  
//   useEffect(() => {
//     // Only connect if user is authenticated
//     console.log("in use socket:::");
//       console.log("in use socket ::: useEffect triggered, user:", user); // Add this
//   if (!user) {
//     console.log("Socket connection skipped: user is null."); // Add this
//     return;
//   }
    
//     if (!user) return;
    
//     // Connect to the socket server
//     const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
//       withCredentials: true,
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });
    
//     // Set up event handlers
//     socketInstance.on('connect', () => {
//       console.log('Socket connected');
      
//       // Register user with socket server
//       socketInstance.emit('register', user.id);
//     });
    
//     socketInstance.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//     });
    
//     socketInstance.on('disconnect', (reason) => {
//       console.log('Socket disconnected:', reason);
//     });
    
//     // Save socket instance
//     setSocket(socketInstance);
    
//     // Clean up on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [user]);
  
//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// /**
//  * Custom hook for using the socket connection
//  * @returns {Socket|null} Socket.io instance or null if not connected
//  */
// export const useSocket = () => {
//   return useContext(SocketContext);
// };
