import { makeAutoObservable } from "mobx";
import { chatApi} from '../services/chatApi';
import { Chat, Message } from '../types/auth';
import { useSameSocket } from "@/hooks/Socket/useSocket";
import { Socket } from 'socket.io-client';


// Chat store to manage chat-related state and actions
// This store handles loading chats, opening/creating chats, sending messages, and managing active chat


export class ChatStore {
    chats: Chat[] = [];
    activeChat: Chat | null = null;
    isLoading = false;
    error: string | null = null;
    // Socket instance for real-time updates
    socket: Socket | null = null; 
    isConnected: boolean = false; // Track socket connection status
    

    constructor() {
        makeAutoObservable(this);
        const { socket, isConnected } = useSameSocket(); // Initialize socket instance
        this.socket = socket;
        this.isConnected = isConnected;
    }
  
    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    setChats(chats: Chat[]) {
        this.chats = chats;
    }

    setActiveChat(chat: Chat | null) {
        if (chat) {
            // Always reference the chat from the chats array to maintain consistency
            const existingChat = this.chats.find(c => c.id === chat.id);
            this.activeChat = existingChat || chat;
        } else {
            this.activeChat = null;
        }
    }

    addChat(chat: Chat) {
        const existingIndex = this.chats.findIndex(c => c.id === chat.id);
        if (existingIndex >= 0) {
            this.chats[existingIndex] = chat;
        } else {
            this.chats.unshift(chat);
        }
    }

    async loadUserChats() {
        try {
            this.setLoading(true);
            this.setError(null);
            const chats = await chatApi.getUserChats();
            console.log('Loaded chats:', chats);
            this.setChats(chats);
        } catch (error: any) {
            console.error('Failed to load chats:', error);
            this.setError(error.message || 'Failed to load chats');
        } finally {
            this.setLoading(false);
        }
    }

    async openOrCreateChat(otherUserId: string | number) {
        try {
            this.setLoading(true);
            this.setError(null);
            const chat = await chatApi.openOrCreateChat(Number(otherUserId));
            this.addChat(chat);
            this.setActiveChat(chat);
            return chat;
        } catch (error: any) {
            console.error('Failed to open/create chat:', error);
            this.setError(error.message || 'Failed to open chat');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async createGroupChat(name: string, participantIds: number[]) {
        try {
            this.setLoading(true);
            this.setError(null);
            const chat = await chatApi.createGroupChat(name, participantIds);
            this.addChat(chat);
            this.setActiveChat(chat);
            return chat;
        } catch (error: any) {
            console.error('Failed to create group chat:', error);
            this.setError(error.message || 'Failed to create group chat');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    // Send a message to a chat
    async sendMessageToDB(chatId: string, content: string) {
        // Create a temporary message for optimistic updates
        const tempMessage: Message = {
            id: `temp-${Date.now()}-${Math.random()}`, // Temporary unique ID
            content,
            createdAt: new Date().toISOString(),
            sender: {
                id: 0, // Will be filled with actual user data
                firstName: 'You',
                lastName: '',
                avatar: ''
            }
        };

        // Optimistically add the message to the UI
        const chatIndex = this.chats.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1) {
            this.chats[chatIndex].messages.push(tempMessage);
        }

        try {
            const newMessage = await chatApi.sendMessageToDB(chatId, content);
            
            // Replace the temporary message with the real one
            if (chatIndex !== -1) {
                const tempIndex = this.chats[chatIndex].messages.findIndex(msg => msg.id === tempMessage.id);
                if (tempIndex !== -1) {
                    this.chats[chatIndex].messages[tempIndex] = newMessage;
                }
            }
            // Emit the new message via socket
            if (this.socket) {
                this.socket.emit('sendMessage', { chatId, message: newMessage });
            }
            
            return newMessage;
        } catch (error) {
            // Remove the temporary message on error
            if (chatIndex !== -1) {
                const tempIndex = this.chats[chatIndex].messages.findIndex(msg => msg.id === tempMessage.id);
                if (tempIndex !== -1) {
                    this.chats[chatIndex].messages.splice(tempIndex, 1);
                }
            }
            
            console.error('Failed to send message:', error);
            throw error;
        }
    }
  

    clearError() {
        this.error = null;
    }

    // Helper method to get chat participants excluding current user
    getChatDisplayName(chat: Chat, currentUserId: string | number): string {
        
        if (chat.isGroup) {
            return chat.name || `Group (${chat.participants.length} members)`;
        }
        
        const otherParticipant = chat.participants.find(p => p.id.toString() !== currentUserId.toString());
        //console.log('Other participant:', otherParticipant);
        return otherParticipant 
            ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || otherParticipant.email
            : 'Unknown User';
    }

    // Helper method to get the other participant in a direct chat
    getOtherParticipant(chat: Chat, currentUserId: string | number) {
        if (chat.isGroup) return null;
        return chat.participants.find(p => p.id.toString() !== currentUserId.toString());
    }
}
