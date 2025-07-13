import { autorun, makeAutoObservable } from "mobx";
import { chatApi} from '../services/chatApi';
import { Chat, Message } from '../types/auth';


// Chat store to manage chat-related state and actions
// This store handles loading chats, opening/creating chats, sending messages, and managing active chat


export class ChatStore {
    chats: Chat[] = [];
    activeChat: Chat | null = null;
    isLoading = false;
    error: string | null = null;
    activeChatMessages: Message[] = []; // Messages for the currently active chat
    

    constructor() {
        makeAutoObservable(this);
        autorun(() => {
            console.log("chats:", this.chats);
            console.log("activechatmsg:", this.activeChatMessages);
        });
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
            // Clear messages when no chat is active
            this.clearActiveChatMessages();
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
            // extract the data relevant to the chat
            this.addChat(chat);
            this.setActiveChat(chat);
            // load messages for the currently active chat
            await this.loadChatMessages(Number(chat.id));
            return chat;
        } catch (error: any) {
            console.error('Failed to open/create chat:', error);
            this.setError(error.message || 'Failed to open chat');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    // Select an existing chat and load its messages
    async selectChat(chat: Chat) {
        try {
            this.setLoading(true);
            this.setError(null);
            this.setActiveChat(chat);
            await this.loadChatMessages(Number(chat.id));
        } catch (error: any) {
            console.error('Failed to select chat:', error);
            this.setError(error.message || 'Failed to load chat messages');
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

        // Optimistically add the message to activeChatMessages if this is the active chat
        if (this.activeChat && this.activeChat.id === chatId) {
            this.activeChatMessages.push(tempMessage);
        }

        // Update lastMessage in chats array
        const chatIndex = this.chats.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1) {
            this.chats[chatIndex].lastMessage = tempMessage;
        }

        try {
            const newMessage = await chatApi.sendMessage(chatId, content);
            
            // Replace the temporary message with the real one in activeChatMessages
            if (this.activeChat && this.activeChat.id === chatId) {
                const tempIndex = this.activeChatMessages.findIndex(msg => msg.id === tempMessage.id);
                if (tempIndex !== -1) {
                    this.activeChatMessages[tempIndex] = newMessage;
                }
            }

            // Update lastMessage in chats array with real message
            if (chatIndex !== -1) {
                this.chats[chatIndex].lastMessage = newMessage;
            }
            
            return newMessage;
        } catch (error) {
            // Remove the temporary message on error from activeChatMessages
            if (this.activeChat && this.activeChat.id === chatId) {
                const tempIndex = this.activeChatMessages.findIndex(msg => msg.id === tempMessage.id);
                if (tempIndex !== -1) {
                    this.activeChatMessages.splice(tempIndex, 1);
                }
            }

            // Restore previous lastMessage in chats array on error
            if (chatIndex !== -1) {
                // We could restore the previous lastMessage here if needed
                // For now, we'll leave it as is since the temp message wasn't saved to backend
            }
            
            console.error('Failed to send message:', error);
            throw error;
        }
    }
  

    // Method to load messages when chat is selected
    async loadChatMessages(chatId: number) {
        try {
            const messages = await chatApi.getChatMessages(chatId);
            this.activeChatMessages = messages || [];
        } catch (error) {
            console.error('Failed to load chat messages:', error);
            this.activeChatMessages = [];
        }
    }

    clearError() {
        this.error = null;
    }

    // Clear active chat messages (useful when switching chats or logging out)
    clearActiveChatMessages() {
        this.activeChatMessages = [];
    }

    // Helper method to get chat participants excluding current user
    getChatDisplayName(chat: Chat, currentUserId: string | number): string {
        
        if (chat.isGroup) {
            return chat.name || `Group (${chat.participants.length} members)`;
        }
        
        const otherParticipant = chat.participants.find(p => p.id.toString() !== currentUserId.toString());
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
