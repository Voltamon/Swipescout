// src/services/socketService.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId) => {
    if (!socket) {
        const backendUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        
        socket = io(backendUrl, {
            auth: {
                token: localStorage.getItem('accessToken'),
                userId: userId,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            if (userId) {
                socket.emit('register', userId);
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};