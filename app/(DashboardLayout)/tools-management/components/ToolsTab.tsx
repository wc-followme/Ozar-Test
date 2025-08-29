'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import ToolCardSkeleton from '@/components/shared/skeleton/ToolCardSkeleton';
import { APP_CONFIG } from '@/constants/common';
import { Tool } from '@/lib/api';
import { useEffect } from 'react';

interface ToolsTabProps {
  tools: Tool[];
  loading: boolean;
  hasMore: boolean;
  selectedTab: string;
  menuOptions: Array<{
    label: string;
    action: string;
    icon: any;
    variant: 'default' | 'destructive';
  }>;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onOpenCreateForm: () => void;
  canEdit: boolean;
  loadTools: (page: number, append: boolean) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ToolsTab({
  tools,
  loading,
  hasMore,
  selectedTab,
  menuOptions,
  onDelete,
  onEdit,
  onOpenCreateForm,
  canEdit,
  loadTools,
  setPage,
}: ToolsTabProps) {
  // Infinite scroll for tools tab
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (selectedTab === 'tools' && !loading && hasMore) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            loadTools(nextPage, true);
            return nextPage;
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedTab, loading, hasMore, loadTools, setPage]);

  if (loading && tools.length === 0) {
    return (
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {[...Array(8)].map((_, i) => (
          <ToolCardSkeleton key={`tool-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (tools.length === 0 && !loading) {
    return (
      <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
        <NoDataFound
          title='No Tools Found'
          description="You haven't created any tools yet. Start by adding your first one to organize your tools."
          buttonText='Add Tool'
          onButtonClick={onOpenCreateForm}
          showButton={canEdit}
        />
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {tools.map((tool, index) => {
          const {
            id,
            name,
            brand_name,
            total_quantity,
            image_url,
            video_tutorial_urls,
            video_tutorial_link,
            uuid,
          } = tool as any;
          const videoCount =
            video_tutorial_urls?.length + video_tutorial_link?.length;

          const imageUrl = image_url ? APP_CONFIG.CDN_URL + image_url : '';
          return (
            <ToolCard
              key={id ?? `${name}-${brand_name}-${index}`}
              image={imageUrl}
              name={name}
              brand={brand_name}
              quantity={total_quantity}
              videoCount={videoCount || 0}
              menuOptions={menuOptions}
              onDelete={() => onDelete(uuid)}
              onEdit={() => onEdit(uuid)}
              uuid={uuid}
            />
          );
        })}
      </div>
      {loading && tools.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}
    </>
  );
}
