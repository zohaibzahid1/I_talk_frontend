"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { useTheme } from '@/context/themeContext';
import { User } from '@/types/auth';

// Components
import UserSelectorHeader from './chatSelectionComps/UserSelectorHeader';
import UserSelectorSearch from './chatSelectionComps/UserSelectorSearch';
import UserSelectorToggle from './chatSelectionComps/UserSelectorToggle';
import UserSelectorGroupName from './chatSelectionComps/UserSelectorGroupName';
import UserSelectorList from './chatSelectionComps/UserSelectorList';
import UserSelectorFooter from './chatSelectionComps/UserSelectorFooter';

interface UserSelectorProps {
  onUserSelect: (user: User) => void;
  onGroupCreate?: (users: User[], groupName: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const UserSelector = observer(({ onUserSelect, onGroupCreate, onClose, isOpen }: UserSelectorProps) => {
  const { loginStore, userSelectorStore } = useStore();
  const { theme } = useTheme();

  useEffect(() => {
    userSelectorStore.setIsOpen(isOpen, String(loginStore.user?.id));  
  }, [isOpen, userSelectorStore]);

  const handleUserClick = (user: User) => {
    if (userSelectorStore.isGroupMode) {
      userSelectorStore.toggleUserSelection(user);
    } else {
      onUserSelect(user);
    }
  };

  const handleCreateGroup = () => {
    if (userSelectorStore.canCreateGroup && onGroupCreate) {
      onGroupCreate(userSelectorStore.selectedUsers, userSelectorStore.groupName.trim());
      userSelectorStore.close();
    }
  };

  const handleClose = () => {
    userSelectorStore.close();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col border transform transition-all duration-300 scale-100 ${
        theme === 'dark'
          ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700/50 shadow-gray-900/50'
          : 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-gray-900/20'
      }`}>
        
        {/* Header */}
        <UserSelectorHeader onClose={handleClose} />

        {/* Controls Section */}
        <div className={`px-4 pb-4 ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
        }`}>
          
          {/* Search */}
          <UserSelectorSearch />

          {/* Group Mode Toggle */}
          <UserSelectorToggle />

          {/* Group Name Input */}
          {userSelectorStore.isGroupMode && (
            <UserSelectorGroupName />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <UserSelectorList onUserClick={handleUserClick} />
        </div>

        {/* Footer with Create Group Button */}
        {userSelectorStore.isGroupMode && (
          <UserSelectorFooter onCreateGroup={handleCreateGroup} />
        )}
      </div>
    </div>
  );
});

export default UserSelector;
