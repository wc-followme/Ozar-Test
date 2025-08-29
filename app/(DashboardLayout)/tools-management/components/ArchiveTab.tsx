'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import { ConfirmRetrieveModal } from '@/components/shared/common/ConfirmRetrieveModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import ToolCardSkeleton from '@/components/shared/skeleton/ToolCardSkeleton';
import { APP_CONFIG } from '@/constants/common';
import { Tool } from '@/lib/api';
import { useEffect, useState } from 'react';

interface ArchiveTabProps {
  archivedTools: Tool[];
  archivedLoading: boolean;
  archiveHasMore: boolean;
  selectedTab: string;
  menuOptions: Array<{
    label: string;
    action: string;
    icon: any;
    variant: 'default' | 'destructive';
  }>;
  onDelete: (uuid: string) => void;
  onEdit: (uuid: string) => void;
  onRetrieve: (uuid: string) => void;
  onOpenCreateForm: () => void;
  canEdit: boolean;
  loadTools: (page: number, append: boolean) => Promise<void>;
  setArchivePage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ArchiveTab({
  archivedTools,
  archivedLoading,
  archiveHasMore,
  selectedTab,
  menuOptions,
  onDelete,
  onEdit,
  onRetrieve,
  onOpenCreateForm,
  canEdit,
  loadTools,
  setArchivePage,
}: ArchiveTabProps) {
  const [showRetrieve, setShowRetrieve] = useState(false);
  const [toolToRetrieve, setToolToRetrieve] = useState<{
    uuid: string;
    name: string;
  } | null>(null);

  // Handle retrieve action with confirmation
  const handleRetrieveClick = (uuid: string, name: string) => {
    setToolToRetrieve({ uuid, name });
    setShowRetrieve(true);
  };

  // Confirm retrieve action
  const handleConfirmRetrieve = () => {
    if (toolToRetrieve) {
      onRetrieve(toolToRetrieve.uuid);
      setShowRetrieve(false);
      setToolToRetrieve(null);
    }
  };

  // Infinite scroll for archive tab
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        if (selectedTab === 'archive' && !archivedLoading && archiveHasMore) {
          setArchivePage(prevPage => {
            const nextPage = prevPage + 1;
            loadTools(nextPage, true);
            return nextPage;
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedTab, archivedLoading, archiveHasMore, loadTools, setArchivePage]);

  if (archivedLoading && archivedTools.length === 0) {
    return (
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {[...Array(8)].map((_, i) => (
          <ToolCardSkeleton key={`tool-archive-skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (archivedTools.length === 0) {
    return (
      <div className='h-full md:h-[calc(100vh_-_220px)] w-full'>
        <NoDataFound
          title='Archived Tools'
          description='No archived tools found'
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
        {archivedTools.map((tool, index) => {
          const {
            id,
            name,
            brand_name,
            total_quantity,
            image_url,
            uuid,
            video_tutorial_urls,
            video_tutorial_link,
          } = tool as any;
          const imageUrl = image_url ? APP_CONFIG.CDN_URL + image_url : '';
          const videoCount =
            video_tutorial_urls?.length + video_tutorial_link?.length;
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
              onRetrieve={() => handleRetrieveClick(uuid, name)}
              uuid={uuid}
            />
          );
        })}
      </div>
      {archivedLoading && archivedTools.length > 0 && (
        <div className='text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      {/* Confirm Retrieve Modal */}
      <ConfirmRetrieveModal
        open={showRetrieve}
        title={`Are you sure you want to retrieve "${toolToRetrieve?.name}"?`}
        subtitle='This tool will be moved back to the active tools list.'
        onCancel={() => {
          setShowRetrieve(false);
          setToolToRetrieve(null);
        }}
        onRetrieve={handleConfirmRetrieve}
      />
    </>
  );
}
