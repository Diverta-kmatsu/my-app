'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';

const useRequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // More aggressive redirect for static exports
    if (isLoggedIn === false) {
      // Immediate redirect
      router.push('/signin');
    }
  }, [isLoggedIn, router, pathname]);

  return isLoggedIn;
};

export default useRequireAuth;