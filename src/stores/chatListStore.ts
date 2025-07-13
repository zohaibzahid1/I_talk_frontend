import { makeAutoObservable } from "mobx";
import { Chat } from '@/types/auth';


// ChatListStore to manage chat list-related state and actions
// This store handles formatting last messages and times for display in the chat list


export class ChatListStore {
    constructor() {
        makeAutoObservable(this);
    }

    // Format last message for display in chat list
    formatLastMessage(chat: Chat, currentUserId: string | number): string {
        if (chat.messages.length === 0) {
            return "No messages yet";
        }
        const lastMessage = chat.messages[chat.messages.length - 1];
        
        // Check if last message is from current user
        const isCurrentUser = lastMessage.sender.id.toString() === currentUserId.toString();
        const senderName = isCurrentUser ? "You" : (lastMessage.sender.firstName || 'Someone');
        
        const truncatedContent = lastMessage.content.length > 30 
            ? `${lastMessage.content.substring(0, 30)}...` 
            : lastMessage.content;
        
        return `${senderName}: ${truncatedContent}`;
    }

    // Format time for last message
    formatTime(createdAt: string): string {
        const date = new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString();
    }
}
