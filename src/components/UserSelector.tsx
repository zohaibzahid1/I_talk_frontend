"use client";
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { useTheme } from '@/context/themeContext';
import { usersApi } from '@/services/usersApi';
import { User } from '@/types/auth';

interface UserSelectorProps {
  onUserSelect: (user: User) => void;
  onClose: () => void;
  isOpen: boolean;
}

const UserSelector = observer(({ onUserSelect, onClose, isOpen }: UserSelectorProps) => {
  const { loginStore } = useStore();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await usersApi.getAllUsers();
      // Filter out current user
      const otherUsers = allUsers.filter(user => user.id !== loginStore.user?.id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border transform transition-all duration-300 scale-100 ${
        theme === 'dark'
          ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700/50 shadow-gray-900/50'
          : 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-gray-900/20'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
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
                Start New Chat
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
          
          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 hover:bg-gray-700/70'
                    : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 hover:bg-white/90'
                }`}
              />
              <svg className={`absolute left-4 top-3.5 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
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
          ) : filteredUsers.length === 0 ? (
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
                {searchTerm ? 'No users found' : 'No users available'}
              </p>
              <p className={`text-xs mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new users'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onUserSelect(user)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50 hover:shadow-gray-900/30'
                      : 'hover:bg-gray-50/80 hover:shadow-gray-200/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      {user.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover shadow-lg ring-2 ring-white"
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-sm font-bold text-white">
                            {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Online indicator */}
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
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
                        <p className={`text-xs mt-1 truncate ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {user.email}
                        </p>
                      )}
                      {user.isOnline && (
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <div className={`flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default UserSelector;
