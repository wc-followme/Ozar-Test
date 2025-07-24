'use client';
import NoDataFound from '@/components/shared/common/NoDataFound';

import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  CommonStatus,
  JobFilterType,
  JobStatus,
  ROUTES,
} from '@/constants/common';
import { apiService } from '@/lib/api';
import { IconFlag } from '@tabler/icons-react';
import { Add, Profile2User } from 'iconsax-react';
import { DollarSign } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FlagHookIcon } from '../../../components/icons/FalgHookIcon';
import { JobCard } from '../../../components/shared/cards/JobCard';
import { StatsCard } from '../../../components/shared/cards/StatsCard';
import ComingSoon from '../../../components/shared/common/ComingSoon';
import { DynamicScrollArea } from '../../../components/shared/common/DynamicScrollArea';
import SideSheet from '../../../components/shared/common/SideSheet';
import { CreateJobForm } from '../../../components/shared/forms/CreateJobForm';
import { JobCardSkeleton } from '../../../components/shared/skeleton/JobCardSkeleton';
import JobManagementPageSkeleton from '../../../components/shared/skeleton/JobManagementPageSkeleton';
import { Badge } from '../../../components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { getUserPermissionsFromStorage } from '../../../lib/utils';
import { JOB_MESSAGES } from './job-messages';
import { CreateJobFormData, Job, JobFilterCounts } from './types';

