'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { apiService, type ApiError, type LoginResponse } from './api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  status: string;
  role_id: number;
  device_token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = () => {
      const savedAuth = localStorage.getItem('isAuthenticated');
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (savedAuth === 'true' && savedUser && token) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: LoginResponse = await apiService.login(email, password);

      // Check for successful response using statusCode
      if (response.statusCode === 200 && response.data) {
        const { user: userData, access_token } = response.data;

        // Store authentication data
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', access_token);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed',
        };
      }
    } catch (error) {
      const apiError = error as ApiError;

      // Handle specific error cases
      if (apiError.status === 401) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      } else if (apiError.status === 422) {
        // Validation errors
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          return {
            success: false,
            error: errorMessages.join(', '),
          };
        }
        return {
          success: false,
          error: apiError.message || 'Please check your input',
        };
      } else if (apiError.status === 0) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: apiError.message || 'An unexpected error occurred',
        };
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('device_id');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
