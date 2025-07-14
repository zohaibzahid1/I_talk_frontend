// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
