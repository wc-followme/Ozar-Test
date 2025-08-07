import { CUSTOM_EVENTS, STORAGE_KEYS } from '@/constants/common';
import { useEffect, useRef } from 'react';

export const useCompanyChange = (refetchFunction: () => void) => {
  const selectedCompanyRef = useRef<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Get initial company from localStorage
    const selectedCompany = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
    if (selectedCompany) {
      try {
        const parsedCompany = JSON.parse(selectedCompany);
        selectedCompanyRef.current = parsedCompany.id;
      } catch (error) {
        console.error('Error parsing selected company:', error);
      }
    }

    // Initial fetch on mount
    if (!isInitialized.current) {
      isInitialized.current = true;
      refetchFunction();
    }

    // Listen for company change events
    const handleCompanyChange = () => {
      const currentCompany = localStorage.getItem(
        STORAGE_KEYS.SELECTED_COMPANY
      );
      let currentCompanyId: string | null = null;

      if (currentCompany) {
        try {
          const parsedCompany = JSON.parse(currentCompany);
          currentCompanyId = parsedCompany.id;
        } catch (error) {
          console.error('Error parsing selected company:', error);
        }
      }

      // If company has changed, refetch data
      if (selectedCompanyRef.current !== currentCompanyId) {
        selectedCompanyRef.current = currentCompanyId;
        refetchFunction();
      }
    };

    // Listen for both custom events
    window.addEventListener(CUSTOM_EVENTS.COMPANY_CHANGED, handleCompanyChange);
    window.addEventListener(CUSTOM_EVENTS.STORAGE, handleCompanyChange);

    return () => {
      window.removeEventListener(
        CUSTOM_EVENTS.COMPANY_CHANGED,
        handleCompanyChange
      );
      window.removeEventListener(CUSTOM_EVENTS.STORAGE, handleCompanyChange);
    };
  }, [refetchFunction]);

  return selectedCompanyRef.current;
};
