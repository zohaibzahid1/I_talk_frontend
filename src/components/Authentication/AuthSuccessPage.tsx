"use client";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { useRouter} from 'next/navigation';

const AuthSuccessPage = observer(() => {
  const { loginStore } = useStore();
  const router = useRouter();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      

      try {
        loginStore.setLoading(true);
        loginStore.clearError();
        
        // Check authentication status to get user data
        loginStore.checkAuthStatus(true);
        
        // Only redirect if authentication was successful
        if (loginStore.isAuthenticated) {
          router.push('/');
        } else {
          // If not authenticated, redirect to login
          loginStore.setError('Authentication failed. Please try again.');
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Auth success error:', error);
        loginStore.setError('Authentication failed. Please try again.');
        loginStore.setLoading(false);
        
        // Redirect back to login
        router.push('/login');
      }
    };

    handleAuthSuccess();
  }, [loginStore, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Completing your login...
        </h2>
        <p className="text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
});

export default AuthSuccessPage;
