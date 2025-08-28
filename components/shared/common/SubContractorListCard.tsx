import { Calendar } from 'iconsax-react';
import React from 'react';

interface SubContractorListCardProps {
  id: string;
  name: string;
  dateRange?: string;
  laborCost?: number;
  materialCost?: number;
  tradeTotal?: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const SubContractorListCard: React.FC<SubContractorListCardProps> = ({
  name,
  dateRange,
  laborCost,
  materialCost,
  tradeTotal,
}) => {
  const labor = typeof laborCost === 'number' ? laborCost : 400;
  const material = typeof materialCost === 'number' ? materialCost : 1735;
  const total = typeof tradeTotal === 'number' ? tradeTotal : labor + material;

  return (
    <div className='rounded-[10px] border border-[var(--border-dark)] bg-[var(--white-background)] p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <div className='text-[var(--text-dark)] font-semibold'>
            {name} -{' '}
            <span className='text-[var(--text-secondary)] font-normal'>
              2 services
            </span>
          </div>
          <div className='text-sm text-[var(--text-dark)] mt-1 flex items-center gap-2'>
            <Calendar size={20} color='var(--text-dark)' />
            <span>{dateRange || 'Mar 20 - Mar 23 (3D)'}</span>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-8 min-w-[420px]'>
          <div>
            <div className='text-[var(--text-dark)] font-semibold mb-1 text-sm'>
              Labor Cost
            </div>
            <div className='text-[var(--primary)] font-semibold text-lg'>
              {formatCurrency(labor)}
            </div>
          </div>
          <div>
            <div className='text-[var(--text-dark)] font-semibold mb-1 text-sm'>
              Material Cost
            </div>
            <div className='text-[var(--primary)] font-semibold text-lg'>
              {formatCurrency(material)}
            </div>
          </div>
          <div>
            <div className='text-[var(--text-dark)] font-semibold mb-1 text-sm'>
              Trade Total
            </div>
            <div className='text-[var(--primary)] font-semibold text-lg'>
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubContractorListCard;
