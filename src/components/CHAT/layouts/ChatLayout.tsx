"use client";
import React from 'react';
import { observer } from 'mobx-react-lite';
import ChatList from '../sections/ChatList';
import UserSelector from '../../chatSelection/UserSelector';
import { useChatLayout } from '@/hooks/useChatLayout';
import { useTheme } from '@/context/themeContext';

type ChatChildProps = {
  onClose: () => void;
};

interface ChatLayoutProps {
  children?: React.ReactNode;
}

const ChatLayout = observer(({ children }: ChatLayoutProps) => {
  const { theme } = useTheme();
  const {
    selectedChat,
    showUserSelector,
    isMobileView,
    handleChatSelect,
    handleUserSelect,
    handleBackToList,
    handleStartNewChat,
    handleCloseUserSelector,
  } = useChatLayout();

  return (
    <div className={`h-screen flex overflow-hidden ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      {/* Chat List Sidebar - Always visible on desktop, hidden when chat is selected on mobile */}
      <div className={`w-full lg:w-80 shadow-xl border-r flex flex-col ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-100'
      } ${
        isMobileView ? 'hidden lg:flex' : 'flex'
      }`}>
        {/* Fixed Header */}
        <div className={`flex-none p-6 border-b backdrop-blur-sm ${
          theme === 'dark'
            ? 'border-gray-700 bg-gray-800/80'
            : 'border-gray-100 bg-white/80'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-white to-gray-300'
                  : 'bg-gradient-to-r from-gray-900 to-gray-600'
              }`}>
                Messages
              </h1>
            </div>
            <button
              onClick={handleStartNewChat}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Start new chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ChatList onChatSelect={handleChatSelect} />
        </div>
      </div>

      {/* Main Content Area - Shows selected chat or welcome message */}
      <div className={`flex-1 flex flex-col ${
        isMobileView ? 'block' : selectedChat ? 'block' : 'hidden lg:flex'
      }`}>
        {selectedChat ? (
          // Render the chat content when a chat is selected
          <div className="h-full w-full flex flex-col bg-white shadow-lg">
            {React.Children.map(children, child => 
              React.isValidElement<ChatChildProps>(child) 
                ? React.cloneElement(child, { 
                    onClose: handleBackToList 
                  } )
                : child
            )}
          </div>
        ) : (
          // Welcome screen for desktop when no chat is selected
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-8">
            <div className="max-w-md">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-gray-700 to-gray-600'
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              }`}>
                <svg className={`h-16 w-16 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold bg-clip-text text-transparent mb-4 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-white to-gray-300'
                  : 'bg-gradient-to-r from-gray-900 to-gray-600'
              }`}>
                Welcome to Chat
              </h2>
              <p className={`mb-8 text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Select a conversation from the sidebar to start messaging, or create a new chat to connect with someone.
              </p>
              <button
                onClick={handleStartNewChat}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Selector Modal */}
      <UserSelector
        isOpen={showUserSelector}
        onUserSelect={handleUserSelect}
        onClose={handleCloseUserSelector}
      />
    </div>
  );
});

export default ChatLayout;
