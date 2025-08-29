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

interface MaterialListProps {
  materials: Material[];
  loading: boolean;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onCreateMaterial: () => void;
  canEdit: boolean;
}

export default function MaterialList({
  materials,
  loading,
  noDataDescription,
  menuOptions,
  onDelete,
  onEdit,
  onCreateMaterial,
  canEdit,
}: MaterialListProps) {
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
            <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
              <NoDataFound
                description={noDataDescription}
                buttonText='Create Material'
                onButtonClick={onCreateMaterial}
                showButton={canEdit}
              />
            </div>
          ) : (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
              {materials.map(material => {
                const { uuid, name, services } = material;
                return (
                  <InfoCard
                    key={uuid}
                    tradeName={name || ''}
                    category={`${services?.length || 0} Service${(services?.length || 0) !== 1 ? 's' : ''}`}
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
      {loading && materials.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
