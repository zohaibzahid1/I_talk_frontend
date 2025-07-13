import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';

interface UserSelectorFooterProps {
  onCreateGroup: () => void;
}

const UserSelectorFooter = observer(({ onCreateGroup }: UserSelectorFooterProps) => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  const getButtonText = () => {
    if (userSelectorStore.selectionCount < 2) {
      return `Select ${2 - userSelectorStore.selectionCount} more user${2 - userSelectorStore.selectionCount === 1 ? '' : 's'}`;
    }
    if (!userSelectorStore.groupName.trim()) {
      return 'Enter group name';
    }
    return `Create Group (${userSelectorStore.selectionCount} members)`;
  };

  return (
    <div className={`p-3 border-t ${
      theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
    }`}>
      <button
        onClick={onCreateGroup}
        disabled={!userSelectorStore.canCreateGroup}
        className={`w-full py-2.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 ${
          userSelectorStore.canCreateGroup
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
            : theme === 'dark'
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {getButtonText()}
      </button>
    </div>
  );
});

export default UserSelectorFooter;
