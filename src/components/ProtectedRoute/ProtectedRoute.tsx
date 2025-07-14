"use client";
import React, { useEffect, useState, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/authApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useStore } from '@/context/storeContext';


interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = observer(({ children, fallback }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking, true = authenticated, false = not authenticated
  const router = useRouter();
  const loginStore = useStore().loginStore;

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Start validation and minimum loading time in parallel
        const [isValid] = await Promise.all([
          authApi.validateToken(),
          new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms loading
        ]);
        
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          loginStore.setAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return fallback || <LoadingSpinner />;
  }

  // If user is authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Return null while redirecting to login
  return null;
});

export default ProtectedRoute;
