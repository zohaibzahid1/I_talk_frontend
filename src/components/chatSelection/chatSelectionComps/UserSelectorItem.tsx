import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';
import { User } from '@/types/auth';

interface UserSelectorItemProps {
  user: User;
  onUserClick: (user: User) => void;
}

const UserSelectorItem = observer(({ user, onUserClick }: UserSelectorItemProps) => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();
  
  const isSelected = userSelectorStore.selectedUsers.some((u: User) => u.id === user.id);

  return (
    <div
      onClick={() => onUserClick(user)}
      className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg border-2 ${
        userSelectorStore.isGroupMode
          ? isSelected
            ? theme === 'dark'
              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/20'
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 hover:from-blue-100 hover:to-purple-100 shadow-lg shadow-blue-200/50'
            : theme === 'dark'
              ? 'border-transparent hover:bg-gray-700/50 hover:shadow-gray-900/30 hover:border-gray-600/30'
              : 'border-transparent hover:bg-gray-50/80 hover:shadow-gray-200/50 hover:border-gray-200/50'
          : theme === 'dark'
            ? 'border-transparent hover:bg-gray-700/50 hover:shadow-gray-900/30 hover:border-gray-600/30'
            : 'border-transparent hover:bg-gray-50/80 hover:shadow-gray-200/50 hover:border-gray-200/50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
          <div className={`transition-all duration-200 ${
            userSelectorStore.isGroupMode && isSelected 
              ? 'ring-4 ring-blue-400/50 rounded-full' 
              : ''
          }`}>
            {user.avatar ? (
              <img
                className="h-11 w-11 rounded-full object-cover shadow-lg ring-2 ring-white"
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
              <div className={`h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                userSelectorStore.isGroupMode && isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                <span className="text-xs font-bold text-white">
                  {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Online indicator */}
          {user.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
          )}

          {/* Selection indicator for group mode */}
          {userSelectorStore.isGroupMode && isSelected && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce-in ring-2 ring-white shadow-lg">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.email
            }
          </p>
          {user.firstName && user.lastName && (
            <p className={`text-xs truncate ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {user.email}
            </p>
          )}
          {user.isOnline && (
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1.5"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          )}
        </div>

        {/* Selection checkbox or arrow indicator */}
        <div className={`flex-shrink-0 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {userSelectorStore.isGroupMode ? (
            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
              isSelected
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 shadow-lg'
                : theme === 'dark'
                  ? 'border-gray-500 hover:border-gray-400 hover:bg-gray-700/30'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white font-bold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ) : (
            <svg className="h-4 w-4 transition-transform duration-200 hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
});

export default UserSelectorItem;
