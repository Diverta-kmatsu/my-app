'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/auth';

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/news', '/contact'];

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check if the current path is a protected route or starts with a protected route prefix
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    // If not logged in and on a protected route, redirect to signin
    if (isLoggedIn === false && isProtectedRoute) {
      router.push('/signin');
    }

    setIsAuthChecked(true);
  }, [isLoggedIn, pathname, router]);

  // Don't render children until auth check is complete
  // This prevents flash of protected content before redirect
  if (!isAuthChecked) {
    return null;
  }

  // For protected routes, only render children if logged in
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && isLoggedIn === false) {
    return null;
  }

  return <>{children}</>;
}
