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
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <div
      key={chat.id}
      onClick={() => onChatSelect(chat)}
      className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50 border-l-blue-500' 
          : 'border-l-transparent hover:border-l-gray-300'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {chat.isGroup ? (
            <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          ) : otherParticipant?.avatar ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={otherParticipant.avatar}
              alt={displayName}
            />
          ) : (
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Online indicator for direct chats */}
          {!chat.isGroup && otherParticipant?.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Chat info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            {lastMessage && (
              <p className="text-xs text-gray-500">
                {chatListStore.formatTime(lastMessage.createdAt)}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
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