export default function JobManagement() {
  const [selectedTab, setSelectedTab] = useState('newLeads');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]); // Replace mockJobs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const { showSuccessToast, showErrorToast } = useToast();

  // Get user permissions for jobs
  const userPermissions = getUserPermissionsFromStorage();
  const canView = userPermissions?.jobs?.view;
  const canEdit = userPermissions?.jobs?.edit;

  // Helper function to generate home-owner link
  const generateHomeOwnerLink = (jobUuid: string) =>
    `${APP_CONFIG.BASE_URL}${ROUTES.HOME_OWNER}/${jobUuid}`;

  // State for filter counts
  const [filterCounts, setFilterCounts] = useState<JobFilterCounts>({
    all: 0,
    need_attention: 0,
    new_leads: 0,
    ongoing_jobs: 0,
    waiting_on_client: 0,
    closed: 0,
    archived: 0,
  });

  // Function to fetch filter counts
  const fetchFilterCounts = useCallback(async () => {
    try {
      const response = await apiService.fetchJobStatistics();
      if (response.data) {
        setFilterCounts(response.data);
      }
    } catch (error: any) {
      // Error handled silently - filter counts are not critical
    }
  }, []);

  // Function to fetch jobs based on selected tab
  const fetchJobsByTab = useCallback(
    async (tab: string, isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setTabLoading(true);
        }
        const params: any = {
          page: 1,
          limit: 10,
        };

        // Set parameters based on selected tab
        switch (tab) {
          case 'newLeads':
            params.status = CommonStatus.ACTIVE;
            params.type = JobFilterType.NEW_LEADS;
            break;
          case 'info':
            return;
          // params.status = CommonStatus.ACTIVE;
          // params.type = JobFilterType.NEED_ATTENTION;
          // break;
          case 'ongoingJob':
            return;
          // params.status = CommonStatus.ACTIVE;
          // params.type = JobFilterType.ONGOING;
          // break;
          case 'waitingOnClient':
            return;
          // params.status = CommonStatus.ACTIVE;
          // params.type = JobFilterType.WAITING_ON_CLIENT;
          // break;
          case 'archive':
            params.status = CommonStatus.INACTIVE;
            params.type = JobFilterType.ALL;
            break;
          case 'closed':
            params.status = CommonStatus.ACTIVE;
            params.type = JobFilterType.ALL;
            params.job_status = JobStatus.DONE;
            break;
          default:
            params.status = CommonStatus.ACTIVE;
            params.type = JobFilterType.ALL;
        }
        const response = await apiService.fetchJobs(params);
        setJobs(
          Array.isArray(response.data)
            ? response.data
            : response.data?.data || []
        );
      } catch (error: any) {
        showErrorToast(error?.message || JOB_MESSAGES.FETCH_ERROR);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setTabLoading(false);
        }
      }
    },
    [showErrorToast]
  );

  // Effect to fetch filter counts on mount
  useEffect(() => {
    fetchFilterCounts();
  }, [fetchFilterCounts]);

  // Effect to fetch jobs when selected tab changes
  useEffect(() => {
    fetchJobsByTab(selectedTab, true); // Initial load
  }, [fetchJobsByTab, selectedTab]); // Include dependencies

  // Effect to fetch jobs when selected tab changes (for tab switching)
  useEffect(() => {
    if (
      selectedTab !== 'info' &&
      selectedTab !== 'ongoingJob' &&
      selectedTab !== 'waitingOnClient'
    ) {
      fetchJobsByTab(selectedTab, false); // Tab switching
    }
  }, [selectedTab, fetchJobsByTab]);

  // Check if user has permission to view jobs
  if (!canView) {
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-[var(--text-dark)] mb-2'>
            Access Denied
          </h2>
          <p className='text-[var(--text-secondary)]'>
            You don&apos;t have permission to view jobs.
          </p>
        </div>
      </div>
    );
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // Handle job creation
  const handleCreateJob = async (data: CreateJobFormData) => {
    const {
      client_name,
      client_email,
      client_phone_number,
      job_boxes_step,
      job_privacy,
      client_id,
    } = data;

    setIsSubmitting(true);
    try {
      // Prepare job_boxes_step with automatic logic
      let jobBoxesStep = '';
      if (Array.isArray(job_boxes_step) && job_boxes_step.length > 0) {
        if (job_boxes_step.length === 1) {
          jobBoxesStep = 'FIRST';
        } else if (job_boxes_step.length === 2) {
          jobBoxesStep = 'SECOND';
        } else if (job_boxes_step.length === 3) {
          jobBoxesStep = 'THIRD';
        }
      }

      // Prepare payload for API
      const payload: any = {
        client_name,
        client_email,
        client_phone_number,
        job_privacy,
      };

      // Only add job_boxes_step if array length is not 0
      if (job_boxes_step?.length !== 0) {
        payload.job_boxes_step = jobBoxesStep;
      }
      // Only include client_id if it has a value
      if (client_id !== undefined && client_id !== null && client_id !== '') {
        // Convert string to number if needed
        payload.client_id =
          typeof client_id === 'string' ? parseInt(client_id, 10) : client_id;
      }

      // Call API using apiService
      const response = await apiService.createJob(payload);

      if (response.data) {
        // Generate home-owner link with job UUID
        const jobUuid = response.data?.uuid || response.data?.id;
        const homeOwnerLink = jobUuid ? generateHomeOwnerLink(jobUuid) : null;

        showSuccessToast(response?.message || JOB_MESSAGES.CREATE_SUCCESS);

        // Set the generated link
        if (homeOwnerLink) {
          setGeneratedLink(homeOwnerLink);
        }
        if (job_boxes_step?.length === 0) {
          setIsOpen(false);
          fetchJobsByTab(selectedTab);
          fetchFilterCounts();
        }
        // Refresh jobs and counts after successful creation
      } else {
        showErrorToast(response.message || JOB_MESSAGES.CREATE_ERROR);
      }
    } catch (err: any) {
      showErrorToast(err?.message || JOB_MESSAGES.CREATE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      id: 'active-projects',
      icon: FlagHookIcon,
      value: '24',
      label: 'Active Projects',
      iconColor: 'text-[#EBB402]',
      bgColor: 'bg-[#EBB4021A]',
    },
    {
      id: 'completed',
      icon: IconFlag,
      value: '18',
      label: 'Completed',
      iconColor: 'text-[#00A8BF]',
      bgColor: 'bg-[#1A57BF1A]',
    },
    {
      id: 'revenue',
      icon: DollarSign,
      value: '$2.4M',
      label: 'Revenue',
      iconColor: 'text-[#90C91D]',
      bgColor: 'bg-[#31A31D1A]',
    },
    {
      id: 'team-member',
      icon: Profile2User,
      value: '32',
      label: 'Team Member',
      iconColor: 'text-[#F58B1E]',
      bgColor: 'bg-[#F58B1E1A]',
    },
  ];
  if (loading) {
    return <JobManagementPageSkeleton />;
  }

  // Reusable job grid component
  const JobGrid = ({ jobs }: { jobs: Job[] }) => (
    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
      {jobs.map((job: Job) => {
        const {
          uuid,
          client_name,
          project_id,
          job_image,
          client_email,
          client_address,
          project_start_date,
        } = job;

        return (
          <JobCard
            key={job.id}
            job={{
              id: uuid,
              title: client_name || '-',
              jobId: project_id || '-',
              progress: 50, // Static value since not in API
              image:
                job_image ||
                'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
              email: client_email || '-',
              address: client_address || '-',
              startDate: project_start_date
                ? new Date(project_start_date).toLocaleDateString()
                : '-',
              daysLeft: 0, // Static value since not in API
            }}
          />
        );
      })}
    </div>
  );

  // Skeleton grid component for tab loading
  const JobSkeletonGrid = () => (
    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
      {[...Array(8)].map((_, index) => (
        <JobCardSkeleton key={`job-skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <div className=''>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 sm:gap-4 gap-2 mb-8'>
        {stats.map(stat => (
          <StatsCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            iconColor={stat.iconColor}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Jobs Grid */}
      <div>
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className='w-full'
        >
          <div className='flex flex-row items-center gap-2 w-full overflow-hidden max-w-full'>
            <DynamicScrollArea
              className='flex-1 rounded-full min-w-0 max-w-full'
              widthOptions={{
                mobilePadding: 40,
                tabletPadding: 48,
                desktopPadding: 56,
                maxMobileWidth: 640,
                maxTabletWidth: 768,
                maxLargeTabletWidth: 1024,
                defaultDesktopWidth: 180,
                buttonWidth: canEdit ? 70 : 0, // 48px button + 8px gap + 14px safety margin
                buttonWidthDesktop: canEdit ? 200 : 0, // Auto width button + gap + safety margin
              }}
            >
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal justify-start max-w-full overflow-hidden'>
                <TabsTrigger
                  value='newLeads'
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  New Leads
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'newLeads' ? 'bg-[var(--badge-bg)] text-white' : 'bg-transparent text-limebrand'}`}
                  >
                    {filterCounts.new_leads}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value='info'
                  className='hidden px-4 py-2 text-sm xl:text-base gap-3 transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Need Attention{' '}
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'info' ? 'bg-sidebarpurple text-white' : 'bg-transparent text-sidebarpurple'}`}
                  >
                    {filterCounts.need_attention}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value='ongoingJob'
                  className='hidden px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Ongoing Job
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'ongoingJob' ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                  >
                    {filterCounts.ongoing_jobs}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value='waitingOnClient'
                  className='hidden px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  {filterCounts.waiting_on_client}
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'closed' ? 'bg-greenbrand text-white' : 'bg-transparent text-greenbrand'}`}
                  >
                    {filterCounts.waiting_on_client || 0}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value='archive'
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Archived
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'archive' ? 'bg-graybrand text-white' : 'bg-transparent text-graybrand'}`}
                  >
                    {filterCounts.archived}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value='closed'
                  className=' px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Closed
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === 'closed' ? 'bg-greenbrand text-white' : 'bg-transparent text-greenbrand'}`}
                  >
                    {filterCounts.closed || 0}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </DynamicScrollArea>
            {canEdit && (
              <button
                onClick={() => setIsOpen(true)}
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-8 text-base text-center !h-12 sm:!h-12 !w-12 sm:!w-auto rounded-full'
              >
                <Add size='18' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline text-base'>
                  {JOB_MESSAGES.ADD_JOB_BUTTON}
                </span>
              </button>
            )}
          </div>
          <TabsContent value='newLeads' className='pt-8'>
            {tabLoading ? (
              <JobSkeletonGrid />
            ) : jobs.length === 0 ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <JobGrid jobs={jobs} />
            )}
          </TabsContent>

          <TabsContent value='info' className='pt-8'>
            <ComingSoon />
          </TabsContent>

          <TabsContent value='ongoingJob' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value='waitingOnClient' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value='closed' className='pt-8'>
            {tabLoading ? (
              <JobSkeletonGrid />
            ) : jobs.length === 0 ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <JobGrid jobs={jobs} />
            )}
          </TabsContent>
          <TabsContent value='archive' className='pt-8'>
            {tabLoading ? (
              <JobSkeletonGrid />
            ) : jobs.length === 0 ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <JobGrid jobs={jobs} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SideSheet
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (!open) {
            setGeneratedLink(''); // Clear generated link when opening form
            fetchJobsByTab(selectedTab);
            fetchFilterCounts();
          }
        }}
        title={JOB_MESSAGES.ADD_JOB_TITLE}
      >
        <CreateJobForm
          onSubmit={handleCreateJob}
          isSubmitting={isSubmitting}
          generatedLink={generatedLink}
          onCancel={() => {
            setIsOpen(false);
          }}
        />
      </SideSheet>
    </div>
  );
}
