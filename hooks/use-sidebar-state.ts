'use client';

import { useEffect, useState } from 'react';

export const useSidebarState = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const detectSidebarWidth = () => {
      const sidebar = document.querySelector('aside');
      console.log(
        'useSidebarState - detectSidebarWidth called, sidebar found:',
        sidebar
      );

      if (sidebar) {
        const computedStyle = getComputedStyle(sidebar);
        const isVisible =
          computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden';
        console.log(
          'Sidebar visibility:',
          isVisible,
          'display:',
          computedStyle.display
        );

        if (isVisible) {
          const width = sidebar.classList.contains('w-[280px]') ? 280 : 94;
          console.log('Sidebar classes:', sidebar.className);
          console.log('Detected width:', width);
          setSidebarWidth(width);
        } else {
          console.log('Sidebar is hidden, setting width to 0');
          setSidebarWidth(0);
        }
      } else {
        console.log('No sidebar found, setting width to 0');
        setSidebarWidth(0);
      }
    };

    // Multiple attempts to detect sidebar
    const attempts = [50, 100, 200, 500];
    const timeouts = attempts.map(delay =>
      setTimeout(detectSidebarWidth, delay)
    );

    // Observer for changes
    const observer = new MutationObserver(detectSidebarWidth);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }

    window.addEventListener('resize', detectSidebarWidth);

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('resize', detectSidebarWidth);
    };
  }, []);

  return { sidebarWidth, isClient };
};
