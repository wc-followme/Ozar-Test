'use client';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Moon, Sun1 } from 'iconsax-react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size='icon'
      className='[&_svg]:size-6 md:[&_svg]:size-[32px] px-0'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Moon
        color='var(--text-dark)'
        variant='Outline'
        className='!!h-4 md:h-[1.2rem] w-4 md:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
      />
      <Sun1
        size='62'
        color='#FFF'
        variant='Outline'
        className='absolute h-8 w-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
      />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
