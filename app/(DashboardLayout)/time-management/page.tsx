'use client';

import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { LeaveTab } from './LeaveTab';
import { TimeLogTab } from './TimeLogTab';

export default function TimeManagementPage() {
  const [selectedTab, setSelectedTab] = useState('timelog');

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className=''>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-dark)]'>
          Time Management
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
                value='timelog'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Time Log
              </TabsTrigger>
              <TabsTrigger
                value='leave'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Leave
              </TabsTrigger>
            </TabsList>
          </DynamicScrollArea>
        </div>
        <div className='bg-[var(--card-background)] rounded-2xl p-6 mt-6'>
          <TabsContent value='timelog' className=''>
            <TimeLogTab />
          </TabsContent>

          <TabsContent value='leave' className=''>
            <LeaveTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
