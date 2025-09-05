'use client';

import { DynamicTable } from '@/components/shared/common/DynamicTable';
import { TimeLogComponent } from '@/components/shared/common/TimeLogComponent';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { timeLogData } from '@/constants/dummy-data';
import { TIME_LOG_COLUMNS } from '@/constants/tablecolumns';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { InfoCircle, Map, TickCircle } from 'iconsax-react';
import { Clock } from 'lucide-react';
import { useState } from 'react';

export const TimeLogTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 DAYS');
  const { sidebarWidth, isClient } = useSidebarState();

  const periods = ['30 DAYS', 'JAN', 'DEC', 'NOV', 'OCT', 'SEP', 'AUG'];

  // Calculate dynamic table max-width based on sidebar state
  const getTableStyle = () => {
    console.log('TimeLogTab - getTableStyle called:', {
      isClient,
      sidebarWidth,
    });

    if (!isClient) {
      console.log('Not client yet, using conservative default style');
      return { maxWidth: 'calc(100vw - 200px)' };
    }

    // Check if screen is 1024px or less (mobile/tablet)
    const isMobileOrTablet = window.innerWidth <= 1024;

    if (isMobileOrTablet) {
      console.log('Screen width <= 1024px, using mobile width calculation');
      // For mobile/tablet: very conservative calculation to prevent any scrolling
      // Account for main padding (48px) + extra safety margin (32px)
      return { maxWidth: 'calc(100vw - 80px)' };
    }

    // Desktop: use very conservative sidebar-aware calculation
    // Account for: sidebar width + main padding (48px) + container padding (24px) + extra safety margin (48px)
    const totalOffset = sidebarWidth + 48 + 24 + 48; // Very conservative padding
    const maxWidthValue = `calc(100vw - ${totalOffset}px)`;
    console.log(
      'Using desktop calculated max-width:',
      maxWidthValue,
      'totalOffset:',
      totalOffset,
      'sidebarWidth:',
      sidebarWidth
    );
    return { maxWidth: maxWidthValue };
  };

  const renderAttendanceVisual = (hours: number, isWeeklyOff: boolean) => {
    if (isWeeklyOff) {
      return <div className='text-gray-500 text-sm'>Full day Weekly-off</div>;
    }

    const maxHours = 10; // Assuming 10 hours is full day
    const percentage = (hours / maxHours) * 100;

    // Simulate break periods - you can adjust these values based on your data
    const hasBreak = hours > 4; // Show break if working more than 4 hours
    const breakStart = hasBreak ? 40 : 0; // Break starts at 40% of the bar
    const breakWidth = hasBreak ? 20 : 0; // Break width is 20% of the bar

    return (
      <div className='w-full h-2 bg-[var(--secondary-15)] rounded-full relative overflow-hidden'>
        {/* Background */}
        <div className='w-full h-full bg-[var(--secondary-15)] absolute inset-0' />

        {/* Progress segments with break */}
        {hasBreak ? (
          <>
            {/* First segment (before break) */}
            <div
              className='bg-[var(--secondary)] h-full absolute left-0 transition-all duration-300'
              style={{ width: `${breakStart}%` }}
            />
            {/* Break gap (transparent) */}
            <div
              className='h-full absolute bg-transparent'
              style={{
                left: `${breakStart}%`,
                width: `${breakWidth}%`,
              }}
            />
            {/* Second segment (after break) */}
            <div
              className='bg-[var(--secondary)] h-full absolute transition-all duration-300'
              style={{
                left: `${breakStart + breakWidth}%`,
                width: `${Math.max(0, percentage - breakStart - breakWidth)}%`,
              }}
            />
          </>
        ) : (
          /* Single continuous progress bar (no break) */
          <div
            className='bg-[var(--secondary)] h-full absolute left-0 transition-all duration-300'
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    );
  };

  const renderGPS = (gps: string | null, isWeeklyOff: boolean) => {
    if (isWeeklyOff) return null; // Don't render anything for weekly-off
    if (!gps) return <span className='text-gray-400'>-</span>;
    if (gps === 'view') {
      return (
        <Button
          size='sm'
          className='btn-primary !py-2 !h-9 !font-medium !bg-[var(--secondary-15)] hover:!bg-[var(--secondary-15)] !px-3 !text-[var(--secondary)]'
        >
          <Map size={20} color='var(--secondary)' className='!h-5 !w-5' />
          View
        </Button>
      );
    }
    return <span className='text-gray-400'>-</span>;
  };

  const renderLog = (
    log: string,
    effectiveHours: string | undefined,
    isWeeklyOff: boolean,
    row: any
  ) => {
    if (isWeeklyOff) return null; // Don't render anything for weekly-off

    // Parse effective hours to determine icon
    if (effectiveHours && typeof effectiveHours === 'string') {
      const hoursMatch = effectiveHours.match(/(\d+)h\s*(\d+)m?/);
      if (hoursMatch && hoursMatch[1] && hoursMatch[2]) {
        const hours = parseInt(hoursMatch[1]);
        const minutes = parseInt(hoursMatch[2]);
        const totalHours = hours + minutes / 60;

        if (totalHours >= 8) {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button className='mx-auto hover:scale-110 transition-transform cursor-pointer'>
                  <Clock size={20} color='var(--secondary)' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 border-0 shadow-none'
                align='end'
              >
                <TimeLogComponent
                  date={row.date}
                  effectiveHours={row.effectiveHours || ''}
                  grossHours={row.grossHours || ''}
                  arrival={row.arrival || ''}
                  overTime={row.overTime || ''}
                  gps={row.gps}
                  log={row.log || ''}
                />
              </PopoverContent>
            </Popover>
          );
        } else {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button className='mx-auto hover:scale-110 transition-transform cursor-pointer'>
                  <InfoCircle size='20' color='var(--error)' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-auto p-0 border-0 shadow-none'
                align='end'
              >
                <TimeLogComponent
                  date={row.date}
                  effectiveHours={row.effectiveHours || ''}
                  grossHours={row.grossHours || ''}
                  arrival={row.arrival || ''}
                  overTime={row.overTime || ''}
                  gps={row.gps}
                  log={row.log || ''}
                />
              </PopoverContent>
            </Popover>
          );
        }
      }
    }

    // Fallback to original logic if parsing fails
    switch (log) {
      case 'warning':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className='mx-auto hover:scale-110 transition-transform cursor-pointer'>
                <InfoCircle size='20' color='var(--error)' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 border-0 shadow-none'
              align='end'
            >
              <TimeLogComponent
                date={row.date}
                effectiveHours={row.effectiveHours || ''}
                grossHours={row.grossHours || ''}
                arrival={row.arrival || ''}
                overTime={row.overTime || ''}
                gps={row.gps}
                log={row.log || ''}
              />
            </PopoverContent>
          </Popover>
        );
      case 'clock':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className='mx-auto hover:scale-110 transition-transform cursor-pointer'>
                <Clock size={20} color='var(--text-dark)' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 border-0 shadow-none'
              align='end'
            >
              <TimeLogComponent
                date={row.date}
                effectiveHours={row.effectiveHours || ''}
                grossHours={row.grossHours || ''}
                arrival={row.arrival || ''}
                overTime={row.overTime || ''}
                gps={row.gps}
                log={row.log || ''}
              />
            </PopoverContent>
          </Popover>
        );
      case 'success':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className='mx-auto hover:scale-110 transition-transform cursor-pointer'>
                <TickCircle size='20' color='var(--secondary)' />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0 border-0 shadow-none'
              align='end'
            >
              <TimeLogComponent
                date={row.date}
                effectiveHours={row.effectiveHours || ''}
                grossHours={row.grossHours || ''}
                arrival={row.arrival || ''}
                overTime={row.overTime || ''}
                gps={row.gps}
                log={row.log || ''}
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return <span className='text-gray-400'>-</span>;
    }
  };

  // Create columns with custom render functions
  const columns = TIME_LOG_COLUMNS.map(column => {
    switch (column.key) {
      case 'attendanceVisual':
        return {
          ...column,
          render: (value: any, row: any) =>
            renderAttendanceVisual(value, row.isWeeklyOff),
        };
      case 'effectiveHours':
        return {
          ...column,
          render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
        };
      case 'grossHours':
        return {
          ...column,
          render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
        };
      case 'arrival':
        return {
          ...column,
          render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
        };
      case 'overTime':
        return {
          ...column,
          render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
        };
      case 'gps':
        return {
          ...column,
          render: (value: any, row: any) => renderGPS(value, row.isWeeklyOff),
        };
      case 'log':
        return {
          ...column,
          render: (value: any, row: any) =>
            renderLog(value, row.effectiveHours || '', row.isWeeklyOff, row),
        };
      default:
        return column;
    }
  });

  const filteredData = timeLogData.filter(() => {
    if (selectedPeriod === '30 DAYS') return true;
    // Add month filtering logic here if needed
    return true;
  });

  return (
    <div className='space-y-6'>
      {/* Date Filters and Overtime Summary */}
      <div className='flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-4'>
        {/* Date Filters with TabsList styling */}
        <div className='flex items-center gap-2 w-full overflow-x-auto max-w-[calc(100vw_-_80px)] sm:max-w-full rounded-full'>
          <div className='bg-[var(--dark-background)] p-1 rounded-[32px] border border-[var(--border-dark)] min-w-fit'>
            <div className='flex items-center gap-0.5 overflow-x-auto'>
              {periods.map(period => (
                <Button
                  variant='ghost'
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-normal rounded-[28px] whitespace-nowrap flex-shrink-0 ${
                    selectedPeriod === period
                      ? '!bg-[var(--primary)] !text-white shadow-lg font-semibold'
                      : 'text-[var(--text-dark)] hover:!bg-[var(--primary)] hover:text-white'
                  }`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time Log Table */}
      <DynamicTable
        columns={columns}
        data={filteredData}
        className='relative block w-full overflow-x-auto overflow-y-hidden overscroll-x-auto'
        style={getTableStyle()}
        showRowNumbers={false}
        rowClassName={row =>
          row.isWeeklyOff ? 'bg-[var(--border-light)]' : ''
        }
        tableConfig={{
          headerBgColor: 'bg-[var(--background)]',
        }}
      />
    </div>
  );
};
