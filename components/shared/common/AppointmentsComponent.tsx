'use client';

import { Button } from '@/components/ui/button';
import { IconMapPin2 } from '@tabler/icons-react';
import { Edit2 } from 'iconsax-react';
import { Calendar, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Dropdown from '../common/Dropdown';

interface Appointment {
  id: string;
  date: string;
  title: string;
  timeRange: string;
  appointmentWith: string;
  appointmentDate: string;
  address: string;
  notes: string;
}

interface AppointmentsComponentProps {
  className?: string;
}

export const AppointmentsComponent: React.FC<AppointmentsComponentProps> = ({
  className,
}) => {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(
    'appointment-2'
  );
  const [appointments] = useState<Appointment[]>([
    {
      id: 'appointment-1',
      date: 'Tomorrow',
      title: 'Door Fitting',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Esther Howard',
      appointmentDate: '08/12/2024',
      address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
      notes:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar dolor elementum tempus hac.',
    },
    {
      id: 'appointment-2',
      date: '01-05-2025',
      title: 'Door Fitting',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Esther Howard',
      appointmentDate: '08/12/2024',
      address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
      notes:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar dolor elementum tempus hac.',
    },
    {
      id: 'appointment-3',
      date: 'Tomorrow',
      title: 'Discuss door installation',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Jenny Wilson',
      appointmentDate: '09/12/2024',
      address: '123 Main St. Chicago, Illinois 60601',
      notes: 'Review installation requirements and timeline.',
    },
    {
      id: 'appointment-4',
      date: 'Tomorrow',
      title: 'Plan door upgrades',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'John Doe',
      appointmentDate: '10/12/2024',
      address: '456 Oak Ave. Springfield, Illinois 62701',
      notes: 'Discuss upgrade options and pricing.',
    },
    {
      id: 'appointment-5',
      date: 'Tomorrow',
      title: 'Review fitting options',
      timeRange: '11:00 PM-12:00 PM',
      appointmentWith: 'Jane Smith',
      appointmentDate: '11/12/2024',
      address: '789 Pine St. Peoria, Illinois 61601',
      notes: 'Review different fitting styles and materials.',
    },
  ]);

  const handleAppointmentClick = (appointmentId: string) => {
    setExpandedAppointment(
      expandedAppointment === appointmentId ? null : appointmentId
    );
  };

  const handleMoreOptions = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation();
    console.log('More options for appointment:', appointmentId);
  };

  // Dropdown menu options
  const menuOptions = [
    {
      id: 'edit',
      label: 'Edit Appointment',
      icon: Edit2,
      action: 'edit',
    },
    {
      id: 'view-details',
      label: 'View Details',
      icon: Calendar,
      action: 'view-details',
    },
    {
      id: 'view-location',
      label: 'View Location',
      icon: IconMapPin2,
      action: 'view-location',
    },
    {
      id: 'delete',
      label: 'Delete Appointment',
      icon: Trash2,
      action: 'delete',
      className: 'text-red-600',
    },
  ];

  const handleMenuAction = (action: string, appointmentId: string) => {
    switch (action) {
      case 'edit':
        console.log('Edit appointment:', appointmentId);
        // TODO: Implement edit functionality
        break;
      case 'view-details':
        console.log('View details for appointment:', appointmentId);
        // TODO: Implement view details functionality
        break;
      case 'view-location':
        console.log('View location for appointment:', appointmentId);
        // TODO: Implement view location functionality
        break;
      case 'delete':
        console.log('Delete appointment:', appointmentId);
        // TODO: Implement delete functionality with confirmation
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {appointments.map(appointment => {
        const isExpanded = expandedAppointment === appointment.id;

        return (
          <div
            key={appointment.id}
            className='bg-[#F5F7FA] p-3 rounded-[10px]'
            onClick={() => handleAppointmentClick(appointment.id)}
          >
            {/* Basic Info - Always Visible */}
            <div className='flex justify-between items-center'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-sm font-medium text-gray-600'>
                    {appointment.date}
                  </span>
                </div>
                <h3 className='text-base font-semibold text-gray-900 mb-1'>
                  {appointment.title}
                </h3>
                <p className='text-sm text-gray-600'>{appointment.timeRange}</p>
              </div>
              <Dropdown
                menuOptions={menuOptions}
                onAction={action => handleMenuAction(action, appointment.id)}
                trigger={
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 p-0 hover:bg-gray-200 mt-auto mb-auto'
                    onClick={e => e.stopPropagation()}
                  >
                    <MoreVertical
                      size={24}
                      className='text-gray-500 !w-5 !h-5'
                    />
                  </Button>
                }
                align='end'
              />
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className='mt-4 space-y-2'>
                {/* Appointment Details */}
                <div className='border-t border-gray-200 pt-2'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-[12px] font-medium text-[#818181] leading-[100%] tracking-[0%] mb-1'>
                        Appointment with
                      </p>
                      <p className='text-[14px] font-medium text-[#2D2D2D] leading-[22px] tracking-[0px]'>
                        {appointment.appointmentWith}
                      </p>
                    </div>
                    <div>
                      <p className='text-[12px] font-medium text-[#818181] leading-[100%] tracking-[0%] mb-1'>
                        Date
                      </p>
                      <p className='text-[14px] font-medium text-[#2D2D2D] leading-[22px] tracking-[0px]'>
                        {appointment.appointmentDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className='border-t border-gray-200 pt-2'>
                  <p className='text-[12px] font-medium text-[#818181] leading-[100%] tracking-[0%] mb-1'>
                    Address
                  </p>
                  <p className='text-[14px] font-medium text-[#2D2D2D] leading-[22px] tracking-[0px]'>
                    {appointment.address}
                  </p>
                </div>

                {/* Notes */}
                <div className='border-t border-gray-200 pt-2'>
                  <p className='text-[12px] font-medium text-[#818181] leading-[100%] tracking-[0%] mb-1'>
                    Notes
                  </p>
                  <p className='text-[14px] font-medium text-[#2D2D2D] leading-[22px] tracking-[0px]'>
                    {appointment.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
