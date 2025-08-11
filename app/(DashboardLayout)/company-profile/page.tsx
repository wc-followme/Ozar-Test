'use client';

import { CompanyBottomBlock } from '@/components/Templates/CompanyBottomBlock';
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
      <div className='relative w-full lg:aspect-[5.25/1] min-h-[250px] lg:min-h-max'>
        {/* Cover Image */}
        <div className='w-full h-full'>
          <Image
            src='/images/profile-block-bg.png'
            alt='scaffolding'
            fill
            className='object-cover rounded-tl-[10px] rounded-tr-[10px]'
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
          <Card className='px-4 lg:pl-[52px] lg:pr-6 py-6 border-0'>
            <div className='flex flex-col lg:flex-row items-start gap-4 md:gap-6 -mt-16'>
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
              <div className='flex-1 min-w-0 pt-4 lg:pt-16 w-full'>
                <div className='space-y-2'>
                  <h1 className='text-[var(--text-dark)] text-2xl font-bold leading-[18px] tracking-[0%]'>
                    Envision Construction
                  </h1>
                  <div className='flex flex-wrap items-end gap-2'>
                    <div>
                      <p className='text-[var(--text-secondary)] text-base font-normal leading-[18px] tracking-[0%] mb-2'>
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
                              className={
                                index < 4
                                  ? 'text-yellowbrand fill-yellowbrand'
                                  : 'text-placeholdergray fill-placeholdergray'
                              }
                            />
                          ))}
                        </div>
                        <span className='text-gray-500 text-sm'>5 Reviews</span>
                      </div>
                    </div>
                    <div className='flex gap-3 w-full md:w-auto ml-auto justify-end mt-4 lg:mt-0'>
                      <Link
                        href='/company-profile/five-box-system'
                        className='btn-secondary text-[14px] gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                      >
                        <DocumentText
                          size='18'
                          color='var(--text-dark)'
                          className='[&_path]:!stroke-[2px]'
                        />
                        <span className='hidden sm:inline'>5-box system</span>
                      </Link>

                      <Button
                        variant='secondary'
                        className='btn-secondary gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                      >
                        <IconShare
                          size='18'
                          color='var(--text-dark)'
                          className='[&_path]:!stroke-[2px]'
                        />
                        <span className='hidden sm:inline'>Share</span>
                      </Button>

                      <Button
                        variant='secondary'
                        className='btn-secondary gap-1 !px-0 sm:!px-[12px] xl:!px-[26px] !py-[10px] !w-9 sm:!w-auto !h-9 rounded-full'
                      >
                        <Edit2
                          size='18'
                          color='var(--text-dark)'
                          className='[&_path]:!stroke-[2px]'
                        />
                        <span className='hidden sm:inline'>Edit Profile</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
            </div>
          </Card>
        </div>
      </div>

      {/* Company Bottom Block with Tabs */}
      <CompanyBottomBlock />
    </div>
  );
};

export default CompanyProfile;
