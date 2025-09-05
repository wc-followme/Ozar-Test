import { ConfirmRetrieveModal } from '@/components/shared/common/ConfirmRetrieveModal';
import Dropdown from '@/components/shared/common/Dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { APP_CONFIG, ROUTES, SHARE_MESSAGES } from '@/constants/common';
import { IconDotsVertical } from '@tabler/icons-react';
import { Calendar, Gallery, Location, MessageNotif, Refresh2, Sms } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ChainIcon } from '../../icons/ChainIcon';
import { CurvedBgIcon } from '../../icons/CurvedBgIcon';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    jobId: string;
    progress: number;
    image: string;
    email: string;
    address: string;
    startDate: string;
    daysLeft: number;
  };
  badgeStatus?: {
    status?: string;
    progress?: number;
    text?: string;
  };
  jobCreatedDay?: number | undefined;
  jobDaysLeft?: number | undefined;
  onRestoreJob?: (id: string) => void;
  showRestoreButton?: boolean;
  isArchiveTab?: boolean;
  isNewLeadsTab?: boolean;
  menuOptions?: Array<{
    label: string;
    action: string;
    icon?: React.ElementType;
    disabled?: boolean;
  }>;
  onMenuAction?: (action: string) => void;
}

export function JobCard({ job, onRestoreJob, menuOptions, onMenuAction, isArchiveTab, isNewLeadsTab, badgeStatus, jobCreatedDay, jobDaysLeft }: JobCardProps) {
  const [imgSrc, setImgSrc] = useState(
    job.image || '/images/img-placeholder-md.png'
  );
  const [showRetrieveConfirm, setShowRetrieveConfirm] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  // Default menu options if none provided
  const defaultMenuOptions = [
    {
      label: 'Retrieve',
      action: 'retrieve',
      icon: Refresh2,
    },
  ];

  const finalMenuOptions = menuOptions || defaultMenuOptions;

  // Handle menu actions
  const handleMenuAction = (action: string) => {
    if (action === 'retrieve') {
      setShowRetrieveConfirm(true);
    }
    if (onMenuAction) {
      onMenuAction(action);
    }
  };

  // Handle retrieve confirmation
  const handleRetrieveConfirm = () => {
    if (onRestoreJob) {
      onRestoreJob(job.id);
    }
    setShowRetrieveConfirm(false);
  };

  //TODO: This function is used in next milestone
  // const getProgressColor = (progress: number) => {
  //   if (progress >= 90) return 'bg-[var(--secondary)]';
  //   if (progress >= 70) return 'bg-blue-500';
  //   if (progress >= 50) return 'bg-yellow-500';
  //   return 'bg-orange-500';
  // };

  const StatusBadge =(status: string) => {
    
    if (status === 'form_not_submitted') return 'bg-[var(--warning)]';
    if (status === 'discussing_estimate') return 'bg-blue-500';
    if (status === 'waiting_for_client') return 'bg-yellow-500';
    if (status === 'waiting_for_sub') return 'bg-orange-500';
    if (status === 'waiting_for_vendor') return 'bg-green-500';
    if (status === 'archived') return 'bg-[var(--warning)]';
    if (status === 'closed') return 'bg-[var(--secondary)]';
    return 'bg-gray-500';
  }

  const router = useRouter();
  
  // Destructure constants
  const { BASE_URL } = APP_CONFIG;
  const { HOME_OWNER } = ROUTES;
  const { URL_COPIED_SUCCESS, COPY_FAILED_ERROR } = SHARE_MESSAGES;
  
  // Helper function to generate home-owner link
  const generateHomeOwnerLink = (jobId: string) =>
    `${BASE_URL}${HOME_OWNER}/${jobId}`;
  
  // Handle copy link functionality
  const handleCopyLink = async () => {
    try {
      const jobLink = generateHomeOwnerLink(job.id);
      await navigator.clipboard.writeText(jobLink);
      showSuccessToast(URL_COPIED_SUCCESS);
    } catch (error) {
      showErrorToast(COPY_FAILED_ERROR);
    }
  };
 
  // Handler for card click
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if clicking on Gallery, MessageNotif icons, or dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest('.jobcard-gallery') ||
      target.closest('.jobcard-message') ||
      target.closest('[data-radix-popper-content-wrapper]') ||
      target.closest('[role="menu"]') ||
      target.closest('button')
    ) {
      return;
    }

    // Prevent navigation if clicking on Archive tab
    if(isArchiveTab) {
      return;
    }else{
    router.push(`/job-management/job-details/${job.id}`);
    }
  };

  return (
    <Card
      className={`border-1 border-[var(--border-dark)] shadow-lg sm:shadow-sm hover:shadow-card-hover bg-[var(--card-background)] transition-all duration-300 rounded-[16px] overflow-hidden ${isArchiveTab ? 'cursor-default' : 'cursor-pointer'} transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100`}
      onClick={handleCardClick}
    >
      <CardContent className='p-0'>
        <div className='relative'>
          <Image
            src={imgSrc}
            alt={job.title}
            width={400}
            height={200}
            className='w-full h-40 xl:h-48 object-cover rounded-t-lg'
            onError={() => setImgSrc('/images/img-placeholder-md.png')}
          />
          <Badge
            className={`absolute top-3 left-3 text-[12px]  font-medium gap-1 p-1 rounded-[30px] text-[var(--text-dark)] border-0 bg-[var(--white-background)] hover:bg-[var(--white-background)]`}
          >
            {/* <span className={`h-3 w-3 rounded-full ${getProgressColor(job.progress)}`}></span> */}
            <span className={`h-3 w-3 rounded-full ${StatusBadge(badgeStatus?.status || '')}`}></span>
            {badgeStatus?.text}
          </Badge>    
       { !isArchiveTab && !isNewLeadsTab &&(
          <div className='absolute right-0 bottom-0 h-5 xl:h-[2.5rem] w-[4rem] xl:w-[6rem] flex justify-center items-center gap-2 xl:gap-3'>
            <CurvedBgIcon className='absolute -bottom-[2px] right-0 h-8 xl:h-[44px] w-[80px] xl:w-[110px] text-[var(--card-background)]' />
            <Link
              href={''}
              className='relative jobcard-gallery'
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              <Gallery size='20' color='var(--text-dark)' />
            </Link>
            <Link
              href={''}
              className='relative jobcard-message'
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              <MessageNotif size='20' color='var(--text-dark)' />
            </Link>
          </div>
          )}
        </div>
        <div className='p-5'>
          <div className='mb-3'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-base text-[var(--text-dark)] mb-1 truncate'>
                  {job.title}
                </h3>
                <p className='text-sm text-[var(--text-secondary)] font-normal'>
                  {job.jobId}
                </p>
              </div>
              { isArchiveTab &&(
                <Dropdown
                  menuOptions={finalMenuOptions}
                  onAction={handleMenuAction}
                  trigger={
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 flex-shrink-0'
                      onClick={e => e.stopPropagation()}
                    >
                      <IconDotsVertical
                        className='!w-6 !h-6'
                        strokeWidth={2}
                        color='var(--text-dark)'
                      />
                    </Button>
                  }
                  align='end'
                />
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-[var(--text-dark)] font-normal'>
              <Sms
                size='22'
                className='flex-shrink-0 text-yellowbrand'
                color='currentColor'
              />
              <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                {job.email}
              </span>
            </div>
            <div className='flex items-center gap-2 text-sm text-[var(--text-dark)] font-normal'>
              <Location
                size='22'
                className='flex-shrink-0 text-greenbrand'
                color='currentColor'
              />
              <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                {job.address}
              </span>
            </div>
            { isArchiveTab &&(
              <div className='flex items-center'>
                <div className='flex items-center gap-1 text-sm text-[var(--text-dark)] font-normal'>
                  <Calendar size='22' color='#24338C' className='flex-shrink-0' />
                  <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                    {job.startDate}
                  </span>
                </div>
                <Badge
                  variant='outline'
                  className='text-xs ml-auto px-3 py-[3px] text-[12px] font-medium text-[var(--text-dark)] bg-[var(--border-light)] border-0 overflow-hidden text-ellipsis whitespace-nowrap'
                >
                  {jobDaysLeft} Days left
                </Badge>
              </div>
            )}
            { isNewLeadsTab &&(
              <div className='space-y-2'>
                <Badge
                  variant='outline'
                  className='text-xs ml-auto px-3 py-[3px] text-[12px] font-medium text-[var(--text-dark)] bg-[var(--border-light)] border-0 overflow-hidden text-ellipsis whitespace-nowrap'
                >
                  Job Created {jobCreatedDay == 0 ? 'Today' : (jobCreatedDay == 1 ? 'Yesterday' : jobCreatedDay + ' Days ago')}
                </Badge>
                <Button 
                  variant='outline' 
                  className='btn-secondary w-full'
                  onClick={handleCopyLink}
                >
                  <ChainIcon className='mr-2' />
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Retrieve Confirmation Modal */}
      <ConfirmRetrieveModal
        open={showRetrieveConfirm}
        title="Retrieve Job"
        subtitle="Are you sure you want to retrieve this job? This will move it back to active status."
        onCancel={() => setShowRetrieveConfirm(false)}
        onRetrieve={handleRetrieveConfirm}
      />
    </Card>
  );
}
