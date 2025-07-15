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
  const { chatWindowStore, chatStore, loginStore } = useStore();
  
  // Get current chat from store
  const currentChat = chatWindowStore.currentChat;
  
  if (!currentChat) {
    return null; // Don't render if no chat is set
  }

  const { displayName, otherParticipant } = chatWindowStore.getChatDisplayInfo();
  const currentUserId = loginStore.user?.id || 0;
  const isOtherOnline = chatStore.isOtherParticipantOnline(currentChat, currentUserId);
  const onlineCount = chatStore.getOnlineParticipantsCount(currentChat, currentUserId);

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

        {/* Avatar with elegant glow effect */}
        <div className="relative">
          {!currentChat.isGroup && (
            <div className="relative">
              {/* Glow background */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-500 blur-sm opacity-80 ${
                  isOtherOnline 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-glow-green' 
                    : 'bg-gradient-to-r from-red-300 to-rose-400 animate-glow-red'
                }`}
                style={{
                  transform: 'scale(1.15)'
                }}
              />
              
              {/* Profile picture foreground */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-black shadow-lg">
                {otherParticipant?.avatar ? (
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={otherParticipant.avatar}
                    alt={displayName}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-600">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Group chat avatar - enhanced design */}
          {currentChat.isGroup && (
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-400/30">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
          {!currentChat.isGroup && (
            <div className="flex items-center space-x-2 mt-1">
              <div 
                className={`flex items-center space-x-1.5 px-2 py-1 rounded-full transition-all duration-300 ${
                  isOtherOnline 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <div 
                  className={`w-2 h-2 rounded-full ${
                    isOtherOnline ? 'bg-green-500 animate-pulse' : 'bg-red-400'
                  }`}
                />
                <span className="text-sm font-medium">
                  {isOtherOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          )}
          {currentChat.isGroup && (
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-500 font-medium">
                {currentChat.participants.length} members
              </span>
              {onlineCount > 0 && (
                <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-green-100 text-green-700 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">
                    {onlineCount} online
                  </span>
                </div>
              )}
            </div>
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
