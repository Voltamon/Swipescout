import dotenv from "dotenv";


// src/services/socketService.js
import { io } from "socket.io-client";

let socket = null;

dotenv.config();

export const initializeSocket = userId => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3001", {
      query: { userId },
      transports: ["websocket"],
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const disconnectSocket = socketInstance => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.disconnect();
  }
  socket = null;
};
