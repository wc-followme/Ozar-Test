import type { UserPermissions } from '@/lib/api';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface UsePermissionsReturn {
  permissions: UserPermissions | null;
  isLoading: boolean;
  hasPermission: (module: string, action: string) => boolean;
  refreshPermissions: () => void;
}

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPermissions = () => {
    try {
      const userPermissions = getUserPermissionsFromStorage();
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Failed to load permissions:', error);
      setPermissions(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = () => {
    setIsLoading(true);
    loadPermissions();
  };

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready and prevent flash
    const frameId = requestAnimationFrame(() => {
      loadPermissions();
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const hasPermission = (module: string, action: string): boolean => {
    if (!permissions) return false;

    const modulePermissions = permissions[module as keyof UserPermissions];
    if (!modulePermissions) return false;

    return modulePermissions[action as keyof typeof modulePermissions] || false;
  };

  return {
    permissions,
    isLoading,
    hasPermission,
    refreshPermissions,
  };
}
