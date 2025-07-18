"use client";
import { useAuthInitialization } from '@/hooks/useAuth';
import { HydrationProvider } from '@/context/hydrationContext';
import HydrationSafe from './HydrationSafe';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <HydrationProvider>
      <HydrationSafe>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </HydrationSafe>
    </HydrationProvider>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Initialize authentication state
  useAuthInitialization();
  
  return <>{children}</>;
}
