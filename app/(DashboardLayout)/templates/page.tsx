'use client';

import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import { Dropdown } from '@/components/shared/common/Dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDown2,
  Calculator,
  DocumentText,
  ShieldTick,
} from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
            <Dropdown
              trigger={
                <Button className='btn-primary flex items-center gap-2'>
                  Create Templates
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
                  icon: Calculator,
                },
                {
                  label: 'Option Bid Template',
                  action: 'option-bid',
                  icon: DocumentText,
                },
                {
                  label: 'Tools Template',
                  action: 'tools',
                  icon: Calculator,
                },
                {
                  label: 'Disclaimers Template',
                  action: 'disclaimers',
                  icon: ShieldTick,
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

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex flex-row items-center gap-2 w-full overflow-hidden max-w-full'>
            <TabsList className='flex w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full overflow-hidden shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
              <TabsTrigger
                value='estimate'
                className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                <span className='flex items-center gap-2'>
                  <span className='text-sm sm:text-sm xl:text-base'>
                    Estimate
                  </span>
                  <Badge
                    className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'estimate' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
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
                  <span className='text-sm sm:text-sm xl:text-base'>Tools</span>
                  <Badge
                    className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'tools' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
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
                    className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'disclaimers' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
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
                    className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'archive' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
                  >
                    {archiveTemplates.length}
                  </Badge>
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Estimate Tab Content */}
          <TabsContent value='estimate' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {estimateTemplates.map(template => (
                <TemplateListCard
                  key={template.id}
                  template={template}
                  onEdit={() => console.log(`Edit template ${template.id}`)}
                  onDelete={() => console.log(`Delete template ${template.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Option Bid Tab Content */}
          <TabsContent value='option-bid' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {optionBidTemplates.map(template => (
                <TemplateListCard
                  key={template.id}
                  template={template}
                  onEdit={() => console.log(`Edit template ${template.id}`)}
                  onDelete={() => console.log(`Delete template ${template.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab Content */}
          <TabsContent value='tools' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {toolsTemplates.map(template => (
                <TemplateListCard
                  key={template.id}
                  template={template}
                  onEdit={() => console.log(`Edit template ${template.id}`)}
                  onDelete={() => console.log(`Delete template ${template.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Disclaimers Tab Content */}
          <TabsContent value='disclaimers' className='mt-6'>
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {disclaimersTemplates.map(template => (
                <TemplateListCard
                  key={template.id}
                  template={template}
                  onEdit={() => console.log(`Edit template ${template.id}`)}
                  onDelete={() => console.log(`Delete template ${template.id}`)}
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
                    .filter(template => template.type === 'estimate')
                    .map(template => (
                      <TemplateListCard
                        key={template.id}
                        template={template}
                        onEdit={() =>
                          console.log(`Edit template ${template.id}`)
                        }
                        onDelete={() =>
                          console.log(`Delete template ${template.id}`)
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
                    .filter(template => template.type === 'option-bid')
                    .map(template => (
                      <TemplateListCard
                        key={template.id}
                        template={template}
                        onEdit={() =>
                          console.log(`Edit template ${template.id}`)
                        }
                        onDelete={() =>
                          console.log(`Delete template ${template.id}`)
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
                    .filter(template => template.type === 'tools')
                    .map(template => (
                      <TemplateListCard
                        key={template.id}
                        template={template}
                        onEdit={() =>
                          console.log(`Edit template ${template.id}`)
                        }
                        onDelete={() =>
                          console.log(`Delete template ${template.id}`)
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
                    .filter(template => template.type === 'disclaimer')
                    .map(template => (
                      <TemplateListCard
                        key={template.id}
                        template={template}
                        onEdit={() =>
                          console.log(`Edit template ${template.id}`)
                        }
                        onDelete={() =>
                          console.log(`Delete template ${template.id}`)
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
