'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

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
    <div className='bg-[var(--white-background)] rounded-b-[10px] border border-[var(--border-dark)] border-t-0'>
      <div className='p-6'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <TabsList className='flex w-full bg-[var(--dark-background)] p-1  rounded-[32px] h-auto font-normal justify-stretch border border-[var(--border-dark)]'>
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

          <TabsContent value={COMPANY_TABS.COMPANY_INFO} className='pt-6'>
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
