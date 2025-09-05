'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { JOB_MESSAGES } from '../job-messages';
import { Job } from '../types';
import { JobGrid, JobSkeletonGrid } from './shared/JobGridComponents';

interface ArchiveTabProps {
  jobs: Job[];
  loading: boolean;
  tabLoading: boolean;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onCreateJob: () => void;
  onRestoreJob: (uuid: string) => void;
  isArchiveTab?: boolean;
}



export const ArchiveTab = ({
  jobs,
  loading,
  tabLoading,
  onScroll,
  onCreateJob,
  onRestoreJob,
  isArchiveTab=true,
}: ArchiveTabProps) => {
  return (
    <TabsContent value='archive' className='pt-4 sm:pt-8'>
      <ScrollArea
        className='h-[calc(100vh_-_276px)]'
        onScroll={onScroll}
      >
        {jobs.length === 0 && (loading || tabLoading) ? (
          // Show skeleton for initial loading or tab loading
          <JobSkeletonGrid />
        ) : jobs.length === 0 && !loading && !tabLoading ? (
          <NoDataFound
            description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
            buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
            onButtonClick={onCreateJob}
          />
        ) : (
          <>
            <JobGrid jobs={jobs} onRestoreJob={onRestoreJob} isArchiveTab={isArchiveTab} />
            {/* Loading more jobs */}
            {tabLoading && jobs.length > 0 && (
              <div className='w-full text-center py-4'>
                <LoadingComponent variant='inline' size='md' text={''} />
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </TabsContent>
  );
};
