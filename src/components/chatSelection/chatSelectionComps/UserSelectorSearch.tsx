import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@/context/themeContext';
import { useStore } from '@/context/storeContext';

const UserSelectorSearch = observer(() => {
  const { theme } = useTheme();
  const { userSelectorStore } = useStore();

  return (
    <div className="mt-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={userSelectorStore.searchTerm}
          onChange={(e) => userSelectorStore.setSearchTerm(e.target.value)}
          className={`w-full pl-12 pr-4 py-2.5 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
            theme === 'dark'
              ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 hover:bg-gray-700/70'
              : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 hover:bg-white/90'
          }`}
        />
        <svg className={`absolute left-4 top-3 h-5 w-5 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});

export default UserSelectorSearch;
