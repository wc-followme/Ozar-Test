'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import { CompanyInfoTab } from './CompanyInfoTab';
import { PortfolioTab } from './PortfolioTab';
import { ReviewTab } from './ReviewTab';
import { TeamTab } from './TeamTab';
import { WarrantiesTab } from './WarrantiesTab';

const COMPANY_TABS = {
  COMPANY_INFO: 'company-info',
  TEAM: 'team',
  REVIEW: 'review',
  PORTFOLIO: 'portfolio',
  WARRANTIES: 'warranties',
} as const;

export const CompanyBottomBlock = () => {
  const [selectedTab, setSelectedTab] = useState<string>(
    COMPANY_TABS.COMPANY_INFO
  );

  const filterCounts = {
    company_info: 1,
    team: 5,
    review: 12,
    portfolio: 8,
    warranties: 3,
  };

  return (
    <div className='bg-[var(--white-background)] rounded-b-[10px] border-t border-[var(--border-dark)] w-full'>
      <div className='p-4 lg:p-6 w-full'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          {/* Mobile/Tablet Scrollable Tabs */}
          <div className='md:hidden'>
            <DynamicScrollArea
              className='flex-1 rounded-full min-w-0 max-w-full'
              widthOptions={{
                mobilePadding: 70,
                tabletPadding: 40,
                desktopPadding: 200,
                maxMobileWidth: 640,
                maxTabletWidth: 708,
                maxLargeTabletWidth: 1000,
                defaultDesktopWidth: 180,
                buttonWidth: 0,
                buttonWidthDesktop: 0,
              }}
            >
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full overflow-hidden shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                <TabsTrigger
                  value={COMPANY_TABS.COMPANY_INFO}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Company info
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={COMPANY_TABS.TEAM}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Team
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={COMPANY_TABS.REVIEW}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Review
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={COMPANY_TABS.PORTFOLIO}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Portfolio
                    </span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={COMPANY_TABS.WARRANTIES}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Warranties
                    </span>
                  </span>
                </TabsTrigger>
              </TabsList>
            </DynamicScrollArea>
          </div>

          {/* Desktop Equal-Width Tabs */}
          <div className='hidden md:block'>
            <TabsList className='flex w-full bg-[var(--dark-background)] p-1 rounded-[32px] h-auto font-normal justify-stretch border border-[var(--border-dark)]'>
              <TabsTrigger
                value={COMPANY_TABS.COMPANY_INFO}
                className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-base'>Company info</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={COMPANY_TABS.TEAM}
                className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-base'>Team</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={COMPANY_TABS.REVIEW}
                className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-base'>Review</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={COMPANY_TABS.PORTFOLIO}
                className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-base'>Portfolio</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value={COMPANY_TABS.WARRANTIES}
                className='px-6 py-[10px] flex-1 text-base gap-2 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-[28px] font-normal'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-base'>Warranties</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value={COMPANY_TABS.COMPANY_INFO}
            className='pt-6 max-w-full'
          >
            <CompanyInfoTab />
          </TabsContent>

          <TabsContent value={COMPANY_TABS.TEAM} className='pt-6'>
            <TeamTab />
          </TabsContent>

          <TabsContent value={COMPANY_TABS.REVIEW} className='pt-6'>
            <ReviewTab />
          </TabsContent>

          <TabsContent value={COMPANY_TABS.PORTFOLIO} className='pt-6'>
            <PortfolioTab />
          </TabsContent>

          <TabsContent value={COMPANY_TABS.WARRANTIES} className='pt-6'>
            <WarrantiesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
