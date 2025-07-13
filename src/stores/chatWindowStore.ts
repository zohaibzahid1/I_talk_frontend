import { autorun, makeAutoObservable } from 'mobx';
import { Chat, Message } from '@/types/auth';


// ChatWindowStore to manage chat window-related state and actions
// This store handles the current chat, new message input, and message processing for display




export class ChatWindowStore {
  newMessage = '';
  isLoading = false;
  currentUserId: number | null = null;
  currentChat: Chat | null = null;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      if (this.currentChat) {
        console.log('Current chat set:', this.currentChat);
      } else {
        console.log('No current chat selected');
      }
    });
  }

  setCurrentUserId(userId: number | null) {
    this.currentUserId = userId;
  }

  setCurrentChat(chat: Chat | null) {
    this.currentChat = chat;
  }

  setNewMessage(message: string) {
    this.newMessage = message;
  }

  setIsLoading(loading: boolean) {
    this.isLoading = loading;
  }

  clearMessage() {
    this.newMessage = '';
  }

  // Get processed message data for rendering
  getProcessedMessages(): Array<{
    message: Message;
    index: number;
    isOwnMessage: boolean;
    previousMessage?: Message;
    showDateSeparator: boolean;
  }> {
    if (!this.currentChat) return [];

    return this.currentChat.messages.map((message, index) => {
      const isOwnMessage = this.isOwnMessage(message);
      const previousMessage = index > 0 ? this.currentChat!.messages[index - 1] : undefined;
      const showDateSeparator = this.shouldShowDateSeparator(message, previousMessage);

      return {
        message,
        index,
        isOwnMessage,
        previousMessage,
        showDateSeparator
      };
    });
  }

  // Check if there are any messages
  get hasMessages(): boolean {
    return this.currentChat ? this.currentChat.messages.length > 0 : false;
  }

  // Get empty state data
  get emptyStateData() {
    return {
      hasMessages: this.hasMessages,
      emptyMessage: "Start the conversation!",
      emptySubMessage: "Send a message to get things started."
    };
  }

  // Format message time for display
  formatMessageTime(createdAt: string): string {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Format message date for display
  formatMessageDate(createdAt: string): string {
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  // Check if date separator should be shown
  shouldShowDateSeparator(currentMessage: Message, previousMessage?: Message): boolean {
    if (!previousMessage) return true;
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    return currentDate !== previousDate;
  }

  // Check if message is from current user
  isOwnMessage(message: Message): boolean {
    return message.sender.id.toString() === this.currentUserId?.toString();
  }

  // Get avatar data for a message sender
  getMessageSenderAvatar(message: Message, isOwnMessage: boolean) {
    if (isOwnMessage) return null;

    return {
      hasAvatar: !!message.sender.avatar,
      avatarUrl: message.sender.avatar,
      fallbackText: message.sender.firstName?.charAt(0).toUpperCase() || 'U',
      altText: `${message.sender.firstName} ${message.sender.lastName}`
    };
  }

  // Get message bubble styling data
  getMessageBubbleData(isOwnMessage: boolean) {
    return {
      containerClass: `flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`,
      bubbleClass: `px-3 py-2 rounded-lg ${
        isOwnMessage 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`,
      timeClass: `text-xs mt-1 ${
        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
      }`
    };
  }

  // Get group chat sender info
  getGroupSenderInfo(message: Message, isOwnMessage: boolean, isGroup: boolean) {
    return {
      shouldShowSender: !isOwnMessage && isGroup,
      senderName: message.sender.firstName || 'Unknown'
    };
  }

  // Get chat display information
  getChatDisplayInfo() {
    if (!this.currentChat) {
      return {
        displayName: 'Unknown Chat',
        otherParticipant: null
      };
    }

    // Convert currentUserId to string for comparison since participant IDs might be strings
    const currentUserIdStr = this.currentUserId?.toString();
    
    // Find the other participant (not the current user)
    const otherParticipant = this.currentChat.participants.find(p => 
      p.id.toString() !== currentUserIdStr
    );
    
    console.log('getChatDisplayInfo - currentUserId:', this.currentUserId, 'currentUserIdStr:', currentUserIdStr);
    console.log('getChatDisplayInfo - participants:', this.currentChat.participants.map(p => ({ id: p.id, name: `${p.firstName} ${p.lastName}` })));
    console.log('getChatDisplayInfo - otherParticipant:', otherParticipant);
    
    const displayName = this.currentChat.isGroup 
      ? this.currentChat.name || `Group Chat (${this.currentChat.participants.length} members)`
      : otherParticipant 
        ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || 'Unknown User'
        : 'Unknown User';

    return {
      displayName,
      otherParticipant
    };
  }

  // Get current chat ID
  get currentChatId(): number | null {
    return this.currentChat?.id ? Number(this.currentChat.id) : null;
  }

  // Reset store state
  reset() {
    this.newMessage = '';
    this.isLoading = false;
    this.currentChat = null;
  }
}
