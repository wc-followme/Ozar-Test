'use client';

import { MoveBoxIcon } from '@/components/icons/MoveBoxIcon';
import JobDetailsBottomBlock from '@/components/sections/JobDetailsBottomBlock';
import JobDetailsTopBlock from '@/components/sections/JobDetailsTopBlock';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { NoteListCard } from '@/components/shared/cards/NoteListCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import Dropdown from '@/components/shared/common/Dropdown';
import SideSheet from '@/components/shared/common/SideSheet';
import UserDropdownField from '@/components/shared/common/UserDropdownField';
import { AddEmployeeToJobForm } from '@/components/shared/forms/AddEmployeeToJobForm';
import { EditJobDetailsForm } from '@/components/shared/forms/EditJobDetailsForm';
import { NoteListForm } from '@/components/shared/forms/NoteListForm';
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
import { ClipboardClose, Note, Setting2, UserAdd } from 'iconsax-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JOB_MESSAGES } from '../../job-messages';
import { Job } from '../../types';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [isNoteSheetOpen, setIsNoteSheetOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isAddEmployeeSheetOpen, setIsAddEmployeeSheetOpen] = useState(false);
  const [isSubmittingEmployee, setIsSubmittingEmployee] = useState(false);
  const [isEditJobSheetOpen, setIsEditJobSheetOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
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
  }, [uuid]); // Only depend on uuid to prevent duplicate calls

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
    { name: JOB_MESSAGES.JOB_MANAGEMENT_BREADCRUMB, href: JOB_MANAGEMENT },
    { name: job?.project_id || job?.['uuid'] || 'Job Details' },
  ];

  // Mock users data for the UserDropdownField component
  const mockUsers = [
    { id: '1', name: 'John Doe', image: '/images/profile.jpg' },
    { id: '2', name: 'Jane Smith', image: '/images/profile.jpg' },
    { id: '3', name: 'Mike Johnson', image: '/images/profile.jpg' },
    { id: '4', name: 'Sarah Wilson', image: '/images/profile.jpg' },
    { id: '5', name: 'David Brown', image: '/images/profile.jpg' },
    { id: '6', name: 'Lisa Davis', image: '/images/profile.jpg' },
  ];

  // Mock available employees for the AddEmployeeToJobForm
  const availableEmployees = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Developer',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Designer',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'QA Engineer',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Project Manager',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'DevOps Engineer',
    },
    {
      id: '6',
      name: 'Lisa Davis',
      email: 'lisa.davis@company.com',
      role: 'Business Analyst',
    },
  ];

  // Mock menu options for user dropdown
  const userMenuOptions = [
    { label: 'View Profile', action: 'view_profile' },
    { label: 'Send Message', action: 'send_message' },
    { label: 'Remove User', action: 'remove_user' },
  ];

  const handleUserAction = (action: string) => {
    console.log('User action:', action);
    // Handle user actions here
  };

  // Note handling functions
  const handleAddNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
    setIsNoteSheetOpen(false);
    showSuccessToast('Note added successfully');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteSheetOpen(true);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev =>
      prev.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
    setEditingNote(null);
    setIsNoteSheetOpen(false);
    showSuccessToast('Note updated successfully');
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      showSuccessToast('Note deleted successfully');
    } catch (error) {
      showErrorToast('Failed to delete note');
    }
  };

  const handleNoteSheetClose = () => {
    setIsNoteSheetOpen(false);
    setEditingNote(null);
  };

  const handleNoteSubmit = (noteData: {
    id: string;
    content: string;
    timestamp: Date;
  }) => {
    if (editingNote) {
      handleUpdateNote({ ...noteData, id: editingNote.id });
    } else {
      handleAddNote(noteData);
    }
  };

  const handleAddEmployee = async (employeeData: {
    projectName: string;
    room: string;
    trade: string;
    service: string;
    startDate: string;
    dueDate: string;
    employeeIds: string[];
  }) => {
    try {
      setIsSubmittingEmployee(true);
      // Here you would typically make an API call to add the employee to the job
      console.log('Adding employee to job:', employeeData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccessToast('Employee added to job successfully');
      setIsAddEmployeeSheetOpen(false);
    } catch (error) {
      showErrorToast('Failed to add employee to job');
    } finally {
      setIsSubmittingEmployee(false);
    }
  };

  const handleEditJob = async (jobData: any) => {
    try {
      setIsSubmittingEdit(true);
      // Here you would typically make an API call to update the job
      console.log('Updating job:', jobData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccessToast('Job updated successfully');
      setIsEditJobSheetOpen(false);
    } catch (error) {
      showErrorToast('Failed to update job');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

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
        action: () => setIsAddEmployeeSheetOpen(true),
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
    <div className='space-y-6'>
      {/* Header Section with Breadcrumb and Actions */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='flex-1' />

        {/* Action Buttons */}
        {isClient && (
          <div className='flex items-center gap-3 ml-auto'>
            {/* Notes Button */}
            <Button
              variant='outline'
              className='bg-[#EBB40233] hover:bg-yellow-200 border-[#EBB402] text-[var(--text-dark)] px-4 py-2 rounded-full flex items-center gap-2'
              onClick={() => setIsNoteSheetOpen(true)}
            >
              <Note className='!w-5 !h-5' color='var(--text-dark)' />
              <span className='hidden sm:inline'>Notes</span>
            </Button>

            {/* User Dropdown Field */}
            <UserDropdownField
              users={mockUsers}
              maxVisible={3}
              menuOptions={userMenuOptions}
              onAction={handleUserAction}
            />

            {/* 3-dots menu */}
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
                  className='h-8 w-8 p-0 rotate-90 self-center'
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

      {/* Job Details Card */}
      <JobDetailsTopBlock
        status={status}
        jobStatus={job_status}
        isArchived={status === INACTIVE}
        isClosed={job_status === DONE}
        projectId={projectId}
        projectName={projectName}
        categoryName={categoryName}
        spent={spent}
        budgetAmount={budgetAmount}
        clientName={clientName}
        clientEmail={clientEmail}
        clientPhone={clientPhone}
        clientAddress={clientAddress}
        projectImage={projectImage}
        mapImage={mapImage}
        archivedStatusMessage={JOB_MESSAGES.ARCHIVED_STATUS}
        closedStatusMessage={JOB_MESSAGES.CLOSED_STATUS}
        onEditClick={() => {
          setIsEditJobSheetOpen(true);
        }}
        onOtherQuestionsClick={() => {
          // Handle other questions functionality
          console.log('Other questions clicked');
        }}
      />

      {/* Job Details Bottom Block */}
      <JobDetailsBottomBlock />

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

      {/* Notes Sidesheet */}
      <SideSheet
        open={isNoteSheetOpen}
        onOpenChange={setIsNoteSheetOpen}
        title={editingNote ? 'Edit Note' : 'Add Note'}
        size='600px'
      >
        <div className='space-y-6'>
          {/* Note Form */}
          {/* Notes List */}
          {notes.length > 0 && (
            <div className='space-y-4'>
              <div className='space-y-3 max-h-96 overflow-y-auto'>
                {notes.map(note => (
                  <NoteListCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </div>
          )}
          <NoteListForm
            onSave={handleNoteSubmit}
            onCancel={handleNoteSheetClose}
            isSubmitting={isSubmittingNote}
          />
        </div>
      </SideSheet>

      {/* Add Employee Sidesheet */}
      <SideSheet
        open={isAddEmployeeSheetOpen}
        onOpenChange={setIsAddEmployeeSheetOpen}
        title='Add Employee to Job'
        size='600px'
      >
        <AddEmployeeToJobForm
          onSave={handleAddEmployee}
          onCancel={() => setIsAddEmployeeSheetOpen(false)}
          isSubmitting={isSubmittingEmployee}
          availableEmployees={availableEmployees}
        />
      </SideSheet>

      {/* Edit Job Details Sidesheet */}
      <SideSheet
        open={isEditJobSheetOpen}
        onOpenChange={setIsEditJobSheetOpen}
        title='Edit Job Details'
        size='600px'
      >
        <EditJobDetailsForm
          onSave={handleEditJob}
          onCancel={() => setIsEditJobSheetOpen(false)}
          isSubmitting={isSubmittingEdit}
          defaultValues={{
            generalInfo: {
              fullName: job?.client_name || '',
              email: job?.client_email || '',
              phone: job?.client_phone_number || '',
              address: job?.client_address || '',
            },
            propertyInfo: {},
            projectInfo: {
              projectName: job?.project_name || '',
            },
            category: {},
            company_id: job?.company_id || '',
          }}
        />
      </SideSheet>
    </div>
  );
}
