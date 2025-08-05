import { Card } from '@/components/ui/card';
import { IconGripVertical } from '@tabler/icons-react';
import { Calendar } from 'iconsax-react';
import React from 'react';
import { Label } from '../../ui/label';

interface Trade {
  id: string;
  name: string;
  services: number;
  dateRange: string;
  type: string;
  laborCost: number;
  materialCost: number;
  tradeTotal: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  lineTotal: number;
  serviceTotal: number;
  tradeTotal: number;
}

interface TradeListCardComponentProps {
  trade?: Trade;
  service?: Service;
  onClick?: () => void;
  className?: string;
  variant?: 'trade' | 'service';
}

export const TradeListCardComponent: React.FC<TradeListCardComponentProps> = ({
  trade,
  service,
  onClick,
  className = '',
  variant = 'trade',
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Determine which data to use based on variant
  const isService = variant === 'service' && service;
  const isTrade = variant === 'trade' && trade;

  if (!isTrade && !isService) {
    return null;
  }

  return (
    <Card
      className={`p-4 bg-[var(--white-background)] rounded-[10px] border-0 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className='flex items-center'>
        {/* Drag Handle */}
        <div className='flex flex-col space-y-1 mr-4'>
          <IconGripVertical size={24} color='var(--text-secondary)' />
        </div>

        {/* Content Information */}
        <div className='flex-1'>
          <div className='flex items-center space-x-4'>
            <div>
              <div className='flex items-center space-x-1 mb-1'>
                <h3 className='font-semibold text-[var(--text-dark)]'>
                  {isService ? service!.name : trade!.name}
                </h3>
                {isTrade && (
                  <p className='text-[var(--text-secondary)]'>
                    - {trade!.services} services
                  </p>
                )}
              </div>

              {isTrade ? (
                <div className='flex items-center space-x-1 text-sm text-[var(--text-dark)]'>
                  <Calendar size={20} color='var(--text-secondary)' />
                  <span>
                    {trade!.dateRange || 'No date set'} ({trade!.type})
                  </span>
                </div>
              ) : (
                <p className='text-sm text-[var(--text-secondary)]'>
                  {service!.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className='flex space-x-6'>
          {isTrade ? (
            <>
              <div className=''>
                <Label className='field-label text-xs'>Labor Cost</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(trade!.laborCost)}
                </p>
              </div>
              <div className=''>
                <Label className='field-label text-xs'>Material Cost</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(trade!.materialCost)}
                </p>
              </div>
              <div className=''>
                <Label className='field-label text-xs'>Trade Total</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(trade!.tradeTotal)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className=''>
                <Label className='field-label text-xs'>Line Total</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(service!.lineTotal)}
                </p>
              </div>
              <div className=''>
                <Label className='field-label text-xs'>Service Total</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(service!.serviceTotal)}
                </p>
              </div>
              <div className=''>
                <Label className='field-label text-xs'>Trade Total</Label>
                <p className='text-sm font-semibold text-[var(--primary)]'>
                  {formatCurrency(service!.tradeTotal)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
