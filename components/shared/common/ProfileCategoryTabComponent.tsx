'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export const ProfileCategoryTabComponent = () => {
  const [selectedTab, setSelectedTab] = useState('interior');

  const tabData = [
    {
      id: 'interior',
      label: 'Interior',
      services: [
        'Bathroom Remodeling',
        'Interior Door Installation',
        'Kitchen Renovation & Remodeling',
        'Home Extensions',
        'General Contracting',
        'Modular Home Construction',
      ],
    },
    {
      id: 'exterior',
      label: 'Exterior',
      services: [
        'Balcony Design & Construction',
        'Brick Masonry',
        'Concrete Construction',
        'Outdoor Kitchen Construction',
        'Foundation Construction',
        'Demolition',
      ],
    },
    {
      id: 'single-multi-trade',
      label: 'Single/Multi Trade',
      services: [
        'Concrete Repair',
        'Door Repair',
        'General Contracting',
        'Foundation Construction',
        'Brick Masonry',
        'Concrete Construction',
      ],
    },
    {
      id: 'repair',
      label: 'Repair',
      services: [
        'Concrete Repair',
        'Door Repair',
        'Demolition',
        'Foundation Construction',
        'General Contracting',
        'Bathroom Remodeling',
      ],
    },
  ];

  return (
    <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)]'>
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='w-full'
      >
        <div className='flex lg:gap-6 gap-0 lg:flex-row flex-col'>
          <div className='lg:w-[280px] w-full shrink-0 p-4'>
            {/* Mobile Select Dropdown */}
            <div className='lg:hidden'>
              <SelectField
                options={tabData.map(tab => ({
                  value: tab.id,
                  label: tab.label,
                }))}
                value={selectedTab}
                onValueChange={setSelectedTab}
                placeholder='Select category'
                className='w-full'
                triggerClassName='rounded-lg h-[42px]'
              />
            </div>

            {/* Desktop Tabs */}
            <div className='hidden lg:block'>
              <TabsList className='flex flex-col w-full rounded-lg h-auto'>
                {tabData.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`w-full justify-start px-3 py-4 leading-none text-[var(--text-dark)] data-[state=active]:bg-[#F5F7FA] data-[state=active]:text-[#24338C] rounded-lg font-medium ${
                      index !== tabData.length - 1
                        ? 'border-b border-[var(--border-dark)]'
                        : ''
                    }`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className='flex-1 p-4 bg-[var(--background)] lg:rounded-r-[20px]'>
            {tabData.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className='mt-0'>
                <div className='flex flex-wrap gap-3 bg-[var(--card-background)] rounded-[10px] p-5'>
                  {tab.services.map((service, index) => (
                    <div
                      key={index}
                      className='bg-[var(--background)] px-3 py-2 rounded-[30px] text-sm font-medium text-[var(--text-dark)]'
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};
