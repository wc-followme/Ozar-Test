'use client';

import SideSheet from '@/components/shared/common/SideSheet';
import { ManageHoursForm } from '@/components/shared/forms/ManageHoursForm';
import { IconPencil } from '@tabler/icons-react';
import { ArrowDown, ArrowUp } from 'iconsax-react';
import { useState } from 'react';

interface TimeLogComponentProps {
  date: string;
  effectiveHours: string;
  grossHours: string;
  arrival: string;
  overTime: string;
  gps: string | null;
  log: string;
}

export const TimeLogComponent = ({}: TimeLogComponentProps) => {
  const [isManageHoursOpen, setIsManageHoursOpen] = useState(false);

  // Generate sample punch records for demonstration
  const generatePunchRecords = () => {
    const records = [];
    for (let i = 0; i < 5; i++) {
      records.push({
        punchIn: '10:39:28 AM',
        punchOut: '10:40:13 AM',
      });
    }
    return records;
  };

  const punchRecords = generatePunchRecords();

  const handleManageHoursSubmit = (data: any) => {
    console.log('Manage Hours Data:', data);
    setIsManageHoursOpen(false);
  };

  return (
    <>
      <div className='bg-[var(--white-background)] rounded-lg border border-[var(--border-dark)] p-4 space-y-3'>
        {/* Shift Information Header */}
        <div className='space-y-1 border-b border-[var(--border-dark)] pb-2'>
          <h3 className='text-sm font-semibold text-[var(--text-dark)]'>
            General Shift (30 Jul)
          </h3>
          <p className='text-[var(--text-dark)] text-base font-medium mb-2'>
            10:00 AM - 7:00 PM
          </p>
        </div>

        {/* Manage Hours Link */}
        <div className='flex items-center gap-1 border-b border-[var(--primary)] pb-1 w-fit'>
          <IconPencil size={20} color='var(--primary)' />
          <button
            onClick={() => setIsManageHoursOpen(true)}
            className='text-[var(--primary)] text-sm font-semibold hover:text-[var(--primary)] transition-colors cursor-pointer'
          >
            Manage Hours
          </button>
        </div>

        {/* Punch Section */}
        <div className='space-y-3'>
          <h4 className='font-semibold text-[var(--text-dark)] text-sm'>
            Punch
          </h4>

          {/* Punch Records */}
          <div className='space-y-2'>
            {punchRecords.map((record, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm gap-6'
              >
                {/* Punch In */}
                <div className='flex items-center gap-1'>
                  <ArrowDown size='20' color='#90C91D' className='rotate-45' />
                  <span className='text-[var(--text-dark)] text-sm'>
                    {record.punchIn}
                  </span>
                </div>

                {/* Punch Out */}
                <div className='flex items-center gap-1'>
                  <ArrowUp
                    size='20'
                    color='var(--warning)'
                    className='rotate-45'
                  />
                  <span className='text-[var(--text-dark)] text-sm'>
                    {record.punchOut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Hours Side Sheet */}
      <SideSheet
        open={isManageHoursOpen}
        onOpenChange={setIsManageHoursOpen}
        title='Manage Hours'
        size='600px'
      >
        <ManageHoursForm
          onCancel={() => setIsManageHoursOpen(false)}
          onSubmit={handleManageHoursSubmit}
        />
      </SideSheet>
    </>
  );
};
