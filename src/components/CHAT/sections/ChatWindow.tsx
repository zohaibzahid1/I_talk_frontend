"use client";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { useTheme } from '@/context/themeContext';
import ChatHeader from '../cards/ChatHeader';
import MessagesList from '../cards/MessagesList';
import MessageInput from '../cards/MessageInput';

interface ChatWindowProps {
  onClose?: () => void;
}

const ChatWindow = observer(({ onClose }: ChatWindowProps) => {
  const { chatStore, chatWindowStore } = useStore();
  const { theme } = useTheme();

  // Get current chat from store
  const currentChat = chatWindowStore.currentChat;

  const handleSendMessage = async (message: string) => {
    const chatId = chatWindowStore.currentChatId;
    if (!chatId) return;
    await chatStore.sendMessageToDB(chatId.toString(), message);
    // Also emit the message to socket using chat store
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Don't render if no chat is selected
  if (!currentChat) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Fixed Header */}
      <div className="flex-none">
        <ChatHeader onClose={handleClose} />
      </div>
      
      {/* Scrollable Messages - Remove overflow-hidden to allow scrolling */}
      <div className="flex-1 min-h-0">
        <MessagesList />
      </div>
      
      {/* Fixed Message Input */}
      <div className="flex-none">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
});

export default ChatWindow;
