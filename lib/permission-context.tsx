'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { UserPermissions } from './api';
import {
  clearPermissionCache,
  getCachedPermissions,
  preloadPermissions,
} from './permission-loader';

interface PermissionContextType {
  permissions: UserPermissions | null;
  isLoading: boolean;
  hasPermission: (module: string, action: string) => boolean;
  refreshPermissions: () => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(() => {
    // Initialize with cached permissions if available
    return getCachedPermissions();
  });
  const [isLoading, setIsLoading] = useState(() => {
    // Start with loading state if no cached permissions
    return getCachedPermissions() === null;
  });

  const loadPermissions = async () => {
    try {
      const userPermissions = await preloadPermissions();
      setPermissions(userPermissions);
    } catch (error) {
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = () => {
    clearPermissionCache();
    setIsLoading(true);
    loadPermissions();
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!permissions) return false;

    const modulePermissions = permissions[module as keyof UserPermissions];
    if (!modulePermissions) return false;

    return modulePermissions[action as keyof typeof modulePermissions] || false;
  };

  useEffect(() => {
    // Only load if not already cached
    if (getCachedPermissions() === null) {
      loadPermissions();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        isLoading,
        hasPermission,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}
