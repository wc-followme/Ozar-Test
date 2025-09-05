'use client';

import SideSheet from '@/components/shared/common/SideSheet';
import { ApplyLeaveForm } from '@/components/shared/forms/ApplyLeaveForm';
import { PunchInForm } from '@/components/shared/forms/PunchInForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { LeaveTab } from './LeaveTab';
import { TimeLogTab } from './TimeLogTab';

export default function TimeManagementPage() {
  const [selectedTab, setSelectedTab] = useState('timelog');
  const [isGPSEnabled, setIsGPSEnabled] = useState(false);
  const [isPunchInOpen, setIsPunchInOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // Function to check GPS permission status
  const checkGPSPermission = async () => {
    if (!navigator.geolocation) {
      setIsGPSEnabled(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,
          });
        }
      );

      if (position) {
        setIsGPSEnabled(true);
        console.log('GPS already enabled:', position.coords);
      }
    } catch (error: any) {
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
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
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
      await handleGPSRequest();
      return;
    }

    setIsPunchInOpen(true);
  };

  // Function to handle Apply Leave
  const handleApplyLeave = () => {
    setIsApplyLeaveOpen(true);
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
        <div className='flex sm:flex-row flex-col gap-3 sm:gap-4 items-start lg:items-center justify-between w-full'>
          <div className='flex flex-row items-center gap-2 w-full overflow-auto sm:max-w-full'>
            <TabsList className='flex overflow-auto w-full sm:w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
              <TabsTrigger
                value='timelog'
                className='px-6 flex-1 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Time Log
              </TabsTrigger>
              <TabsTrigger
                value='leave'
                className='px-6 flex-1 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
              >
                Leave
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end w-full sm:w-auto ml-auto'>
            {selectedTab === 'timelog' && (
              <Button
                variant={isGPSEnabled ? 'default' : 'outline'}
                className={`${
                  isGPSEnabled
                    ? 'btn-primary'
                    : 'bg-[var(--text-placeholder)] rounded-full text-white border-[var(--text-placeholder)] hover:bg-[var(--text-placeholder)] hover:opacity-90'
                } text-sm sm:text-base px-4 sm:px-6 py-2`}
                onClick={isGPSEnabled ? handlePunchIn : forceGPSPermission}
              >
                <span>
                  {isGPSEnabled ? 'Punch In' : 'Turn on GPS to Punch in!'}
                </span>
              </Button>
            )}
            {selectedTab === 'leave' && (
              <Button
                className='btn-primary text-sm sm:text-base px-4 sm:px-6 py-2'
                onClick={handleApplyLeave}
              >
                <span>Apply Leave</span>
              </Button>
            )}
          </div>
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

      {/* Apply Leave Side Sheet */}
      <SideSheet
        open={isApplyLeaveOpen}
        onOpenChange={setIsApplyLeaveOpen}
        title='Apply Leave'
        size='600px'
      >
        <ApplyLeaveForm
          onCancel={() => setIsApplyLeaveOpen(false)}
          onSubmit={(data: any) => {
            console.log('Leave application submitted:', data);
            setIsApplyLeaveOpen(false);
          }}
        />
      </SideSheet>
    </div>
  );
}
