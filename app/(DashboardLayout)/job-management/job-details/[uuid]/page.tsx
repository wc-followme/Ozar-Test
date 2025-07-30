'use client';

import { MoveBoxIcon } from '@/components/icons/MoveBoxIcon';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import Dropdown from '@/components/shared/common/Dropdown';
import JobDetailsSkeleton from '@/components/shared/skeleton/JobDetailsSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CommonStatus, JobStatus, ROUTES } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import { ClipboardClose, Setting2, UserAdd } from 'iconsax-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JOB_MESSAGES } from '../../job-messages';
import { Job } from '../../types';

export default function JobDetailsPage() {
  // Destructure constants for better readability
  const { INACTIVE } = CommonStatus;
  const { DONE } = JobStatus;
  const { JOB_MANAGEMENT } = ROUTES;

  const params = useParams();
  const uuid = params['uuid'] as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [archiving, setArchiving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for jobs
  const userPermissions = getUserPermissionsFromStorage();
  const canArchive = userPermissions?.jobs?.archive;
  const canViewJob = userPermissions?.jobs?.view;

  // Handle client-side only logic
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const response = await apiService.fetchJobById(uuid);
        // Destructure response data for cleaner code
        const { data } = response;
        if (data) {
          setJob(data);
        }
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          JOB_MESSAGES.FETCH_DETAILS_ERROR
        );
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchJobData();
  }, [uuid, showErrorToast, handleAuthError]);

  const handleArchiveClick = () => {
    setShowArchiveConfirm(true);
  };

  const handleCloseClick = () => {
    setShowCloseConfirm(true);
  };

  const moveToArchive = async () => {
    if (!job) return;

    try {
      setArchiving(true);
      const response = await apiService.updateJob(uuid, { status: INACTIVE });
      showSuccessToast(
        extractApiSuccessMessage(response, JOB_MESSAGES.ARCHIVE_SUCCESS)
      );
      // Update the local job state to reflect the change
      setJob(prev => (prev ? { ...prev, status: INACTIVE } : null));
      setShowArchiveConfirm(false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, JOB_MESSAGES.ARCHIVE_ERROR);
      showErrorToast(message);
    } finally {
      setArchiving(false);
    }
  };

  const closeJob = async () => {
    if (!job) return;

    try {
      setClosing(true);
      const response = await apiService.updateJob(uuid, { job_status: DONE });
      showSuccessToast(
        extractApiSuccessMessage(response, JOB_MESSAGES.CLOSE_SUCCESS)
      );
      // Update the local job state to reflect the change
      setJob(prev => (prev ? { ...prev, job_status: DONE } : null));
      setShowCloseConfirm(false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, JOB_MESSAGES.CLOSE_ERROR);
      showErrorToast(message);
    } finally {
      setClosing(false);
    }
  };

  const breadcrumbData: BreadcrumbItem[] = [
    { name: JOB_MESSAGES.JOB_MANAGEMENT_TITLE, href: JOB_MANAGEMENT },
    { name: job?.project_id || job?.['uuid'] || 'Job Details' },
  ];

  if (loading) {
    return <JobDetailsSkeleton />;
  }
  if (!job) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-lg text-[var(--warning)]'>
          {JOB_MESSAGES.JOB_NOT_FOUND}
        </div>
      </div>
    );
  }

  // Destructure job data with fallbacks
  const {
    client_name,
    client_email,
    client_phone_number,
    client_address,
    job_image,
    project_id,
    project_name,
    category,
    budget,
    status,
    job_status,
  } = job;

  // Fallbacks for job properties
  const clientName = client_name || '-';
  const clientEmail = client_email || '-';
  const clientPhone = client_phone_number || '-';
  const clientAddress = client_address || '-';
  const projectImage = job_image || '/images/auth/login-slider-01.webp';
  const projectId = project_id || '-';
  const projectName = project_name || '-';
  const budgetAmount = budget ?? 57000;

  // Static constants
  const mapImage = '/images/map-placeholder.png';
  const spent = 17200; // Static fallback

  // Category name with fallback
  const categoryName =
    typeof category === 'string' ? category : (category as any)?.name || '-';

  // Filter menu items based on job status
  const getFilteredMenuItems = () => {
    const allMenuItems = [
      {
        label: JOB_MESSAGES.CLOSE_JOB_MENU,
        icon: ClipboardClose,
        action: handleCloseClick,
        className:
          'text-sm px-3 py-2 rounded-md var(--text-dark) cursor-pointer transition-colors flex items-center gap-2',
        disabled: closing || job_status === DONE,
      },
      {
        label: JOB_MESSAGES.ADD_EMPLOYEE_MENU,
        icon: UserAdd,
        action: () => {},
        className:
          'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
      },
      {
        label: JOB_MESSAGES.MOVE_TO_ARCHIVE_MENU,
        icon: MoveBoxIcon,
        action: handleArchiveClick,
        className:
          'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
        disabled: archiving || status === INACTIVE,
      },
      {
        label: JOB_MESSAGES.SETTINGS_MENU,
        icon: Setting2,
        action: () => {},
        className:
          'text-sm px-3 py-2 rounded-md cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100',
      },
    ];

    // Filter menu items based on permissions and job status
    return allMenuItems.filter(item => {
      // Check permissions first

      if (item.label === JOB_MESSAGES.MOVE_TO_ARCHIVE_MENU) {
        // Check both permissions and job status
        return canArchive && status !== INACTIVE && job_status !== DONE;
      }

      return true;
    });
  };

  const dropdownMenuItems = getFilteredMenuItems();

  // Check if user has permission to view jobs
  if (userPermissions && !canViewJob) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.JOB_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.JOB_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.JOB_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className=''>
      {/* Breadcrumb */}
      <div className='flex flex-wrap flex-col sm:flex-row gap-2 items-start text-sm font-normal mb-1 w-full md:text-base md:mb-3'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        {/* 3-dots menu */}
        {isClient && (
          <div className='ml-auto mt-2 md:mt-0'>
            <Dropdown
              menuOptions={dropdownMenuItems
                .filter(item => !item.disabled)
                .map(({ icon, label }) => ({
                  icon,
                  label:
                    label === 'Move to Archive' && archiving
                      ? 'Moving to Archive...'
                      : label === 'Close job' && closing
                        ? 'Closing Job...'
                        : label,
                  action: label,
                }))}
              onAction={action => {
                const item = dropdownMenuItems.find(i => i.label === action);
                if (item && item.action && !item.disabled) item.action();
              }}
              trigger={
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 p-0 rotate-90'
                  disabled={archiving || closing}
                >
                  <IconDotsVertical
                    className='!w-6 !h-6'
                    strokeWidth={2}
                    color='var(--text)'
                  />
                </Button>
              }
              align='end'
            />
          </div>
        )}
      </div>
      {/* Card */}
      <div className='bg-[var(--card-background)] rounded-[20px] p-4 md:p-6 flex flex-col md:flex-row md:justify-between border border-[var(--border-dark)] max-w-full gap-4 md:gap-0 relative shadow-lg sm:shadow-none'>
        {status === INACTIVE && (
          <div className='absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
            {JOB_MESSAGES.ARCHIVED_STATUS}
          </div>
        )}
        {job_status === DONE && (
          <div className='absolute top-4 right-4 bg-[var(--secondary)] text-white px-3 py-1 rounded-full text-sm font-medium'>
            {JOB_MESSAGES.CLOSED_STATUS}
          </div>
        )}
        {/* Project Image */}
        <div className='flex-shrink-0 flex justify-center md:block mb-4 md:mb-0'>
          <Image
            src={projectImage}
            alt='Project'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px]'
          />
        </div>
        {/* Details */}
        <div className='flex-1 px-0 md:px-6 w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-y-4 md:gap-4 border-b border-[var(--border-dark)] pb-2 mb-3'>
            <div className='min-w-0 break-words'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.PROJECT_ID_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {projectId}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.PROJECT_NAME_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {projectName}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.JOB_CATEGORY_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {categoryName}
              </div>
            </div>
            <div className='md:col-span-2 flex flex-col md:flex-row md:items-center gap-2 min-w-0 break-words'>
              <div>
                <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                  {JOB_MESSAGES.BUDGET_LABEL}
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-base text-[var(--text-dark)]'>
                    ${spent.toLocaleString()}
                  </span>
                  <div className='w-32 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-2 bg-[var(--secondary)]'
                      style={{ width: `${(spent / budgetAmount) * 100}%` }}
                    />
                  </div>
                  <span className='text-[var(--text-secondary)] font-medium'>
                    ${budgetAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-y-4 md:gap-4 items-start md:items-center mt-2'>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.CLIENT_NAME_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientName}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.EMAIL_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientEmail}
              </div>
            </div>
            <div className='min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.PHONE_NUMBER_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientPhone}
              </div>
            </div>
            <div className='md:col-span-2 min-w-0 break-words'>
              <div className='text-xs text-[var(--text-secondary)] font-normal mb-1'>
                {JOB_MESSAGES.ADDRESS_LABEL}
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientAddress}
              </div>
            </div>
          </div>
        </div>
        {/* Map Image */}
        <div className='flex justify-center gap-2 mt-4 md:mt-0'>
          <Image
            src={mapImage}
            alt='Map'
            width={100}
            height={100}
            className='rounded-[8px] object-cover w-[100px] h-[100px] md:w-[120px] md:h-[120px]'
          />
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      <ConfirmDeleteModal
        open={showArchiveConfirm}
        title={JOB_MESSAGES.MOVE_TO_ARCHIVE_TITLE}
        subtitle={JOB_MESSAGES.MOVE_TO_ARCHIVE_SUBTITLE}
        onCancel={() => setShowArchiveConfirm(false)}
        onDelete={moveToArchive}
      />

      {/* Close Job Confirmation Modal */}
      <ConfirmDeleteModal
        open={showCloseConfirm}
        title={JOB_MESSAGES.CLOSE_JOB_TITLE}
        subtitle={JOB_MESSAGES.CLOSE_JOB_SUBTITLE}
        onCancel={() => setShowCloseConfirm(false)}
        onDelete={closeJob}
      />
    </div>
  );
}
