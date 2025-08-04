'use client';
import { clsx, type ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// --- Encryption Utilities ---
import CryptoJS from 'crypto-js';

// Encrypts a string using AES and a secret key from env
export function encryptData(data: string): string {
  const key =
    process.env['NEXT_PUBLIC_PERMISSIONS_ENCRYPTION_KEY'] ||
    'fallback-key-for-development-32-chars';
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Decrypts a string using AES and a secret key from env
export function decryptData(ciphertext: string): string {
  const key =
    process.env['NEXT_PUBLIC_PERMISSIONS_ENCRYPTION_KEY'] ||
    'fallback-key-for-development-32-chars';
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extracts a user-friendly error message from API error responses
export function extractApiErrorMessage(
  err: any,
  fallback = 'An error occurred.'
) {
  if (err?.details?.message) return err.details.message;
  if (err?.message) return err.message;
  return fallback;
}

// Extracts success message from API response
export function extractApiSuccessMessage(
  response: any,
  fallback = 'Operation completed successfully.'
) {
  if (response?.message) return response.message;
  return fallback;
}

// Formats a date string to DD/MM/YYYY format (e.g., "30/08/2024")
// This is the standard date format used across all modules
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  } catch (_) {
    return dateString; // Return original string if parsing fails
  }
}

// Formats a date string to include time in DD/MM/YYYY HH:mm format
export function formatDateTime(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (_) {
    return dateString; // Return original string if parsing fails
  }
}

// Get user permissions from localStorage or cookies (decrypted)
export function getUserPermissionsFromStorage():
  | import('@/lib/api').UserPermissions
  | null {
  let encrypted = '';
  if (typeof window !== 'undefined') {
    encrypted = localStorage.getItem('user_permissions') || '';
    if (!encrypted) {
      // Try cookies
      const match = document.cookie.match(/(?:^|; )user_permissions=([^;]*)/);
      if (match && match[1]) encrypted = decodeURIComponent(match[1]);
    }
  }
  if (!encrypted) return null;
  try {
    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

/**
 * Calculates dynamic width for responsive components based on screen size
 * @param options Configuration options for width calculation
 * @returns Calculated width in pixels as a string
 */
export const calculateDynamicWidth = (
  options: {
    mobilePadding?: number;
    tabletPadding?: number;
    desktopPadding?: number;
    maxMobileWidth?: number;
    maxTabletWidth?: number;
    maxLargeTabletWidth?: number;
    defaultDesktopWidth?: number;
    buttonWidth?: number;
    buttonWidthDesktop?: number;
  } = {}
) => {
  if (typeof window === 'undefined') return '320px';

  const {
    mobilePadding = 32,
    tabletPadding = 48,
    desktopPadding = 64,
    maxMobileWidth = 640,
    maxTabletWidth = 768,
    maxLargeTabletWidth = 1024,
    defaultDesktopWidth = 320,
    buttonWidth = 0,
    buttonWidthDesktop = 0,
  } = options;

  const screenWidth = window.innerWidth;

  // Mobile devices (up to maxMobileWidth)
  if (screenWidth <= maxMobileWidth) {
    const availableWidth = screenWidth - mobilePadding - buttonWidth;
    return `${Math.max(availableWidth, 200)}px`; // Minimum 200px width
  }
  // Small tablets (maxMobileWidth + 1 to maxTabletWidth)
  else if (screenWidth <= maxTabletWidth) {
    const availableWidth = Math.min(
      screenWidth - tabletPadding - buttonWidth,
      400
    );
    return `${Math.max(availableWidth, 250)}px`; // Minimum 250px width
  }
  // Medium tablets (maxTabletWidth + 1 to maxLargeTabletWidth)
  else if (screenWidth <= maxLargeTabletWidth) {
    const availableWidth = Math.min(
      screenWidth - desktopPadding - buttonWidthDesktop,
      500
    );
    return `${Math.max(availableWidth, 300)}px`; // Minimum 300px width
  }
  // Desktop (maxLargeTabletWidth + 1 and above)
  else {
    const availableWidth = defaultDesktopWidth - buttonWidthDesktop;
    return `${Math.max(availableWidth, 200)}px`; // Minimum 200px width
  }
};

/**
 * Hook for dynamic width calculation with resize listener
 * @param options Configuration options for width calculation
 * @returns Current calculated width
 */
export const useDynamicWidth = (
  options?: Parameters<typeof calculateDynamicWidth>[0]
) => {
  const [width, setWidth] = useState('320px');

  useEffect(() => {
    const updateWidth = () => {
      setWidth(calculateDynamicWidth(options));
    };

    // Set initial width
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', updateWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateWidth);
  }, [options]);

  return width;
};
