'use client';

import { useRouter } from 'next/navigation';
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type RegistFormData = {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;
};

type ErrorResponse = {
  message: string;
};

type ContextTYpe = {
  isLoggedIn?: boolean;
  regist: (data: RegistFormData) => void;
  logout: VoidFunction;
  login: (email: string, password: string) => void;
};

const AuthContext = createContext<ContextTYpe>({} as ContextTYpe);

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>();
  const router = useRouter();

  const updateLoggedInStatus = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/profile', {
      method: 'GET',
      credentials: 'include',
    }).then((response) => {
      setIsLoggedIn(response.status === 200);
    });
  };

  const regist = (data: RegistFormData) => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/member/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data) as string,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.errors && res.errors.length) {
          res.errors.map((error: ErrorResponse) => alert(error.message));
        } else {
          router.push('/signin');
        }
      });
  };

  const logout = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      updateLoggedInStatus();
    });
  };

  const login = (email: string, password: string) => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/rcms-api/1/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }) as string,
    })
      .then((response) => {
        updateLoggedInStatus();
        return response.json();
      })
      .then((res) => {
        if (res.status !== 0 && res.errors) {
          res.errors.map((error: ErrorResponse) => alert(error.message));
        } else {
          setTimeout(() => {
            router.push('/news');
          }, 500);
        }
      });
  };

  useEffect(() => {
    updateLoggedInStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, regist, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);