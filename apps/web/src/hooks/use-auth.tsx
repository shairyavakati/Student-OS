'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Profile } from '@/types/api';
import { authService } from '@/services/api-service';
import { toast } from 'sonner';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const me = await authService.getMe();
          setUser(me);
        } catch (err) {
          console.error('Failed to restore session', err);
          setUser(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (loading) return;

    const publicRoutes = [
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
      '/auth/otp-verification',
      '/auth/email-verification',
    ];

    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if (!user && !isPublic && pathname !== '/') {
      toast.error('Session expired or unauthorized. Please log in.');
      router.push('/auth/login');
    } else if (user && isPublic) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const login = async (data: any) => {
    try {
      setLoading(true);
      const tokens = await authService.login(data);
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      const me = await authService.getMe();
      setUser(me);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: any) => {
    try {
      setLoading(true);
      await authService.signup(data);
      toast.success('Account created! Logging in...');
      // Automatically login after signup
      await login({ email: data.email, password: data.password });
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
