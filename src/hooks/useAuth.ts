import { useEffect, useState } from 'react';
import { useStore } from '@/context/storeContext';
import { authApi } from '@/services/authApi';

/**
 * Hook to initialize authentication state on app load
 * This replaces the ProtectedRoute component functionality
 */
export const useAuthInitialization = () => {
  const { loginStore } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      try {
        // Skip if already initialized
        if (isInitialized) return;

        // Check if user is already authenticated
        const authStatus = await authApi.checkAuthStatus();
        
        if (authStatus.getCurrentUser) {
          // User is authenticated, update the store
          loginStore.setUser(authStatus.getCurrentUser);
          loginStore.setAuthenticated(true);
        } else {
          // User is not authenticated
          loginStore.setAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        loginStore.setAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    // Add a small delay to ensure hydration is complete
    const timeout = setTimeout(initializeAuth, 100);
    
    return () => clearTimeout(timeout);
  }, [loginStore, isInitialized]);

  return { isInitialized };
};

/**
 * Hook to check if user is authenticated
 * Returns the authentication state from the store
 */
export const useAuth = () => {
  const { loginStore } = useStore();
  
  return {
    isAuthenticated: loginStore.isAuthenticated,
    user: loginStore.user,
    isLoading: loginStore.isLoading
  };
};
