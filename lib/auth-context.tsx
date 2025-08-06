'use client';

import { STORAGE_KEYS } from '@/constants/common';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiError, apiService, LoginResponse, User } from './api';
import { clearPermissionCache } from './permission-loader';
import { encryptData } from './utils';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshAccessToken: () => Promise<boolean>;
  handleAuthError: (error: any) => boolean; // Returns true if handled (401), false otherwise
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  // Helper function to get cookie
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  // Clear all authentication data
  const clearAuthData = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Define localStorage keys to clear
    const localStorageKeys = [
      STORAGE_KEYS.IS_AUTHENTICATED,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.DEVICE_ID,
      STORAGE_KEYS.USER_PERMISSIONS,
    ];

    // Clear localStorage
    localStorageKeys.forEach(key => localStorage.removeItem(key));

    // Clear cookies
    const cookieKeys = [
      STORAGE_KEYS.IS_AUTHENTICATED_COOKIE,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_PERMISSIONS,
    ];
    cookieKeys.forEach(key => deleteCookie(key));

    // Clear permission cache
    clearPermissionCache();
  };

  // Handle authentication errors (401 Unauthorized)
  const handleAuthError = (error: any): boolean => {
    // Check if this is a 401 error
    const { status, message } = error || {};
    const is401Error = status === 401 || (message && message.includes('401'));

    if (is401Error) {
      // Clear auth data immediately
      clearAuthData();

      // Redirect to login page
      router.push('/auth/login');

      return true; // Indicates this error was handled
    }

    return false; // Indicates this error was not handled
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuthStatus = () => {
      // Check both localStorage and cookies for backward compatibility
      const savedAuth =
        localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) ||
        getCookie(STORAGE_KEYS.IS_AUTHENTICATED_COOKIE);
      const savedUser =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        getCookie(STORAGE_KEYS.USER_DATA);
      const token =
        localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
        getCookie(STORAGE_KEYS.AUTH_TOKEN);

      const isAuthenticated = savedAuth === 'true';
      const hasUserData = savedUser && token;

      if (isAuthenticated && hasUserData) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // If parsing fails, clear everything
          logout();
        }
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
        const {
          user: loginUserData,
          access_token,
          refresh_token,
        } = response.data;

        // Destructure login user data for cleaner transformation
        const {
          id,
          uuid,
          first_name,
          last_name,
          email: userEmail,
          phone_number,
          profile_image,
          status,
          created_at,
          updated_at,
          role,
          company,
        } = loginUserData;
        console.log('loginUserData', loginUserData);
        const { id: role_id, uuid: role_uuid, name: role_name } = role;
        const { uuid: company_uuid, name: company_name } = company;
        // Transform login user data to match User interface
        const userData: User = {
          id,
          uuid,
          name: `${first_name} ${last_name}`.trim(),
          email: userEmail,
          country_code: '', // Not provided in login response
          phone_number,
          profile_picture_url: profile_image || '',
          status,
          created_at,
          updated_at,
          role: {
            id: Number(role_id) || 0,
            uuid: role_uuid,
            name: role_name,
          },
          company: {
            uuid: company_uuid,
            name: company_name,
          },
        };

        // Store authentication data in both localStorage and cookies
        setIsAuthenticated(true);
        setUser(userData);

        // Store in localStorage (for backward compatibility)
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

        // Store in cookies (for API access)
        setCookie(STORAGE_KEYS.IS_AUTHENTICATED_COOKIE, 'true');
        setCookie(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        setCookie(STORAGE_KEYS.AUTH_TOKEN, access_token);
        setCookie(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);

        // --- Fetch and securely store user permissions ---
        try {
          const permissionsRes = await apiService.getMyPermissions();
          if (permissionsRes && permissionsRes.data) {
            const { permissions } = permissionsRes.data;
            const encrypted = encryptData(JSON.stringify(permissions));
            localStorage.setItem(STORAGE_KEYS.USER_PERMISSIONS, encrypted);
            setCookie(STORAGE_KEYS.USER_PERMISSIONS, encrypted);
          }
        } catch (permErr) {
          // console.error('Failed to fetch/store user permissions:', permErr);
        }

        return { success: true };
      } else {
        const { message } = response;
        return {
          success: false,
          error: message || 'Login failed',
        };
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const { status, message, errors } = apiError;

      // Handle specific error cases
      if (status === 401) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      } else if (status === 422) {
        // Validation errors
        if (errors) {
          const errorMessages = Object.values(errors).flat();
          return {
            success: false,
            error: errorMessages.join(', '),
          };
        }
        return {
          success: false,
          error: message || 'Please check your input',
        };
      } else if (status === 0) {
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        return {
          success: false,
          error: message || 'An unexpected error occurred',
        };
      }
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (_) {
      // Ignore API errors, always clear local state
    }

    clearAuthData();

    // Redirect to login
    router.push('/auth/login');
  };

  // Auto refresh token when needed
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken =
        localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
        getCookie(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        await logout();
        return false;
      }

      const response = await apiService.refreshToken(refreshToken);
      if (response.statusCode === 200 && response.data) {
        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update stored tokens
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        setCookie(STORAGE_KEYS.AUTH_TOKEN, access_token);
        setCookie(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        return true;
      } else {
        await logout();
        return false;
      }
    } catch (_) {
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        refreshAccessToken,
        handleAuthError,
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
  const {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    refreshAccessToken,
    handleAuthError,
  } = context;
  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    refreshAccessToken,
    handleAuthError,
  };
}
