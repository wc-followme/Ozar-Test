'use client';

import { DynamicTable } from '@/components/shared/common/DynamicTable';
import SideSheet from '@/components/shared/common/SideSheet';
import { TimeLogComponent } from '@/components/shared/common/TimeLogComponent';
import { PunchInForm } from '@/components/shared/forms/PunchInForm';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { timeLogData } from '@/constants/dummy-data';
import { InfoCircle, Map, TickCircle } from 'iconsax-react';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const TimeLogTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 DAYS');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isGPSEnabled, setIsGPSEnabled] = useState(false); // GPS status state
  const [isPunchInOpen, setIsPunchInOpen] = useState(false); // Punch In side sheet state

  const periods = ['30 DAYS', 'JAN', 'DEC', 'NOV', 'OCT', 'SEP', 'AUG'];

  // Function to check GPS permission status
  const checkGPSPermission = async () => {
    if (!navigator.geolocation) {
      setIsGPSEnabled(false);
      return;
    }

    try {
      // Check if we can get the current position without requesting permission
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false, // Use low accuracy for permission check
            timeout: 5000, // Shorter timeout for permission check
            maximumAge: 300000, // 5 minutes cache
          });
        }
      );

      if (position) {
        setIsGPSEnabled(true);
        console.log('GPS already enabled:', position.coords);
      }
    } catch (error: any) {
      // Check specific error codes
      if (error.code === error.PERMISSION_DENIED) {
        setIsGPSEnabled(false);
        console.log('GPS permission denied');
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        setIsGPSEnabled(false);
        console.log('GPS position unavailable');
      } else if (error.code === error.TIMEOUT) {
        setIsGPSEnabled(false);
        console.log('GPS timeout');
      } else {
        setIsGPSEnabled(false);
        console.log('GPS error:', error.message);
      }
    }
  };

  // Check GPS permission on component mount
  useEffect(() => {
    checkGPSPermission();
  }, []);

  // Function to clear GPS permissions and force popup
  const forceGPSPermission = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    try {
      // Force a new permission request by using a different approach
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000, // Longer timeout for permission request
            maximumAge: 0, // No cache, always get fresh position
          });
        }
      );

      if (position) {
        setIsGPSEnabled(true);
        console.log('GPS permission granted:', position.coords);
        alert('GPS permission granted! You can now punch in.');
      }
    } catch (error: any) {
      console.error('GPS permission error:', error);

      if (error.code === error.PERMISSION_DENIED) {
        // If permission is denied, show instructions to enable it manually
        alert(
          'GPS permission denied. Please:\n1. Click the lock/info icon in your browser address bar\n2. Change GPS permission to "Allow"\n3. Refresh the page'
        );
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        alert(
          'GPS position unavailable. Please check your device GPS settings.'
        );
      } else if (error.code === error.TIMEOUT) {
        alert('GPS request timed out. Please try again.');
      } else {
        alert('GPS error: ' + error.message);
      }

      setIsGPSEnabled(false);
    }
  };

  // Function to request GPS permission and check status
  const handleGPSRequest = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    try {
      // Request GPS permission and get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      if (position) {
        setIsGPSEnabled(true);
        console.log('GPS enabled:', position.coords);
      }
    } catch (error) {
      console.error('GPS permission denied or error:', error);
      setIsGPSEnabled(false);
      alert('GPS permission denied. Please enable GPS to punch in.');
    }
  };

  // Function to handle punch-in when GPS is enabled
  const handlePunchIn = async () => {
    if (!isGPSEnabled) {
      // If GPS is not enabled, request it first
      await handleGPSRequest();
      return;
    }

    // If GPS is enabled, open the punch-in side sheet
    setIsPunchInOpen(true);
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
      <div className='w-full h-2 bg-[#34AD4426] rounded-full relative overflow-hidden'>
        {/* Background */}
        <div className='w-full h-full bg-[#34AD4426] absolute inset-0' />

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
                  <InfoCircle size='20' color='#EBB402' />
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
                <InfoCircle size='20' color='#EBB402' />
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

  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: 'w-24',
      type: 'text' as const,
    },
    {
      key: 'attendanceVisual',
      label: 'Attendance Visual',
      width: 'w-32',
      type: 'custom' as const,
      render: (value: any, row: any) =>
        renderAttendanceVisual(value, row.isWeeklyOff),
    },
    {
      key: 'effectiveHours',
      label: 'Effective Hours',
      width: 'w-28',
      type: 'text' as const,
      render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
    },
    {
      key: 'grossHours',
      label: 'Gross Hours',
      width: 'w-28',
      type: 'text' as const,
      render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
    },
    {
      key: 'arrival',
      label: 'Arrival',
      width: 'w-28',
      type: 'text' as const,
      render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
    },
    {
      key: 'overTime',
      label: 'Over Time',
      width: 'w-28',
      type: 'text' as const,
      render: (value: any, row: any) => (row.isWeeklyOff ? null : value),
    },
    {
      key: 'gps',
      label: 'GPS',
      width: 'w-20',
      type: 'custom' as const,
      render: (value: any, row: any) => renderGPS(value, row.isWeeklyOff),
    },
    {
      key: 'log',
      label: 'Log',
      width: 'w-16',
      type: 'custom' as const,
      render: (value: any, row: any) =>
        renderLog(value, row.effectiveHours || '', row.isWeeklyOff, row),
      align: 'center' as const,
    },
  ];

  const filteredData = timeLogData.filter(item => {
    if (selectedPeriod === '30 DAYS') return true;
    // Add month filtering logic here if needed
    return true;
  });

  return (
    <div className='space-y-6'>
      {/* Date Filters and Overtime Summary */}
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
        {/* Date Filters with TabsList styling */}
        <div className='flex flex-wrap items-center gap-2'>
          <div className='bg-[var(--dark-background)] p-1 rounded-[32px] border border-[var(--border-dark)]'>
            <div className='flex items-center gap-0.5'>
              {periods.map(period => (
                <Button
                  variant='ghost'
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-2 text-base font-normal rounded-[28px] ${
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

        {/* GPS Punch-in Button */}
        <div className='flex justify-end'>
          <Button
            variant={isGPSEnabled ? 'default' : 'outline'}
            className={
              isGPSEnabled
                ? 'btn-primary'
                : 'bg-[var(--text-placeholder)] rounded-full text-white border-[var(--text-placeholder)] hover:bg-[var(--text-placeholder)] hover:opacity-90'
            }
            onClick={isGPSEnabled ? handlePunchIn : forceGPSPermission}
          >
            {isGPSEnabled ? 'Punch In' : 'Turn on GPS to Punch in!'}
          </Button>
        </div>
      </div>

      {/* Time Log Table */}
      <DynamicTable
        columns={columns}
        data={filteredData}
        className='w-full'
        showRowNumbers={false}
        rowClassName={row =>
          row.isWeeklyOff ? 'bg-[var(--border-light)]' : ''
        }
        tableConfig={{
          headerBgColor: 'bg-[var(--background)]',
        }}
      />

      {/* Punch In Side Sheet */}
      <SideSheet
        open={isPunchInOpen}
        onOpenChange={setIsPunchInOpen}
        title='Punch In'
        size='600px'
      >
        <PunchInForm
          onCancel={() => setIsPunchInOpen(false)}
          onSubmit={(data: any) => {
            console.log('Punch In submitted:', data);
            // Handle punch in submission here
            setIsPunchInOpen(false);
          }}
        />
      </SideSheet>
    </div>
  );
};
