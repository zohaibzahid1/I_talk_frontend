"use client";
import React, { useEffect, ReactNode, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/authApi';
import LoadingSpinner from './UI/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = observer(({ children, fallback }: ProtectedRouteProps) => {
  const { loginStore } = useStore();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Handle SSR hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Don't run on server side

    const verifyToken = async () => {
      try {
        setIsVerifying(true);
        
        // If user is already authenticated from local storage, verify the token
        if (loginStore.isAuthenticated) {
          const isValidToken = await authApi.validateToken();
          
          if (!isValidToken) {
            // Token is invalid, clear everything and redirect
            loginStore.setAuthenticated(false);
            loginStore.setUser(null);
            router.push('/login');
            return;
          }
          // Token is valid, user can stay authenticated
          return;
        }
        
        // If not authenticated locally, try to validate token anyway (in case cookie exists)
        const isValidToken = await authApi.validateToken();
        
        if (isValidToken) {
          // Token is valid, get user data
          await loginStore.checkAuthStatus();
        } else {
          // Token is invalid, redirect to login
          loginStore.setAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        loginStore.setAuthenticated(false);
        loginStore.setUser(null);
        router.push('/login');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [loginStore, router, isClient]);

  // Show loading during SSR or while verifying token
  if (!isClient || isVerifying || loginStore.isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // If user is not authenticated after verification, don't render children
  if (!loginStore.isAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  // If user is authenticated, render the children
  return <>{children}</>;
  });

export default ProtectedRoute;
