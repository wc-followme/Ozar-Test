'use client';

import { HelmetIcon } from '@/components/icons/HelmetIcon';
import { RoleCard } from '@/components/shared/cards/RoleCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import RoleCardSkeleton from '@/components/shared/skeleton/RoleCardSkeleton';
import { roleIconOptions } from '@/constants/icon-options';
import { MenuOption, Role } from './types';

// Adapter for icons that expect className instead of size/color
const IconAdapter = (IconComp: any) => {
  const WrappedIcon = ({ color = '#00a8bf' }) => (
    <IconComp className='w-8 h-8' style={{ color }} />
  );
  WrappedIcon.displayName = `IconAdapter(${IconComp.displayName || IconComp.name || 'Component'})`;
  return WrappedIcon;
};

interface ArchiveListProps {
  roles: Role[];
  loading: boolean;
  noDataTitle: string;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onRetrieve?: (uuid: string) => void;
}

export default function ArchiveList({
  roles,
  loading,
  noDataTitle,
  noDataDescription,
  menuOptions,
  onRetrieve,
}: ArchiveListProps) {
  // Ensure icon options is always an array and has label property
  const safeIconOptions = Array.isArray(roleIconOptions) ? roleIconOptions : [];

  return (
    <div className='w-full'>
      {roles.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
          {[...Array(8)].map((_, i) => (
            <RoleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {roles.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound 
                title={noDataTitle} 
                description={noDataDescription} 
                buttonText='' 
                showButton={false} 
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl w-full gap-3 xl:gap-6'>
              {roles?.map(
                ({
                  uuid,
                  icon,
                  name,
                  description,
                  total_permissions,
                }) => {
                  // Use the icon component directly if it matches the expected signature
                  const iconOptionRaw = safeIconOptions.find(
                    (opt: any) => opt.value === icon
                  );
                  const iconOption = iconOptionRaw
                    ? {
                        ...iconOptionRaw,
                        icon: IconAdapter(iconOptionRaw.icon),
                      }
                    : {
                        icon: IconAdapter(HelmetIcon),
                        color: '#00a8bf',
                      };
                  return (
                    <div key={uuid}>
                      <RoleCard
                        menuOptions={menuOptions}
                        iconSrc={iconOption.icon}
                        iconBgColor={iconOption.color + '26'}
                        title={name}
                        description={description}
                        permissionCount={total_permissions || 0}
                        iconColor={iconOption.color}
                        {...(onRetrieve && { onRetrieve: () => onRetrieve(uuid) })}
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </>
      )}
      {loading && roles.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
