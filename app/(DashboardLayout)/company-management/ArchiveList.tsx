'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import CompanyCardSkeleton from '@/components/shared/skeleton/CompanyCardSkeleton';
import { formatDate } from '@/lib/utils';
import { Company, MenuOption } from './types';

interface ArchiveListProps {
  companies: Company[];
  loading: boolean;
  noDataTitle: string;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onRetrieve?: (uuid: string) => void;
  onToggle: (uuid: string, currentStatus: 'ACTIVE' | 'INACTIVE') => void;
}

export default function ArchiveList({
  companies,
  loading,
  noDataTitle,
  noDataDescription,
  menuOptions,
  onRetrieve,
  onToggle,
}: ArchiveListProps) {
  return (
    <div className='w-full'>
      {companies.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {companies.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound 
                title={noDataTitle} 
                description={noDataDescription} 
                buttonText='' 
                showButton={false} 
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {companies.map(
                ({
                  name,
                  created_at,
                  expiry_date,
                  image,
                  status,
                  is_default,
                  uuid,
                }) => (
                  <CompanyCard
                    key={uuid}
                    name={name}
                    createdOn={formatDate(created_at)}
                    subsEnd={formatDate(expiry_date)}
                    image={
                      image
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + image
                        : ''
                    }
                    status={status === 'ACTIVE'}
                    onToggle={() => onToggle(uuid, status)}
                    menuOptions={menuOptions}
                    isDefault={!!is_default}
                    companyUuid={uuid}
                    {...(onRetrieve && { onRetrieve: () => onRetrieve(uuid) })}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
      {loading && companies.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
