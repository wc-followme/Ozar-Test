'use client';

import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JOB_TABS } from '@/constants/common';
import { JobFilterCounts } from '../types';

interface HomeownerJobTabsListProps {
  selectedTab: string;
  filterCounts: JobFilterCounts;
  canEdit: boolean;
  onCreateJob: () => void;
  buttonText: string;
}

export const HomeownerJobTabsList = ({
  selectedTab,
  filterCounts,
  canEdit,
  onCreateJob,
  buttonText,
}: HomeownerJobTabsListProps) => {
  const { NEW_LEADS: NEW_LEADS_TAB, ARCHIVE } = JOB_TABS;

  return (
    <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] sm:max-w-full'>
      <DynamicScrollArea className='w-full'>
        <TabsList className='flex overflow-auto w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
          <TabsTrigger
            value={NEW_LEADS_TAB}
            className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
          >
            <span className='flex items-center gap-2'>
              <span className='text-sm xl:text-base'>Estimate</span>
              <Badge
                className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === NEW_LEADS_TAB ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
              >
                {filterCounts.new_leads}
              </Badge>
            </span>
          </TabsTrigger>

          <TabsTrigger
            value={ARCHIVE}
            className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
          >
            <span className='flex items-center gap-2'>
              <span className='text-sm xl:text-base'>Archived</span>
              <Badge
                className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === ARCHIVE ? 'bg-graybrand text-white shadow-sm sm:shadow-none' : 'bg-transparent text-graybrand'}`}
              >
                {filterCounts.archived}
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>
      </DynamicScrollArea>
      {canEdit && (
        <div className='flex gap-3'>
          <button
            onClick={onCreateJob}
            className='btn-primary !hidden sm:!flex items-center shrink-0 justify-center !px-0 sm:!px-8 text-base text-center rounded-full transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto w-14 h-14 sm:w-auto sm:h-12 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] sm:shadow-none hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.4)] sm:hover:shadow-none'
          >
            <span className='hidden sm:inline text-base'>{buttonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
