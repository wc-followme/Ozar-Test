import type { UserPermissions } from './api';
import { getUserPermissionsFromStorage } from './utils';

// Global permission cache to prevent multiple loads
let permissionCache: UserPermissions | null = null;
let isLoading = false;
let loadPromise: Promise<UserPermissions | null> | null = null;

export async function preloadPermissions(): Promise<UserPermissions | null> {
  // Return cached permissions if available
  if (permissionCache !== null) {
    return permissionCache;
  }

  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;
  loadPromise = new Promise(resolve => {
    try {
      const permissions = getUserPermissionsFromStorage();
      permissionCache = permissions;
      resolve(permissions);
    } catch (error) {
      permissionCache = null;
      resolve(null);
    } finally {
      isLoading = false;
      loadPromise = null;
    }
  });

  return loadPromise;
}

export function getCachedPermissions(): UserPermissions | null {
  return permissionCache;
}

export function clearPermissionCache(): void {
  permissionCache = null;
  loadPromise = null;
  isLoading = false;
}

export function isPermissionLoading(): boolean {
  return isLoading;
}
