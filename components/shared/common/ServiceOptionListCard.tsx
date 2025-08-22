'use client';

import { ArrowRight2 } from 'iconsax-react';

interface ServiceOption {
  id: string;
  name: string;
  tradeTotal: number;
}

interface ServiceOptionListCardProps {
  serviceOptions: ServiceOption[];
  onServiceOptionSelect?: (option: ServiceOption) => void;
  formatCurrency: (amount: number) => string;
}

export default function ServiceOptionListCard({
  serviceOptions,
  onServiceOptionSelect,
  formatCurrency,
}: ServiceOptionListCardProps) {
  return (
    <div className='space-y-3'>
      {serviceOptions.map(option => (
        <div
          key={option.id}
          className='flex items-center justify-between p-4 border border-[var(--border-dark)] rounded-[10px] hover:bg-[var(--white-background)] cursor-pointer transition-colors'
          onClick={() => onServiceOptionSelect?.(option)}
        >
          <span className='font-normal text-[var(--text-dark)] text-base'>
            {option.name}
          </span>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-semibold text-[var(--text-dark)]'>
              Trade Total{' '}
              <span className='text-[var(--primary)]'>
                {formatCurrency(option.tradeTotal)}
              </span>
            </span>
            <span className='text-[var(--text-secondary)]'>
              <ArrowRight2 size={16} color='var(--text-dark)' />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
