// import dotenv from "dotenv";


import io from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (userId) => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.REACT_APP_SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socketInstance;
};

export const disconnectSocket = (socket) => {
  if (socket) {
    socket.disconnect();
    socketInstance = null;
    console.log('Socket disconnected');
  }
};

export const getSocket = () => {
  return socketInstance;
};