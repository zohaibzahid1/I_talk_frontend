// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'; // Default to local backend URL if not se

export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'], // ensures WebSocket is used
        withCredentials: true,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};

// Custom hook to get the same socket instance across all components
export const useSameSocket = (): { socket: Socket | null; isConnected: boolean } => {
    const socket = useSocket();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (socket) {
            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);

            socket.on('connect', handleConnect);
            socket.on('disconnect', handleDisconnect);

            // Set initial connection state
            setIsConnected(socket.connected);

            return () => {
                socket.off('connect', handleConnect);
                socket.off('disconnect', handleDisconnect);
            };
        }
    }, [socket]);

    return { socket, isConnected };
};