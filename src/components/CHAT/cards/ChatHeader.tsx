"use client";


// This component represents the header of a chat window
// It displays the chat title, avatar, and online status





import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';

interface ChatHeaderProps {
  onClose?: () => void;
}

const ChatHeader = observer(({ onClose }: ChatHeaderProps) => {
  const { chatWindowStore } = useStore();
  
  // Get current chat from store
  const currentChat = chatWindowStore.currentChat;
  
  if (!currentChat) {
    return null; // Don't render if no chat is set
  }

  const { displayName, otherParticipant } = chatWindowStore.getChatDisplayInfo();

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Back button for mobile */}
        <button
          onClick={() => onClose && onClose()}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative">
          {currentChat.isGroup ? (
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          ) : otherParticipant?.avatar ? (
            <img
              className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-white"
              src={otherParticipant.avatar}
              alt={displayName}
            />
          ) : (
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          {!currentChat.isGroup && otherParticipant?.isOnline && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          {!currentChat.isGroup && otherParticipant?.isOnline && (
            <p className="text-sm text-green-600 font-medium">Online</p>
          )}
          {currentChat.isGroup && (
            <p className="text-sm text-gray-500 font-medium">{currentChat.participants.length} members</p>
          )}
        </div>
      </div>

      {/* Close button for desktop */}
      <button
        onClick={() => onClose && onClose()}
        className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

export default ChatHeader;
