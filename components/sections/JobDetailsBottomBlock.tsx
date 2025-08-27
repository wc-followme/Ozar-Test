'use client';

import ComingSoon from '@/components/shared/common/ComingSoon';
import TradeComponent from '@/components/shared/common/TradeComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode, useState } from 'react';
import EstimateComponent from '../Templates/EstimateComponent';

interface JobDetailsBottomBlockProps {
  initialTab?: string;
  rightActions?: ReactNode;
}

const JobDetailsBottomBlock: React.FC<JobDetailsBottomBlockProps> = ({
  initialTab,
  rightActions,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    initialTab || 'estimate'
  );

  // Temporary data for EstimateComponent
  const breadcrumbData = [
    { name: 'Job Management', href: '/job-management' },
    { name: 'Job Details', href: '#' },
  ];

  const handleAddRoom = () => {
    console.log('Add room clicked');
    // TODO: Implement add room functionality
  };

  return (
    <div className='bg-[var(--card-background)] rounded-[20px] p-6 border border-[var(--border-dark)]'>
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='w-full'
      >
        <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] sm:max-w-full'>
          <div className='w-full'>
            <TabsList className='flex overflow-auto w-full bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
              <TabsTrigger
                value='estimate'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Estimate</span>
              </TabsTrigger>
              <TabsTrigger
                value='trade'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Trade</span>
              </TabsTrigger>
              <TabsTrigger
                value='finishes'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Finishes</span>
              </TabsTrigger>
              <TabsTrigger
                value='workflow'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Workflow</span>
              </TabsTrigger>
              <TabsTrigger
                value='calendar'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Calendar</span>
              </TabsTrigger>
              <TabsTrigger
                value='messages'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Messages</span>
              </TabsTrigger>
              <TabsTrigger
                value='checklist'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Check list</span>
              </TabsTrigger>
              <TabsTrigger
                value='photos'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Photos</span>
              </TabsTrigger>
              <TabsTrigger
                value='documents'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value='receipts'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Receipts</span>
              </TabsTrigger>
              <TabsTrigger
                value='closeout'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Close Out</span>
              </TabsTrigger>
              <TabsTrigger
                value='terms'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Terms</span>
              </TabsTrigger>
              <TabsTrigger
                value='invoice'
                className='px-4 flex-1 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Invoice</span>
              </TabsTrigger>
            </TabsList>
          </div>
          {rightActions}
        </div>

        <div className='pt-6'>
          <TabsContent value='estimate' className='m-0'>
            <EstimateComponent onAddRoom={handleAddRoom} />
          </TabsContent>
          <TabsContent value='trade' className='m-0'>
            <TradeComponent />
          </TabsContent>
          <TabsContent value='finishes' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='workflow' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='calendar' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='messages' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='checklist' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='photos' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='documents' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='receipts' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='closeout' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='terms' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='invoice' className='m-0'>
            <ComingSoon />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default JobDetailsBottomBlock;
