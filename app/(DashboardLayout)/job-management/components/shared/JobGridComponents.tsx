'use client';

import { JobCard } from '@/components/shared/cards/JobCard';
import { JobCardSkeleton } from '@/components/shared/skeleton/JobCardSkeleton';
import { Job } from '../../types';


interface JobGridComponentsProps {
  jobs: Job[];
  badgeStatus?: {
    status?: string;
    text?: string;
  };
  jobCreatedDay?: number;
  jobDaysLeft?: number;
  onRestoreJob?: (uuid: string) => void;
  isArchiveTab?: boolean;
  isNewLeadsTab?: boolean;
}

// Shared job grid component
export const JobGrid = ({ jobs,  onRestoreJob, isArchiveTab, isNewLeadsTab }: JobGridComponentsProps) => (
  
  <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
    {jobs.map((job: Job) => {
      console.log('jobs===>', job.jobCreatedDay);
      // Destructure job data for cleaner code
      const {
        uuid,
        client_name,
        project_id,
        job_image,
        client_email,
        client_address,
        project_start_date,
        badgeStatus,
        jobCreatedDay,
        jobDaysLeft
      } = job;

      return (
        <JobCard
          key={uuid}
          job={{
            id: uuid,
            title: client_name || '-',
            jobId: project_id || '-',
            progress: 50, // Static value since not in API
            image:
              job_image ||'/images/img-placeholder-md.png',
            email: client_email || '-',
            address: client_address || '-',
            startDate: project_start_date
              ? new Date(project_start_date).toLocaleDateString()
              : '-',
            daysLeft: jobDaysLeft || 0
          }}
          jobCreatedDay={jobCreatedDay}
          jobDaysLeft={jobDaysLeft}
          {...(badgeStatus && { badgeStatus })}
          {...(onRestoreJob && isArchiveTab && {
            onRestoreJob,
            showRestoreButton: true,
            isArchiveTab
          })}
          {...(isNewLeadsTab && {
            isNewLeadsTab
          })}
        />
      );
    })}
  </div>
);

// Shared job skeleton grid component
export const JobSkeletonGrid = () => (
  <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
    {[...Array(4)].map((_, index) => (
      <JobCardSkeleton key={`job-skeleton-${index}`} />
    ))}
  </div>
);
