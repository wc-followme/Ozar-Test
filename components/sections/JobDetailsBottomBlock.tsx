'use client';

import ComingSoon from '@/components/shared/common/ComingSoon';
import TradeComponent from '@/components/shared/common/TradeComponent';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode, useEffect, useState } from 'react';
import EstimateComponent from '../Templates/EstimateComponent';
import WorkflowSection from './WorkflowSection';

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
  const [sidebarWidth, setSidebarWidth] = useState<number>(280); // Default to expanded

  // Function to detect sidebar width
  const detectSidebarWidth = () => {
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      const width = sidebar.classList.contains('w-[280px]') ? 280 : 94;
      setSidebarWidth(width);
    }
  };

  // Calculate max width based on sidebar state and screen size
  const getMaxWidth = () => {
    const isMobileView = window.innerWidth < 1024; // Use 1024px as breakpoint
    if (isMobileView) {
      // Mobile: full width minus page padding and margins (64px total)
      return 'calc(100vw - 85px)';
    } else {
      // Desktop: use detected sidebar width
      // Account for sidebar width, page padding (48px), container padding (24px), and safety margin (16px)
      return `calc(100vw - ${sidebarWidth}px - 48px - 24px - 48px)`;
    }
  };

  // Detect sidebar width changes
  useEffect(() => {
    const detectAndUpdate = () => {
      detectSidebarWidth();
      // ScrollArea handles overflow automatically
    };

    // Initial detection
    detectAndUpdate();

    // Set up observer for sidebar class changes
    const observer = new MutationObserver(detectAndUpdate);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // Also listen for window resize
    window.addEventListener('resize', detectAndUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', detectAndUpdate);
    };
  }, []);

  // Sample workflow data
  const [workflowSteps] = useState<any[]>([
    {
      id: '1',
      name: 'Project Planning',
      status: 'completed',
      description: 'Define project scope, timeline, and resource requirements',
      assignedTo: 'John Smith',
      dueDate: '2024-01-15',
      completedDate: '2024-01-14',
      estimatedDuration: '3 days',
    },
    {
      id: '2',
      name: 'Site Preparation',
      status: 'in-progress',
      description: 'Prepare the construction site and set up equipment',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-01-20',
      estimatedDuration: '2 days',
    },
    {
      id: '3',
      name: 'Foundation Work',
      status: 'pending',
      description: 'Excavate and pour foundation',
      assignedTo: 'Sarah Wilson',
      dueDate: '2024-01-25',
      estimatedDuration: '5 days',
    },
    {
      id: '4',
      name: 'Framing',
      status: 'pending',
      description: 'Install structural framework',
      assignedTo: 'David Brown',
      dueDate: '2024-02-05',
      estimatedDuration: '7 days',
    },
  ]);

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
        <div
          className='w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-full'
          style={{ maxWidth: getMaxWidth() }}
        >
          <div className='flex flex-row items-center gap-2 w-full'>
            <TabsList
              className={`flex w-max bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none`}
            >
              <TabsTrigger
                value='estimate'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Estimate</span>
              </TabsTrigger>
              <TabsTrigger
                value='trade'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Trade</span>
              </TabsTrigger>
              <TabsTrigger
                value='finishes'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Finishes</span>
              </TabsTrigger>
              <TabsTrigger
                value='workflow'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Workflow</span>
              </TabsTrigger>
              <TabsTrigger
                value='calendar'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Calendar</span>
              </TabsTrigger>
              <TabsTrigger
                value='messages'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Messages</span>
              </TabsTrigger>
              <TabsTrigger
                value='checklist'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Check list</span>
              </TabsTrigger>
              <TabsTrigger
                value='photos'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Photos</span>
              </TabsTrigger>
              <TabsTrigger
                value='documents'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value='receipts'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Receipts</span>
              </TabsTrigger>
              <TabsTrigger
                value='closeout'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Close Out</span>
              </TabsTrigger>
              <TabsTrigger
                value='terms'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Terms</span>
              </TabsTrigger>
              <TabsTrigger
                value='invoice'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='text-sm xl:text-base'>Invoice</span>
              </TabsTrigger>
            </TabsList>
            {rightActions}
          </div>
        </div>

        <div className='pt-6'>
          <TabsContent value='estimate' className='m-0'>
            {/* Action Bar */}

            <EstimateComponent onAddRoom={handleAddRoom} />
          </TabsContent>
          <TabsContent value='trade' className='m-0'>
            <TradeComponent />
          </TabsContent>
          <TabsContent value='finishes' className='m-0'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='workflow' className='m-0'>
            <WorkflowSection workflowSteps={workflowSteps} />
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

      {/* Version History SideSheet */}
    </div>
  );
};

export default JobDetailsBottomBlock;
