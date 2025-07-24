'use client';

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
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('device_id');
    localStorage.removeItem('user_permissions');
    // Clear cookies
    deleteCookie('is_authenticated');
    deleteCookie('user_data');
    deleteCookie('auth_token');
    deleteCookie('refresh_token');
    deleteCookie('user_permissions');
    // Clear permission cache
    clearPermissionCache();
  };

  // Handle authentication errors (401 Unauthorized)
  const handleAuthError = (error: any): boolean => {
    // Check if this is a 401 error
    if (
      error?.status === 401 ||
      (error instanceof Error && error.message?.includes('401'))
    ) {
      console.log('🔑 Authentication error detected, logging out user');

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
        localStorage.getItem('isAuthenticated') ||
        getCookie('is_authenticated');
      const savedUser = localStorage.getItem('user') || getCookie('user_data');
      const token =
        localStorage.getItem('auth_token') || getCookie('auth_token');

      if (savedAuth === 'true' && savedUser && token) {
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

        // Transform login user data to match User interface
        const userData: User = {
          id: loginUserData.id,
          uuid: '', // Login response doesn't include UUID
          role_id: loginUserData.role_id,
          company_id: '', // Not provided in login response
          name: `${loginUserData.first_name} ${loginUserData.last_name}`.trim(),
          email: loginUserData.email,
          country_code: '', // Not provided in login response
          phone_number: loginUserData.phone_number,
          profile_picture_url: loginUserData.profile_image || '',
          status: loginUserData.status,
          created_at: loginUserData.created_at,
          updated_at: loginUserData.updated_at,
          role: {
            id: loginUserData.role_id,
            name: '', // Not provided in login response
          },
          company: {
            id: '',
            name: '',
          },
        };

        // Store authentication data in both localStorage and cookies
        setIsAuthenticated(true);
        setUser(userData);

        // Store in localStorage (for backward compatibility)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Store in cookies (for API access)
        setCookie('is_authenticated', 'true');
        setCookie('user_data', JSON.stringify(userData));
        setCookie('auth_token', access_token);
        setCookie('refresh_token', refresh_token);

        console.log(
          '✅ Authentication data stored in both localStorage and cookies'
        );

        // --- Fetch and securely store user permissions ---
        try {
          const permissionsRes = await apiService.getMyPermissions();
          if (permissionsRes && permissionsRes.data) {
            const encrypted = encryptData(
              JSON.stringify(permissionsRes.data.permissions)
            );
            localStorage.setItem('user_permissions', encrypted);
            setCookie('user_permissions', encrypted);
            console.log('🔒 User permissions encrypted and stored');
          }
        } catch (permErr) {
          console.error('Failed to fetch/store user permissions:', permErr);
        }

        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed',
        };
      }
    } catch (error: unknown) {
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

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
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
        localStorage.getItem('refresh_token') || getCookie('refresh_token');
      if (!refreshToken) {
        await logout();
        return false;
      }

      const response = await apiService.refreshToken(refreshToken);
      if (response.statusCode === 200 && response.data) {
        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update stored tokens
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);
        setCookie('auth_token', access_token);
        setCookie('refresh_token', newRefreshToken);

        return true;
      } else {
        await logout();
        return false;
      }
    } catch (err) {
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
  return context;
}
