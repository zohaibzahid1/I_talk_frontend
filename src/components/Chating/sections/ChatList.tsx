"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { Chat } from '@/types/auth';
import ChatCard from '../cards/ChatCard';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
}

const ChatList = observer(({ onChatSelect }: ChatListProps) => {
  const { chatStore, loginStore, chatListStore } = useStore();

  useEffect(() => {
    if (loginStore.isAuthenticated) {
      // Load user chats when authenticated
      chatStore.loadUserChats();
    }
  }, [loginStore.isAuthenticated, chatStore]);

  // Loading state for chat list
  if (chatStore.isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading chats...</p>
      </div>
    );
  }

  // No chats yet
  if (chatStore.chats.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-gray-600 text-sm">No chats yet</p>
        <p className="text-gray-500 text-xs mt-1">Start a conversation to see your chats here</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chatStore.chats.map((chat) => {
        // check if the chat is opened in the chat window
        const isActive = chatStore.activeChat?.id === chat.id;
        
        return (
          <ChatCard
            key={chat.id}
            chat={chat}
            onChatSelect={onChatSelect}
            isActive={isActive}
            chatListStore={chatListStore}
          />
        );
      })}
    </div>
  );
});

export default ChatList;
