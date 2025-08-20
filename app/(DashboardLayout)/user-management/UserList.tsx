'use client';

import { UserCard } from '@/components/shared/cards/UserCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import UserCardSkeleton from '@/components/shared/skeleton/UserCardSkeleton';
import { CommonStatus } from '@/constants/common';
import { User } from '@/lib/api';
import { MenuOption } from './types';

interface UserListProps {
  users: User[];
  loading: boolean;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onToggle: (id: number, currentStatus: boolean) => void;
  onDelete: (uuid: string) => void;
  onRetrieve?: (uuid: string) => void;
}

export default function UserList({
  users,
  loading,
  noDataDescription,
  menuOptions,
  onToggle,
  onDelete,
  onRetrieve,
}: UserListProps) {
  return (
    <div className='w-full'>
      {users.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-4 sm:gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {users.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                title=''
                description={noDataDescription}
                buttonText=''
                showButton={false}
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-4 sm:gap-3 xl:gap-6'>
              {users.map(
                ({
                  uuid,
                  name,
                  role,
                  phone_number,
                  email,
                  profile_picture_url,
                  status,
                  id,
                }) => (
                  <UserCard
                    key={uuid}
                    name={name}
                    role={role?.name || ''}
                    phone={phone_number}
                    email={email}
                    image={
                      profile_picture_url
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') +
                          profile_picture_url
                        : ''
                    }
                    status={status === CommonStatus.ACTIVE}
                    onToggle={() =>
                      onToggle(id, status === CommonStatus.ACTIVE)
                    }
                    menuOptions={menuOptions}
                    onDelete={() => onDelete(uuid)}
                    onRetrieve={onRetrieve ? () => onRetrieve(uuid) : undefined}
                    disableActions={loading}
                    userUuid={uuid}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
      {loading && users.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
