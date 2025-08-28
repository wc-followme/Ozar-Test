'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import CompanyCardSkeleton from '@/components/shared/skeleton/CompanyCardSkeleton';
import { formatDate } from '@/lib/utils';
import { Company, MenuOption } from './types';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onToggle: (uuid: string, currentStatus: 'ACTIVE' | 'INACTIVE') => void;
  onDelete: (uuid: string) => void;
  onCreateCompany: () => void;
  canEdit: boolean;
}

export default function CompanyList({
  companies,
  loading,
  noDataDescription,
  menuOptions,
  onToggle,
  onDelete,
  onCreateCompany,
  canEdit,
}: CompanyListProps) {
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
                description={noDataDescription}
                buttonText='Add Company'
                onButtonClick={onCreateCompany}
                showButton={canEdit}
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
                    onDelete={() => onDelete(uuid)}
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
