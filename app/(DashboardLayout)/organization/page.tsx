'use client';

import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { DisciplinaryTab } from './DisciplinaryTab';
import { DocumentTab } from './DocumentTab';
import { PromotionTab } from './PromotionTab';

export default function OrganizationPage() {
  const [selectedTab, setSelectedTab] = useState('promotion');

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className=''>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-dark)]'>
          Work Profile
        </h1>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] sm:max-w-full'>
          <DynamicScrollArea className='w-full'>
            <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
              <TabsTrigger
                value='promotion'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Promotion
              </TabsTrigger>
              <TabsTrigger
                value='document'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Document
              </TabsTrigger>
              <TabsTrigger
                value='disciplinary'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Disciplinary
              </TabsTrigger>
            </TabsList>
          </DynamicScrollArea>
        </div>

        <TabsContent value='promotion' className='pt-4 sm:pt-8'>
          <PromotionTab />
        </TabsContent>

        <TabsContent value='document' className='pt-4 sm:pt-8'>
          <DocumentTab />
        </TabsContent>

        <TabsContent value='disciplinary' className='pt-4 sm:pt-8'>
          <DisciplinaryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
