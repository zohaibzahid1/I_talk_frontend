"use client";
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { usePathname } from 'next/navigation';
import { LocalStorageService } from '@/services/localStorageService';
import Navbar from './Navbar';

const ConditionalNavbar = observer(() => {
  const { loginStore } = useStore();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [shouldShowNavbar, setShouldShowNavbar] = useState(false);

  // Don't show navbar on login page, auth success page
  const hideNavbarRoutes = ['/login', '/auth/success'];

  useEffect(() => {
    setIsClient(true);
    
    // Check authentication status from local storage and login store
    const isAuthenticatedFromLocal = LocalStorageService.isAvailable() && LocalStorageService.getIsAuthenticated();
    const isAuthenticatedFromStore = loginStore.isAuthenticated;
    
    const isAuthenticated = isAuthenticatedFromLocal || isAuthenticatedFromStore;
    const shouldHide = hideNavbarRoutes.includes(pathname);
    
    setShouldShowNavbar(!shouldHide && isAuthenticated);
  }, [loginStore.isAuthenticated, pathname]);

  // Prevent hydration mismatch by not rendering on server
  if (!isClient) {
    return null;
  }

  if (!shouldShowNavbar) {
    return null;
  }

  return <Navbar />;
});

export default ConditionalNavbar;
