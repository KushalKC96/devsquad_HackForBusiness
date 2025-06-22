"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: 'guest' | 'host' | 'admin';
  fallbackPath?: string;
}

export function AuthGuard({ 
  children, 
  redirectTo = '/auth', 
  requireRole,
  fallbackPath = '/'
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not logged in, redirect to auth page with redirect parameter
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requireRole && user.role !== requireRole) {
        // User doesn't have the required role
        router.push(fallbackPath);
        return;
      }
    }
  }, [user, loading, router, redirectTo, requireRole, fallbackPath]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have required role
  if (!user || (requireRole && user.role !== requireRole)) {
    return null;
  }

  return <>{children}</>;
}
