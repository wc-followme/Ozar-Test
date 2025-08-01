'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconShare } from '@tabler/icons-react';
import { DocumentText, Edit2, Star1 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';

const CompanyProfile = () => {
  return (
    <div className='rounded-[10px]'>
      {/* Cover Image Section */}
      <div className='relative w-full aspect-[5.25/1] min-h-[250px]'>
        {/* Cover Image */}
        <div className='w-full h-full'>
          <Image
            src='/images/profile-block-bg.png'
            alt='scaffolding'
            fill
            className='object-cover'
            priority
          />
        </div>

        {/* Change Cover Button */}
        <Button
          variant='secondary'
          size='sm'
          className='absolute top-4 right-4 btn-secondary !bg-[var(--white-background)] !px-[24px] text-[14px] !py-[10px] !h-9'
        >
          Change Cover
        </Button>
      </div>

      {/* Profile Section */}
      <div className='relative bg-[var(--white-background)]'>
        <div className='mx-auto'>
          <Card className='pl-[52px] pr-6 py-6 border-0'>
            <div className='flex flex-col md:flex-row items-start gap-4 md:gap-6 -mt-16'>
              {/* Logo */}
              <div className='relative'>
                <div className='w-[150px] h-[150px] rounded-2xl md:w-32 md:h-32 bg-[var(--card-background)] overflow-hidden p-2'>
                  <Image
                    src='/images/logo.svg'
                    height={150}
                    width={150}
                    alt='Envision Construction Logo'
                    className='w-full h-full object-contain'
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className='flex-1 min-w-0 pt-16'>
                <div className='space-y-2'>
                  <h1 className='text-[var(--text-dark)] text-2xl font-bold leading-[18px] tracking-[0%]'>
                    Envision Construction
                  </h1>
                  <p className='text-[var(--text-secondary)] text-base font-normal leading-[18px] tracking-[0%]'>
                    Construction Company
                  </p>

                  {/* Rating */}
                  <div className='flex items-center gap-2'>
                    <span className='text-[var(--text-dark)] text-base font-bold leading-[18px] tracking-[0%]'>
                      4.0
                    </span>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, index) => (
                        <Star1
                          key={index}
                          size='16'
                          color={index < 4 ? '#EBB402' : '#C0C6CD'}
                          className={
                            index < 4 ? 'fill-[#EBB402]' : 'fill-[#C0C6CD]'
                          }
                        />
                      ))}
                    </div>
                    <span className='text-gray-500 text-sm'>5 Reviews</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto self-end'>
                <Link
                  href='/company-profile/five-box-system'
                  className='btn-secondary text-[14px] gap-1 !px-[26px] !py-[10px] !h-9'
                >
                  <DocumentText
                    size='18'
                    color='var(--text-dark)'
                    className='[&_path]:!stroke-[2px]'
                  />
                  5-box system
                </Link>

                <Button
                  variant='secondary'
                  className='btn-secondary gap-1 !px-[26px] !py-[10px] !h-9'
                >
                  <IconShare
                    size='18'
                    color='var(--text-dark)'
                    className='[&_path]:!stroke-[2px]'
                  />
                  Share
                </Button>

                <Button
                  variant='secondary'
                  className='btn-secondary gap-1 !px-[26px] !py-[10px] !h-9'
                >
                  <Edit2
                    size='18'
                    color='var(--text-dark)'
                    className='[&_path]:!stroke-[2px]'
                  />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
