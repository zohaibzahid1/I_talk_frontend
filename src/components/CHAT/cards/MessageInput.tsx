"use client";


// This component handles the input for sending messages in a chat
// input bar


import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

const MessageInput = observer(({ onSendMessage }: MessageInputProps) => {
  const { chatWindowStore } = useStore();

  // Get current chat from store
  const currentChat = chatWindowStore.currentChat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatWindowStore.newMessage.trim() || chatWindowStore.isLoading || !currentChat) return;

    const messageContent = chatWindowStore.newMessage.trim();
    chatWindowStore.clearMessage();
    chatWindowStore.setIsLoading(true);

    try {
      await onSendMessage(messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore the message input on failure
      chatWindowStore.setNewMessage(messageContent);
    } finally {
      chatWindowStore.setIsLoading(false);
    }
  };

  // Return null if no chat is set
  if (!currentChat) {
    return null;
  }

  return (
    <div className="flex-none bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => {
            // Handle attachment click
            console.log('Attachment button clicked');
          }}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={chatWindowStore.newMessage}
            onChange={(e) => chatWindowStore.setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={chatWindowStore.isLoading}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white/90 backdrop-blur-sm placeholder-gray-500 text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md"
          />
          
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => {
              // Handle emoji click
              console.log('Emoji button clicked');
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!chatWindowStore.newMessage.trim() || chatWindowStore.isLoading}
          className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 shadow-sm ${
            chatWindowStore.newMessage.trim() && !chatWindowStore.isLoading
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {chatWindowStore.isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
});

export default MessageInput;
