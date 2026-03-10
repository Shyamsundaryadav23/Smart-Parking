import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  socket = io(API_BASE_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
