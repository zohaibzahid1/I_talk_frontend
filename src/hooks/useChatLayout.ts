import { useState } from 'react';
import { useStore } from '@/context/storeContext';
import { Chat, User } from '@/types/auth';

export const useChatLayout = () => {
  const { chatStore, chatWindowStore } = useStore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Handle chat selection and opening from the chat list
  const handleChatSelect = async (chat: Chat) => {
    try {
      setSelectedChat(chat);
      await chatStore.selectChat(chat);
      // Also set the chat in the ChatWindowStore
      chatWindowStore.setCurrentChat(chat);
      setIsMobileView(true);
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  };

  const handleUserSelect = async (user: User) => {
    try {
      const chat = await chatStore.openOrCreateChat(user.id);
      setSelectedChat(chat);
      //chatStore.setActiveChat(chat);
      // Also set the chat in the ChatWindowStore
      chatWindowStore.setCurrentChat(chat);
      setShowUserSelector(false);
      setIsMobileView(true);
    } catch (error) {
      console.error('Failed to open chat:', error);
      throw error;
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    chatStore.setActiveChat(null);
    // Also clear the chat in the ChatWindowStore
    chatWindowStore.setCurrentChat(null);
    setIsMobileView(false);
  };

  const handleStartNewChat = () => {
    setShowUserSelector(true);
  };

  const handleGroupCreate = async (users: User[], groupName: string) => {
    try {
      const participantIds = users.map(user => Number(user.id));
      const chat = await chatStore.createGroupChat(groupName, participantIds);
      setSelectedChat(chat);
      // Also set the chat in the ChatWindowStore
      chatWindowStore.setCurrentChat(chat);
      setShowUserSelector(false);
      setIsMobileView(true);
    } catch (error) {
      console.error('Failed to create group chat:', error);
      throw error;
    }
  };

  const handleCloseUserSelector = () => {
    setShowUserSelector(false);
  };

  return {
    selectedChat,
    showUserSelector,
    isMobileView,
    handleChatSelect,
    handleUserSelect,
    handleGroupCreate,
    handleBackToList,
    handleStartNewChat,
    handleCloseUserSelector,
  };
};
