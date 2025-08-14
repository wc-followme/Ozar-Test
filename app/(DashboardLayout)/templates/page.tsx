'use client';

import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import { Dropdown } from '@/components/shared/common/Dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AddSquare,
  ArrowDown2,
  TableDocument,
  TaskSquare,
} from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OptionBidIcon } from '../../../components/icons/OptionBidIcon';
import { Tool } from '../../../components/icons/Tool';
import { DynamicScrollArea } from '../../../components/shared/common/DynamicScrollArea';
import {
  archiveTemplates,
  disclaimersTemplates,
  estimateTemplates,
  optionBidTemplates,
  toolsTemplates,
} from './dummy-data';

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('estimate');

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>Templates</h2>
          <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
            {/* Desktop Button */}
            <div className='hidden sm:block'>
              <Dropdown
                trigger={
                  <Button className='btn-primary flex items-center gap-2'>
                    <span className='text-base'>Create Templates</span>
                    <ArrowDown2
                      size={16}
                      color='currentColor'
                      className='[&_path]:stroke-[3px]'
                    />
                  </Button>
                }
                menuOptions={[
                  {
                    label: 'Estimate Template',
                    action: 'estimate',
                    icon: TaskSquare,
                  },
                  {
                    label: 'Option Bid Template',
                    action: 'option-bid',
                    icon: OptionBidIcon,
                  },
                  {
                    label: 'Tools Template',
                    action: 'tools',
                    icon: Tool,
                  },
                  {
                    label: 'Disclaimers Template',
                    action: 'disclaimers',
                    icon: TableDocument,
                  },
                ]}
                onAction={action => {
                  console.log(`Creating ${action} template`);
                  router.push(`/templates/create/${action}`);
                }}
              />
            </div>

            {/* Mobile Floating Action Button */}
            <div className='block sm:hidden'>
              <Dropdown
                trigger={
                  <Button className='btn-primary flex items-center justify-center !w-12 !h-12 rounded-full p-0 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 fixed bottom-6 right-6 z-50 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.4)]'>
                    <AddSquare size='24' color='#fff' className='!h-6 !w-6' />
                  </Button>
                }
                menuOptions={[
                  {
                    label: 'Estimate Template',
                    action: 'estimate',
                    icon: TaskSquare,
                  },
                  {
                    label: 'Option Bid Template',
                    action: 'option-bid',
                    icon: OptionBidIcon,
                  },
                  {
                    label: 'Tools Template',
                    action: 'tools',
                    icon: Tool,
                  },
                  {
                    label: 'Disclaimers Template',
                    action: 'disclaimers',
                    icon: TableDocument,
                  },
                ]}
                onAction={action => {
                  console.log(`Creating ${action} template`);
                  router.push(`/templates/create/${action}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] xl:max-w-full'>
            <DynamicScrollArea className='w-full'>
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full overflow-auto shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                <TabsTrigger
                  value='estimate'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Estimate
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'estimate' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-orangebrand'}`}
                    >
                      {estimateTemplates.length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='option-bid'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Option Bid
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'option-bid' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
                    >
                      {optionBidTemplates.length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='tools'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Tools
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'tools' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-yellowbrand'}`}
                    >
                      {toolsTemplates.length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='disclaimers'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Disclaimers
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'disclaimers' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-cyanwave-main'}`}
                    >
                      {disclaimersTemplates.length}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='archive'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Archive
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'archive' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--text-secondary)]'}`}
                    >
                      {archiveTemplates.length}
                    </Badge>
                  </span>
                </TabsTrigger>
              </TabsList>
            </DynamicScrollArea>
          </div>

          {/* Estimate Tab Content */}
          <TabsContent value='estimate' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {estimateTemplates.map(({ id, ...template }) => (
                <TemplateListCard
                  key={id}
                  template={{ id, ...template }}
                  onEdit={() => console.log(`Edit template ${id}`)}
                  onDelete={() => console.log(`Delete template ${id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Option Bid Tab Content */}
          <TabsContent value='option-bid' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {optionBidTemplates.map(({ id, ...template }) => (
                <TemplateListCard
                  key={id}
                  template={{ id, ...template }}
                  onEdit={() => console.log(`Edit template ${id}`)}
                  onDelete={() => console.log(`Delete template ${id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab Content */}
          <TabsContent value='tools' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {toolsTemplates.map(({ id, ...template }) => (
                <TemplateListCard
                  key={id}
                  template={{ id, ...template }}
                  onEdit={() => console.log(`Edit template ${id}`)}
                  onDelete={() => console.log(`Delete template ${id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Disclaimers Tab Content */}
          <TabsContent value='disclaimers' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {disclaimersTemplates.map(({ id, ...template }) => (
                <TemplateListCard
                  key={id}
                  template={{ id, ...template }}
                  onEdit={() => console.log(`Edit template ${id}`)}
                  onDelete={() => console.log(`Delete template ${id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <div className='space-y-8'>
              {/* Estimate Section */}
              <div>
                <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                  Estimate
                </h3>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {archiveTemplates
                    .filter(({ type }) => type === 'estimate')
                    .map(({ id, ...template }) => (
                      <TemplateListCard
                        key={id}
                        template={{ id, ...template }}
                        isArchived={true}
                        onRetrieve={() =>
                          console.log(`Retrieve template ${id}`)
                        }
                      />
                    ))}
                </div>
              </div>

              {/* Option Bid Section */}
              <div>
                <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                  Option Bid
                </h3>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {archiveTemplates
                    .filter(({ type }) => type === 'option-bid')
                    .map(({ id, ...template }) => (
                      <TemplateListCard
                        key={id}
                        template={{ id, ...template }}
                        isArchived={true}
                        onRetrieve={() =>
                          console.log(`Retrieve template ${id}`)
                        }
                      />
                    ))}
                </div>
              </div>

              {/* Tools Section */}
              <div>
                <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                  Tools
                </h3>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {archiveTemplates
                    .filter(({ type }) => type === 'tools')
                    .map(({ id, ...template }) => (
                      <TemplateListCard
                        key={id}
                        template={{ id, ...template }}
                        isArchived={true}
                        onRetrieve={() =>
                          console.log(`Retrieve template ${id}`)
                        }
                      />
                    ))}
                </div>
              </div>

              {/* Disclaimers Section */}
              <div>
                <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                  Disclaimers
                </h3>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {archiveTemplates
                    .filter(({ type }) => type === 'disclaimer')
                    .map(({ id, ...template }) => (
                      <TemplateListCard
                        key={id}
                        template={{ id, ...template }}
                        isArchived={true}
                        onRetrieve={() =>
                          console.log(`Retrieve template ${id}`)
                        }
                      />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
