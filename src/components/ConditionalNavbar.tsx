"use client";
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import { usePathname } from 'next/navigation';
import Navbar from './UI/Navbar';

const ConditionalNavbar = observer(() => {
  const { loginStore } = useStore();
  const pathname = usePathname();

  // Don't show navbar on login page, auth success page, or when not authenticated
  const hideNavbarRoutes = ['/login', '/auth/success'];

  if (hideNavbarRoutes.includes(pathname) || !loginStore.isAuthenticated) {
    return null;
  }

  return <Navbar />;
});

export default ConditionalNavbar;
