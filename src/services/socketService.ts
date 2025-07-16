// services/socketService.ts
import { Message } from '@/types/auth';
import { io, Socket } from 'socket.io-client';


class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private currentUserId: string | null = null;

  private constructor() {
    // Private constructor for singleton pattern
    this.setupBeforeUnloadHandler();
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId?: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Connect directly to backend for socket.io
    const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    console.log('Connecting to socket server at:', SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { userId: userId || this.currentUserId }
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Socket connected:', this.socket?.id);
      
      // Set user online if userId is provided
      if (userId) {
        this.setUserOnline(userId);
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      // Send offline status before disconnecting
      if (this.socket.connected && this.currentUserId) {
        this.socket.emit('userOffline', this.currentUserId);
        console.log(`User ${this.currentUserId} set offline before disconnect`);
      }
      
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentUserId = null;
    }
  }

  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  joinRoom(roomId: string): void {
    this.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: string): void {
    this.emit('leaveRoom', roomId);
  }

  sendMessage(chatId: string, message: Message): void {
    this.emit('sendMessage', { chatId, message });
  }

  setUserOnline(userId: string): void {
    this.currentUserId = userId;
    this.emit('userOnline', userId);
  }
  
  setUserOffline(userId: string): void {
    this.emit('userOffline', userId);
  }

  // Handle page unload (user closes tab, navigates away, etc.)
  private setupBeforeUnloadHandler(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        // Synchronously notify server that user is going offline
        if (this.socket && this.socket.connected && this.currentUserId) {
          this.socket.emit('userOffline', this.currentUserId);
          console.log(`User ${this.currentUserId} set offline on page unload`);
        }
      });
    }
  }




  // Typing indicator methods
  startTyping(chatId: string, userId: string): void {
    this.emit('userStartTyping', { chatId, userId });
  }

  stopTyping(chatId: string, userId: string): void {
    this.emit('userStopTyping', { chatId, userId });
  }

  get connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }

  get userId(): string | null {
    return this.currentUserId;
  }
}

// Export singleton instance
export const socketService = SocketService.getInstance();
export default socketService;
