import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';

interface UserSelectorHeaderProps {
  onClose: () => void;
}

const UserSelectorHeader = observer(({ onClose }: UserSelectorHeaderProps) => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  return (
    <div className={`p-4 border-b ${
      theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {userSelectorStore.isGroupMode ? 'Create Group Chat' : 'Start New Chat'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-xl transition-all duration-200 hover:scale-105 ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default UserSelectorHeader;
