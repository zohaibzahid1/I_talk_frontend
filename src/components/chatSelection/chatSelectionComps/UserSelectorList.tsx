import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';
import { User } from '@/types/auth';
import UserSelectorItem from './UserSelectorItem';

interface UserSelectorListProps {
  onUserClick: (user: User) => void;
}

const UserSelectorList = observer(({ onUserClick }: UserSelectorListProps) => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  if (userSelectorStore.loading) {
    return (
      <div className="p-8 text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 mx-auto"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-transparent border-t-blue-300 border-r-purple-300 mx-auto opacity-20"></div>
        </div>
        <p className={`mt-4 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading users...
        </p>
      </div>
    );
  }

  if (userSelectorStore.filteredUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-700 to-gray-600'
            : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}>
          <svg className={`h-8 w-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
          </svg>
        </div>
        <p className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {userSelectorStore.searchTerm ? 'No users found' : 'No users available'}
        </p>
        <p className={`text-xs mt-1 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {userSelectorStore.searchTerm ? 'Try adjusting your search terms' : 'Check back later for new users'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3">
      {userSelectorStore.filteredUsers.map((user: User) => {
        const isSelected = userSelectorStore.selectedUsers.some((u: User) => u.id === user.id);
        return (
          <UserSelectorItem
            key={user.id}
            user={user}
            onUserClick={onUserClick}
          />
        );
      })}
    </div>
  );
});

export default UserSelectorList;
