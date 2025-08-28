'use client';

import { InfoCard } from '@/components/shared/cards/InfoCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import TradeCardSkeleton from '@/components/shared/skeleton/TradeCardSkeleton';
import { Service } from './service-types';

interface MenuOption {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onCreateService: () => void;
  canEdit: boolean;
}

export default function ServiceList({
  services,
  loading,
  noDataDescription,
  menuOptions,
  onDelete,
  onEdit,
  onCreateService,
  canEdit,
}: ServiceListProps) {
  return (
    <div className='w-full'>
      {services.length === 0 && loading ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <TradeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {services.length === 0 && !loading ? (
            <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
              <NoDataFound
                description={noDataDescription}
                buttonText='Create Service'
                onButtonClick={onCreateService}
                showButton={canEdit}
              />
            </div>
          ) : (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
              {services.map(service => {
                const { uuid, name, trades } = service;
                return (
                  <InfoCard
                    key={uuid}
                    tradeName={name || ''}
                    category={`${trades?.length || 0} Trade${(trades?.length || 0) !== 1 ? 's' : ''}`}
                    menuOptions={menuOptions}
                    onEdit={() => onEdit(uuid)}
                    onDelete={() => onDelete(uuid)}
                    module='catalogue_services'
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {loading && services.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
