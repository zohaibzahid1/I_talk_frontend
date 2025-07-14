"use client";


// This component displays the list of messages in a chat
// and handles the display of messages, avatars, and timestamps



import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';



const MessagesList = observer(() => {
  const { chatWindowStore, loginStore, chatStore } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current chat and messages from store
  const currentChat = chatWindowStore.currentChat;
  const messages = chatStore.activeChatMessages;

  // Reference to the end of the messages list for scrolling
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keep track of previous message count to detect new messages
  const prevMessageCountRef = useRef<number>(0);

  // when messages change, scroll to the bottom
  useEffect(() => {
    if (messages) {
      const currentMessageCount = messages.length;
      const hadMessages = prevMessageCountRef.current > 0;
      
      // Always scroll to bottom when:
      // 1. First time loading messages (no previous messages)
      // 2. New messages are added (count increased)
      if (!hadMessages || currentMessageCount > prevMessageCountRef.current) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
      
      prevMessageCountRef.current = currentMessageCount;
    }
  }, [messages, messages?.length]);

  // Set current user ID when user changes
  useEffect(() => {
    chatWindowStore.setCurrentUserId(Number(loginStore.user?.id) || 0);
  }, [loginStore.user?.id, chatWindowStore]);

  // Return null if no chat is set
  if (!currentChat) {
    return null;
  }

  // Get processed data from store
  const processedMessages = chatWindowStore.getProcessedMessages(messages);
  const emptyState = chatWindowStore.getEmptyStateData(messages);

  return (
    <div className="h-full overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* Check if there are no messages in the chat */}
      {!emptyState.hasMessages ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">{emptyState.emptyMessage}</p>
          <p className="text-gray-500 text-sm mt-2">{emptyState.emptySubMessage}</p>
        </div>
      ) : (
        <>
          {processedMessages.map((processedMessage) => {
            const { message, index, isOwnMessage, showDateSeparator } = processedMessage;
            const avatarData = chatWindowStore.getMessageSenderAvatar(message, isOwnMessage);
            const bubbleData = chatWindowStore.getMessageBubbleData(isOwnMessage);
            const groupSenderInfo = chatWindowStore.getGroupSenderInfo(message, isOwnMessage, currentChat.isGroup);

            return (
              <div key={`${message.id}-${index}`} className="animate-fade-in">
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                      <span className="text-xs text-gray-600 font-medium">
                        {chatWindowStore.formatMessageDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className={bubbleData.containerClass}>
                  <div className="flex items-end space-x-3 max-w-xs lg:max-w-md">
                    {avatarData && (
                      <div className="flex-shrink-0 mb-1">
                        {avatarData.hasAvatar ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                            src={avatarData.avatarUrl}
                            alt={avatarData.altText}
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-white">
                              {avatarData.fallbackText}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`${bubbleData.bubbleClass} shadow-sm ${
                      isOwnMessage 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      {groupSenderInfo.shouldShowSender && (
                        <p className="text-xs font-semibold mb-1 text-gray-700">
                          {groupSenderInfo.senderName}
                        </p>
                      )}
                      <p className={`text-sm leading-relaxed ${
                        isOwnMessage ? 'text-white' : 'text-gray-900'
                      }`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {chatWindowStore.formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Scroll anchor - always at the bottom */}
          <div ref={messagesEndRef} className="h-1" />
        </>
      )}
    </div>
  );
});

export default MessagesList;
