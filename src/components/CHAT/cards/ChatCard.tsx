"use client";


// This component represents a chat card in the chat list
// It displays the chat information, avatar, and last message
// the user can click on the card to select the chat




import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { Chat } from '@/types/auth';
import { ChatListStore } from '@/stores/chatListStore';

interface ChatCardProps {
  chat: Chat;
  onChatSelect: (chat: Chat) => void;
  isActive: boolean;
  chatListStore: ChatListStore;
}

const ChatCard = observer(({ chat, onChatSelect, isActive, chatListStore }: ChatCardProps) => {
  const { chatStore, loginStore } = useStore();
  
  const otherParticipant = chatStore.getOtherParticipant(chat, loginStore.user?.id || 0);
  const displayName = chatStore.getChatDisplayName(chat, loginStore.user?.id || 0);
  const lastMessage = chat.lastMessage;

  return (
    <div
      key={chat.id}
      onClick={() => onChatSelect(chat)}
      className={`p-4 cursor-pointer border-l-4 transition-all duration-300 group hover:shadow-lg hover:shadow-gray-100/80 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500 shadow-md shadow-blue-100/50' 
          : 'border-l-transparent hover:border-l-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar with elegant glow effect */}
        <div className="relative flex-shrink-0">
          {!chat.isGroup && (
            <div className="relative">
              {/* Glow background */}
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-500 blur-sm opacity-75 ${
                  otherParticipant?.isOnline 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-glow-green' 
                    : 'bg-gradient-to-r from-red-300 to-rose-400 animate-glow-red'
                }`}
                style={{
                  transform: 'scale(1.1)'
                }}
              />
              
              {/* Profile picture foreground */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-black shadow-lg">
                {otherParticipant?.avatar ? (
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={otherParticipant.avatar}
                    alt={displayName}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-600">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Group chat avatar - no glow effect */}
          {chat.isGroup && (
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </p>
              {/* Online/Offline status text for direct chats */}
              {!chat.isGroup && (
                <span 
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full transition-all duration-300 ${
                    otherParticipant?.isOnline 
                      ? 'text-green-700 bg-green-100 shadow-sm' 
                      : 'text-red-600 bg-red-50'
                  }`}
                >
                  {otherParticipant?.isOnline ? 'online' : 'offline'}
                </span>
              )}
              {/* Group chat online count */}
              {chat.isGroup && chatStore.getOnlineParticipantsCount(chat, loginStore.user?.id || 0) > 0 && (
                <span className="text-xs font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full shadow-sm">
                  {chatStore.getOnlineParticipantsCount(chat, loginStore.user?.id || 0)} online
                </span>
              )}
            </div>
            {lastMessage && (
              <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                {chatListStore.formatTime(lastMessage.createdAt)}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {lastMessage 
              ? chatListStore.formatLastMessage(chat, loginStore.user?.id || 0)
              : 'No messages yet'
            }
          </p>
        </div>
      </div>
    </div>
  );
});

export default ChatCard;
