// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import socketService from '../../services/socketService';


export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socketService.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    // Set up event listeners
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    

    // Update initial state
    setIsConnected(socketService.connected);
    

    return () => {
      // Clean up event listeners
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
    };
  }, []);

  return { 
    socket: socketService, 
    isConnected,
    connect: () => socketService.connect(),
    disconnect: () => socketService.disconnect(),
    emit: (event: string, data: unknown) => socketService.emit(event, data),
    on: (event: string, callback: (...args: unknown[]) => void) => socketService.on(event, callback),
    off: (event: string, callback?: (...args: unknown[]) => void) => socketService.off(event, callback),
  };
};
