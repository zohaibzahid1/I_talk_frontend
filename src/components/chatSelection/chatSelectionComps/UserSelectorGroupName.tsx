import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';

const UserSelectorGroupName = observer(() => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  return (
    <div className="mt-3 animate-fade-in">
      <input
        type="text"
        placeholder="Enter group name..."
        value={userSelectorStore.groupName}
        onChange={(e) => userSelectorStore.setGroupName(e.target.value)}
        maxLength={50}
        className={`w-full px-4 py-2.5 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
          theme === 'dark'
            ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 hover:bg-gray-700/70'
            : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 hover:bg-white/90'
        }`}
      />
    </div>
  );
});

export default UserSelectorGroupName;
