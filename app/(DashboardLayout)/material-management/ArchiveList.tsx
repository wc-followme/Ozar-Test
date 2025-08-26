'use client';

import { InfoCard } from '@/components/shared/cards/InfoCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import TradeCardSkeleton from '@/components/shared/skeleton/TradeCardSkeleton';
import { Material } from './material-types';

interface MenuOption {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}

interface ArchiveListProps {
  materials: Material[];
  loading: boolean;
  noDataTitle: string;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onRetrieve?: (uuid: string) => void;
}

export default function ArchiveList({
  materials,
  loading,
  noDataTitle,
  noDataDescription,
  menuOptions,
  onRetrieve,
}: ArchiveListProps) {

  return (
    <div className='w-full'>
      {materials.length === 0 && loading ? (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <TradeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {materials.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                title={noDataTitle}
                description={noDataDescription}
                buttonText=''
                showButton={false}
              />
            </div>
          ) : (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
              {materials.map((material) => {
                const { uuid, name, services } = material;
                return (
                  <InfoCard
                    key={uuid}
                    tradeName={name || ''}
                    category={`${services?.length || 0} Service${(services?.length || 0) !== 1 ? 's' : ''}`}
                    menuOptions={menuOptions}
                    onRetrieve={onRetrieve ? async () => onRetrieve(uuid) : undefined}
                    module='materials'
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {loading && materials.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
