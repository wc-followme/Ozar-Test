'use client';

import { cn } from '@/lib/utils';
import { ArrowRight2 } from 'iconsax-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label='breadcrumb'
      className={cn(
        'flex items-center text-sm sm:text-base text-muted-foreground w-full',
        className
      )}
    >
      <div className='flex items-center w-full overflow-hidden'>
        <ol className='flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1'>
          {items.map(({ name, href }, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={index}
                className='flex items-center flex-shrink-0 min-w-0'
              >
                {index > 0 && (
                  <ArrowRight2
                    size='14'
                    className='mx-1 sm:mx-2 flex-shrink-0'
                    color='var(--text-secondary)'
                  />
                )}

                {isLast || !href ? (
                  <span className='text-[var(--primary)] font-medium flex-1 min-w-0'>
                    {name}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className='text-[var(--text-dark)] hover:underline hover:text-foreground transition-colors truncate max-w-[50px] sm:max-w-[70px] md:max-w-[100px] lg:max-w-[180px] flex-shrink-0'
                    title={name}
                  >
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

// example of usage
{
  /* 
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Team' }, // current page
]
<Breadcrumb items={breadcrumbData} className='mb-5' />
*/
}
