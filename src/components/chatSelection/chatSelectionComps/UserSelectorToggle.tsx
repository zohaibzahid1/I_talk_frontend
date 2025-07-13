import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';

const UserSelectorToggle = observer(() => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={userSelectorStore.isGroupMode}
              onChange={(e) => userSelectorStore.setIsGroupMode(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out ${
              userSelectorStore.isGroupMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                : theme === 'dark'
                  ? 'bg-gray-600 group-hover:bg-gray-500'
                  : 'bg-gray-300 group-hover:bg-gray-400'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center ${
                userSelectorStore.isGroupMode ? 'translate-x-7' : 'translate-x-0'
              }`}>
                {userSelectorStore.isGroupMode ? (
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                  }`}></div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Create Group Chat
            </span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {userSelectorStore.isGroupMode ? 'Select multiple users' : 'Toggle to create groups'}
            </span>
          </div>
        </label>

        {/* Selected Users Count */}
        {userSelectorStore.isGroupMode && userSelectorStore.selectionCount > 0 && (
          <div className="animate-fade-in">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
              theme === 'dark'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {userSelectorStore.selectionCount} selected
              {userSelectorStore.selectionCount >= 2 && userSelectorStore.groupName.trim() && (
                <span className="ml-1 text-green-600">✓</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default UserSelectorToggle;
