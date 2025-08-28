'use client';

import { CategoryCard } from '@/components/shared/cards/CategoryCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import CategoryCardSkeleton from '@/components/shared/skeleton/CategoryCardSkeleton';
import { catIconOptions } from '@/constants/icon-options';
import { Category, MenuOption } from './category-types';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  noDataDescription: string;
  menuOptions: MenuOption[];
  onToggle: (uuid: string, currentStatus: 'ACTIVE' | 'INACTIVE') => void;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onCreateCategory: () => void;
  canEdit: boolean;
}

export default function CategoryList({
  categories,
  loading,
  noDataDescription,
  menuOptions,
  onDelete,
  onEdit,
  onCreateCategory,
  canEdit,
}: CategoryListProps) {
  return (
    <div className='w-full'>
      {categories.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
          {[...Array(8)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {categories.length === 0 && !loading ? (
            <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
              <NoDataFound
                description={noDataDescription}
                buttonText='Create Category'
                onButtonClick={onCreateCategory}
                showButton={canEdit}
              />
            </div>
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {categories.map((category) => {
                const iconOption = catIconOptions.find(
                  opt => opt.value === category.icon
                ) || {
                  icon: () => null,
                  color: '#00a8bf',
                };
                return (
                  <CategoryCard
                    key={category.uuid}
                    name={category.name}
                    description={category.description}
                    iconSrc={props => {
                      const Icon = iconOption.icon;
                      const sizeClass = props.size
                        ? `w-[${props.size}px] h-[${props.size}px]`
                        : 'w-8 h-8';
                      const colorClass = props.color
                        ? `text-[${props.color}]`
                        : '';
                      return (
                        <Icon className={`${sizeClass} ${colorClass}`} />
                      );
                    }}
                    iconColor={iconOption.color}
                    iconBgColor={iconOption.color + '26'}
                    menuOptions={menuOptions}
                    categoryUuid={category.uuid}
                    onDelete={() => onDelete(category.uuid)}
                    onEdit={() => onEdit(category.uuid)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {loading && categories.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </div>
  );
}
