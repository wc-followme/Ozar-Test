import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatsCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor: string;
  bgColor: string;
}

export function StatsCard({
  icon: IconComp,
  value,
  label,
  iconColor,
  bgColor,
}: StatsCardProps) {
  return (
    <Card className='border-[1px] border-[var(--border-dark)] bg-[var(--card-background)] shadow-sm sm:shadow-0 rounded-[24px] sm:rounded-[20px] transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2'>
          <div className='flex-1'>
            <p className='text-2xl sm:text-[18px] font-bold text-[var(--text-dark)] mb-2 leading-tight'>
              {value}
            </p>
            <p className='text-sm sm:text-base text-[var(--text-secondary)] font-medium sm:font-normal leading-relaxed sm:truncate'>
              {label}
            </p>
          </div>
          <div
            className={`w-12 h-12 sm:w-10 sm:h-10 rounded-[20px] sm:rounded-[16px] ${bgColor} ${iconColor} flex items-center justify-center shadow-lg sm:shadow-none transform hover:scale-110 sm:hover:scale-100 transition-transform duration-200`}
          >
            <IconComp className='w-6 h-6 sm:w-5 sm:h-5' color='currentcolor' />
          </div>
        </div>
        
        {/* Decorative line - mobile only */}
        <div className='mt-4 sm:hidden h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full opacity-50' />
      </CardContent>
    </Card>
  );
}
