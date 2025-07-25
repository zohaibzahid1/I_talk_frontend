import {  makeAutoObservable, runInAction } from "mobx";
import { chatApi} from '../services/chatApi';
import { Chat, Message } from '../types/auth';
import socketService from '../services/socketService';
import { autorun } from 'mobx';
import { RootStore } from './rootStore';


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
        // Set up socket listeners with a small delay to ensure socket is ready
        // Only run on client side
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                this.setupSocketListeners();
            }, 100);
        }
        autorun(() => {
            console.log("chat store current chat:", this.activeChat?.id);
        });
        
        // Debug autorun to track chats array changes
        autorun(() => {
            console.log("chat store chats count:", this.chats.length);
            console.log("chat store chats:", this.chats.map(c => ({id: c.id, name: c.name || 'direct chat'})));
        });
    }

    // Set loading state
    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    // Set an error message
    setError(error: string | null) {
        this.error = error;
    }

    // Set the list of chats
    setChats(chats: Chat[]) {
        this.chats = chats;
    }

    // Set the active chat and clear messages if no chat is provided
    setActiveChat(chat: Chat | null) {
        if (chat) {
            // Always reference the chat from the chats array to maintain consistency
            const existingChat = this.chats.find(c => c.id === chat.id);
            this.activeChat = existingChat || chat;
            
            // No need to join room here as we already join all rooms when loading user chats
        } else {
            this.activeChat = null;
            // Clear messages when no chat is active
            this.clearActiveChatMessages();
        }
    }

    // Add a chat to the start of the chats array or update existing one
    addChat(chat: Chat) {
        console.log('Adding chat to store:', chat.id);
        const existingIndex = this.chats.findIndex(c => c.id === chat.id);
        if (existingIndex >= 0) {
            console.log('Updating existing chat at index:', existingIndex);
            this.chats[existingIndex] = chat;
        } else {
            console.log('Adding new chat to start of array');
            // when a new chat is created, add it to the start of the chats array
            this.chats.unshift(chat);
            this.joinSingleChatRoom(chat.id.toString()); // Join the chat room for real-time updates only for new chats
        }
        console.log('Total chats after addChat:', this.chats.length);
    }

    // initiated by chat list component to load user chats
    async loadUserChats() {
        try {
            this.setLoading(true);
            this.setError(null);
            const chats = await chatApi.getUserChats();
            this.setChats(chats);
            // join each chat room for real-time updates
            this.joinAllChatRoom();
        } catch (error: unknown) {
            console.error('Failed to load chats:', error);
            this.setError(error instanceof Error ? error.message : 'Failed to load chats');
        } finally {
            this.setLoading(false);
        }
    }

    // Method to join a single chat room
    joinSingleChatRoom(chatId: string) {
        if (!socketService.connected) {
            console.warn('Socket is not connected when trying to join room:', chatId);
            return;
        }
        socketService.joinSingleRoom(chatId);
        console.log(`Joined room for chat: ${chatId}`);
    }

    // When chat list initiates load users then load user messgae also initiates this function so the user joins every chat room
    async joinAllChatRoom() {
        if (!socketService.connected) {
            console.warn('Socket is not connected when trying to join rooms');
            return;
        }
        // join all chat rooms for real-time updates
        this.chats.forEach(chat => {
            const chatId = String(chat.id);
            socketService.joinRoom(chatId);

        });
    }

    // Method to send a message via socket
    async sendMessageViaSocket(chatId: string, message: Message) {
        if (!socketService.connected) {
            console.warn('Socket is not connected');
            return;
        }
        // Emit the message to the server
        socketService.sendMessage(chatId, message);
    }

    // Open or create a chat with another user this will also call the method to load messages for the newly created or opened chat
    async openOrCreateChat(otherUserId: string | number) {
        try {
            this.setLoading(true);
            this.setError(null);
            const chat = await chatApi.openOrCreateChat(Number(otherUserId));
            // add the chat to the start of the chats array
            runInAction(() => {
                this.addChat(chat);
                this.setActiveChat(chat);
            });

            // load messages for the selected  chat - this means messages will only be loaded when a chat is opened or created
            // this is required so that even if user selects a esxisting memeber chat, the messages are loaded
            await this.loadChatMessages(Number(chat.id));
            return chat;
        } catch (error: unknown) {
            console.error('Failed to open/create chat:', error);
            this.setError(error instanceof Error ? error.message : 'Failed to open chat');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }


    // Select an existing chat and load its messages This method is only used when a chat is selected from the chat list
    async selectChat(chat: Chat) {
        try {
            this.setLoading(true);
            this.setError(null);
            this.setActiveChat(chat);
            await this.loadChatMessages(Number(chat.id));
        } catch (error: unknown) {
            console.error('Failed to select chat:', error);
            this.setError(error instanceof Error ? error.message : 'Failed to load chat messages');
        } finally {
            this.setLoading(false);
        }
    }


    async createGroupChat(name: string, participantIds: number[]) {
        try {
            this.setLoading(true);
            this.setError(null);
            const chat = await chatApi.createGroupChat(name, participantIds);
            runInAction(() => {
                //this.addChat(chat);
                this.setActiveChat(chat);
            });
            
            // No need to join room here as addChat already does it
            await this.loadChatMessages(Number(chat.id));
            
            return chat;
        } catch (error: unknown) {
            console.error('Failed to create group chat:', error);
            this.setError(error instanceof Error ? error.message : 'Failed to create group chat');
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
        runInAction(() => {
            if (this.activeChat && this.activeChat.id.toString() === chatId.toString()) {
                this.activeChatMessages.push(tempMessage);
            }
        });

        // Update lastMessage in chats array
        runInAction(() => {
            const chatIndex = this.chats.findIndex(chat => chat.id.toString() === chatId.toString());
            if (chatIndex !== -1) {
                this.chats[chatIndex].lastMessage = tempMessage;
            }
        });

        try {
            const newMessage = await chatApi.sendMessage(chatId, content);
            
            // Replace the temporary message with the real one in activeChatMessages
            runInAction(() => {
                if (this.activeChat && this.activeChat.id.toString() === chatId.toString()) {
                    const tempIndex = this.activeChatMessages.findIndex(msg => msg.id === tempMessage.id);
                    if (tempIndex !== -1) {
                        this.activeChatMessages[tempIndex] = newMessage;
                    }
                }
            });

            // Update lastMessage in chats array with real message
            runInAction(() => {
                const chatIndex = this.chats.findIndex(chat => chat.id.toString() === chatId.toString());
                if (chatIndex !== -1) {
                    this.chats[chatIndex].lastMessage = newMessage;
                }
            });
            
            // Emit the message via socket for real-time updates
            this.sendMessageViaSocket(String(chatId), newMessage); 
            return newMessage;
        } catch (error) {
            // Remove the temporary message on error from activeChatMessages
            runInAction(() => {
                if (this.activeChat && this.activeChat.id.toString() === chatId.toString()) {
                    const tempIndex = this.activeChatMessages.findIndex(msg => msg.id === tempMessage.id);
                    if (tempIndex !== -1) {
                        this.activeChatMessages.splice(tempIndex, 1);
                    }
                }

                // Restore previous lastMessage in chats array on error
                const chatIndex = this.chats.findIndex(chat => chat.id.toString() === chatId.toString());
                if (chatIndex !== -1) {
                    // We could restore the previous lastMessage here if needed
                    // For now, we'll leave it as is since the temp message wasn't saved to backend
                }
            });

            console.error('Failed to send message:', error);
            Promise.reject(error);
        }
    }
    // Method to load messages when chat is selected
    async loadChatMessages(chatId: number) {
        try {
            const messages = await chatApi.getChatMessages(chatId);
            runInAction(() => {
                this.activeChatMessages = messages || [];
            });
        } catch (error) {
            console.error('Failed to load chat messages:', error);
            runInAction(() => {
                this.activeChatMessages = [];
            });
        }
    }

    clearError() {
        this.error = null;
    }

    // Clear active chat messages (useful when switching chats or logging out)
    clearActiveChatMessages() {
        runInAction(() => {
            this.activeChatMessages = [];
        });
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

    // Helper method to check if other participant is online (for direct chats)
    isOtherParticipantOnline(chat: Chat, currentUserId: string | number): boolean {
        if (chat.isGroup) {
            // For group chats, return true if any participant (except current user) is online
            return chat.participants.some(p => 
                p.id.toString() !== currentUserId.toString() && p.isOnline
            );
        }
        
        const otherParticipant = this.getOtherParticipant(chat, currentUserId);
        return otherParticipant?.isOnline || false;
    }

    // Helper method to get online participants count (for group chats)
    getOnlineParticipantsCount(chat: Chat, currentUserId: string | number): number {
        return chat.participants.filter(p => 
            p.id.toString() !== currentUserId.toString() && p.isOnline
        ).length;
    }

    // Helper method to get typing participants (excluding current user)
    getTypingParticipants(chat: Chat, currentUserId: string | number) {
        return chat.participants.filter(p => 
            p.id.toString() !== currentUserId.toString() && p.isTyping
        );
    }

    // Helper method to check if anyone is typing in the chat
    isAnyoneTyping(chat: Chat, currentUserId: string | number): boolean {
        return this.getTypingParticipants(chat, currentUserId).length > 0;
    }

    // Start typing indicator
    startTyping(chatId: string, userId: string) {
        socketService.startTyping(chatId, userId);
    }

    // Stop typing indicator
    stopTyping(chatId: string, userId: string) {
        socketService.stopTyping(chatId, userId);
    }









    // Set up socket event listeners for real-time messaging
    setupSocketListeners() {
        // Listen for incoming messages
        socketService.on('receiveMessage', (data: any) => {
            const messageData = data as { chatId: string; message: Message };
            this.handleIncomingMessage(messageData.chatId, messageData.message);
        });

        // Listen for user status changes
        socketService.on('userStatusChanged', (data: any) => {
            const statusData = data as { userId: string; isOnline: boolean };
            this.handleUserStatusChange(statusData.userId, statusData.isOnline);
        });

        // Listen for typing status changes
        socketService.on('userTypingStatusChanged', (data: any) => {
            const typingData = data as { chatId: string; userId: string; isTyping: boolean };
            this.handleTypingStatusChange(typingData.chatId, typingData.userId, typingData.isTyping);
        });

        // Listen for new chat created notifications
        socketService.on('newChatCreated', (data: any) => {
            const chatData = data as { chat: Chat };
            this.handleNewChatCreated(chatData.chat);
        });
    }

    // socket listners handlers 
    // Handle incoming messages from socket
    handleIncomingMessage(chatId: string, message: Message) {
        runInAction(() => {
            // Find the chat this message belongs to
            const chatIndex = this.chats.findIndex(chat => chat.id.toString() === chatId.toString());
            
            if (chatIndex !== -1) {
                // Update the lastMessage for this chat
                this.chats[chatIndex].lastMessage = message;
                
                // If this is the currently active chat, add message to activeChatMessages
                if (this.activeChat && this.activeChat.id.toString() === chatId.toString()) {
                    // Check if message already exists (to avoid duplicates)
                    const existingMessageIndex = this.activeChatMessages.findIndex(
                        msg => msg.id === message.id
                    );
                    
                    if (existingMessageIndex === -1) {
                        this.activeChatMessages.push(message);
                    }
                }
            }
        });
    }

    // Handle user status changes from socket
    handleUserStatusChange(userId: string, isOnline: boolean) {
        runInAction(() => {
            // Update online status for all chats that include this user
            this.chats.forEach(chat => {
                const participantIndex = chat.participants.findIndex(
                    participant => participant.id.toString() === userId.toString()
                );
                
                if (participantIndex !== -1) {
                    chat.participants[participantIndex].isOnline = isOnline;
                }
            });

            // If this user is part of the active chat, update it too
            if (this.activeChat) {
                const participantIndex = this.activeChat.participants.findIndex(
                    participant => participant.id.toString() === userId.toString()
                );
                
                if (participantIndex !== -1) {
                    this.activeChat.participants[participantIndex].isOnline = isOnline;
                }
            }
        });
    }

    // Handle typing status changes from socket
    handleTypingStatusChange(chatId: string, userId: string, isTyping: boolean) {
        runInAction(() => {
            console.log(`User ${userId} is typing in chat ${chatId}: ${isTyping}`);
            // Update typing status for the specific chat
            const chatIndex = this.chats.findIndex(chat => chat.id.toString() === chatId.toString());
            // If chat exists, update the participant's typing status
            if (chatIndex !== -1) {
                const participantIndex = this.chats[chatIndex].participants.findIndex(
                    participant => participant.id.toString() === userId.toString()
                );
                
                if (participantIndex !== -1) {
                    this.chats[chatIndex].participants[participantIndex].isTyping = isTyping;
                }
            }

            // If this is the currently active chat, update it too
            if (this.activeChat && this.activeChat.id.toString() === chatId.toString()) {
                const participantIndex = this.activeChat.participants.findIndex(
                    participant => participant.id.toString() === userId.toString()
                );
                
                if (participantIndex !== -1) {
                    this.activeChat.participants[participantIndex].isTyping = isTyping;
                }
            }
        });
    }

    // Handle new chat created notification from socket
    handleNewChatCreated(chat: Chat) {
        console.log('New chat created notification received:', chat);
        console.log('Current chats before adding:', this.chats.length);
        
        runInAction(() => {
            // Use addChat method which has proper duplicate checking
            this.addChat(chat);
            console.log('Current chats after adding:', this.chats.length);
            console.log('Chats array:', this.chats.map(c => ({id: c.id, name: c.name, isGroup: c.isGroup})));
        });
    }



   
}
