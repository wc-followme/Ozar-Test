import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Gallery, Location, MessageNotif, Sms } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
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
}

export function JobCard({ job }: JobCardProps) {
  const [imgSrc, setImgSrc] = useState(
    job.image || '/images/img-placeholder-md.png'
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-[var(--secondary)]';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const router = useRouter();

  // Handler for card click
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if clicking on Gallery or MessageNotif icons
    const target = e.target as HTMLElement;
    if (
      target.closest('.jobcard-gallery') ||
      target.closest('.jobcard-message')
    ) {
      return;
    }
    router.push(`/job-management/job-details/${job.id}`);
  };

  return (
    <Card
      className='border-1 border-[var(--border-dark)] shadow-lg sm:shadow-sm hover:shadow-card-hover bg-[var(--card-background)] transition-all duration-300 rounded-[16px] overflow-hidden cursor-pointer transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100'
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
            <span
              className={`h-3 w-3 rounded-full ${getProgressColor(job.progress)}`}
            ></span>
            {job.progress}%
          </Badge>
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
        </div>
        <div className='p-5'>
          <div className='mb-3'>
            <h3 className='font-semibold text-base text-[var(--text-dark)] mb-1 truncate'>
              {job.title}
            </h3>
            <p className='text-sm text-[var(--text-secondary)] font-normal'>
              {job.jobId}
            </p>
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
                {job.daysLeft} Days left
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
