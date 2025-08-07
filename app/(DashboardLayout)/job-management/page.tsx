'use client';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';

import { JobCard } from '@/components/shared/cards/JobCard';
import AccessDenied from '@/components/shared/common/AccessDenied';
import { AppointmentsComponent } from '@/components/shared/common/AppointmentsComponent';
import ComingSoon from '@/components/shared/common/ComingSoon';
import { DynamicScrollArea } from '@/components/shared/common/DynamicScrollArea';
import SideSheet from '@/components/shared/common/SideSheet';
import { CreateJobForm } from '@/components/shared/forms/CreateJobForm';
import { JobCardSkeleton } from '@/components/shared/skeleton/JobCardSkeleton';
import JobManagementPageSkeleton from '@/components/shared/skeleton/JobManagementPageSkeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  APP_CONFIG,
  CommonStatus,
  JOB_TABS,
  JobFilterType,
  JobStatus,
  PAGINATION,
  ROUTES,
} from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { JOB_MESSAGES } from './job-messages';
import { CreateJobFormData, Job, JobFilterCounts } from './types';

export default function JobManagement() {
  // Destructure constants for better readability
  const { ACTIVE, INACTIVE } = CommonStatus;
  const { NEW_LEADS, ALL } = JobFilterType;
  const { DONE } = JobStatus;
  const { HOME_OWNER } = ROUTES;
  const { JOBS_LIMIT } = PAGINATION;
  const {
    NEW_LEADS: NEW_LEADS_TAB,
    INFO,
    ONGOING_JOB,
    WAITING_ON_CLIENT,
    ARCHIVE,
    CLOSED,
  } = JOB_TABS;

  const [selectedTab, setSelectedTab] = useState<string>(NEW_LEADS_TAB);
  const [isOpen, setIsOpen] = useState(false);
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]); // Replace mockJobs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const isInitialMount = useRef(true);
  const isInitialDataLoaded = useRef(false);
  const isInitialTabSet = useRef(false);

  // Get user permissions for jobs
  const userPermissions = getUserPermissionsFromStorage();

  const canEdit = userPermissions?.jobs?.edit;
  const canViewJobs = userPermissions?.jobs?.view;

  // Helper function to generate home-owner link
  const generateHomeOwnerLink = (jobUuid: string) =>
    `${APP_CONFIG.BASE_URL}${HOME_OWNER}/${jobUuid}`;

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
      // Get selected company ID using global utility function
      const company_id = getCompanyId();

      const params = company_id ? { company_id } : {};
      const response = await apiService.fetchJobStatistics(params);
      if (response.data) {
        setFilterCounts(response.data);
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }
      // Error handled silently - filter counts are not critical
    }
  }, [handleAuthError]);

  // Function to fetch jobs based on selected tab
  const fetchJobsByTab = useCallback(
    async (tab: string, targetPage = 1, append = false) => {
      try {
        if (targetPage === 1) {
          // Only use loading for initial page load, use tabLoading for tab changes
          if (isInitialMount.current) {
            setLoading(true);
          } else {
            setTabLoading(true);
          }
        } else {
          setTabLoading(true);
        }
        // Get selected company ID using global utility function
        const company_id = getCompanyId();

        const params: any = {
          page: targetPage,
          limit: JOBS_LIMIT,
          ...(company_id ? { company_id } : {}),
        };

        // Set parameters based on selected tab
        switch (tab) {
          case NEW_LEADS_TAB:
            params.status = ACTIVE;
            params.type = NEW_LEADS;
            break;
          case INFO:
            return;
          // params.status = ACTIVE;
          // params.type = NEED_ATTENTION;
          // break;
          case ONGOING_JOB:
            return;
          // params.status = ACTIVE;
          // params.type = ONGOING;
          // break;
          case WAITING_ON_CLIENT:
            return;
          // params.status = ACTIVE;
          // params.type = WAITING_ON_CLIENT;
          // break;
          case ARCHIVE:
            params.status = INACTIVE;
            params.type = ALL;
            break;
          case CLOSED:
            params.status = ACTIVE;
            params.type = ALL;
            params.job_status = DONE;
            break;
          default:
            params.status = ACTIVE;
            params.type = ALL;
        }

        const response = await apiService.fetchJobs(params);

        // Handle different possible response structures
        let newJobs: Job[] = [];
        let total = 0;

        if (response && response.data) {
          // If data is directly an array
          if (Array.isArray(response.data)) {
            newJobs = response.data;
            total = response.data.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (response.data.data && Array.isArray(response.data.data)) {
            newJobs = response.data.data;
            total = response.data.total || response.data.data.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(response)) {
            newJobs = response;
            total = response.length;
          }
        }

        setJobs(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(job => job.uuid));
            const uniqueNewJobs = newJobs.filter(
              job => !existingUuids.has(job.uuid)
            );
            return [...prev, ...uniqueNewJobs];
          } else {
            return newJobs;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * JOBS_LIMIT < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(err, JOB_MESSAGES.FETCH_ERROR);
        showErrorToast(message);
        if (!append) setJobs([]);
        setHasMore(false);
      } finally {
        if (targetPage === 1) {
          // Only use loading for initial page load, use tabLoading for tab changes
          if (isInitialMount.current) {
            setLoading(false);
            isInitialMount.current = false;
          } else {
            setTabLoading(false);
          }
        } else {
          setTabLoading(false);
        }
      }
    },
    [
      showErrorToast,
      handleAuthError,
      JOBS_LIMIT,
      ACTIVE,
      INACTIVE,
      NEW_LEADS,
      ALL,
      DONE,
      NEW_LEADS_TAB,
      INFO,
      ONGOING_JOB,
      WAITING_ON_CLIENT,
      ARCHIVE,
      CLOSED,
    ]
  );

  // Handle company changes and initial data loading
  const refetchJobs = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setJobs([]);
    fetchJobsByTab(selectedTab, 1, false);
    fetchFilterCounts();
    isInitialDataLoaded.current = true;
  }, [selectedTab]);

  useCompanyChange(refetchJobs);

  // Fallback effect to ensure loading is turned off after a timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        isInitialMount.current = false;
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Effect to fetch jobs when selected tab changes
  useEffect(() => {
    // Skip fetching for tabs that don't have API data
    if (
      selectedTab === INFO ||
      selectedTab === ONGOING_JOB ||
      selectedTab === WAITING_ON_CLIENT
    ) {
      return;
    }

    // Skip initial call if this is the first time the tab is set
    if (!isInitialTabSet.current) {
      isInitialTabSet.current = true;
      return;
    }

    // Skip if data is not yet loaded by useCompanyChange
    if (!isInitialDataLoaded.current) {
      return;
    }

    // Reset pagination for new tab
    setPage(1);
    setHasMore(true);
    setJobs([]);
    fetchJobsByTab(selectedTab, 1, false);
  }, [selectedTab]); // Remove fetchJobsByTab from dependencies

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        !tabLoading &&
        hasMore
      ) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchJobsByTab(selectedTab, nextPage, true);
          return nextPage;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, tabLoading, hasMore, fetchJobsByTab, selectedTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // Handle job creation
  const handleCreateJob = async (data: CreateJobFormData) => {
    // Destructure form data for cleaner code
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

      // Add company_id to payload
      const companyId = getCompanyId();
      if (companyId) {
        payload.company_id = companyId;
      }

      // Call API using apiService
      const response = await apiService.createJob(payload);

      // Destructure response data for cleaner code
      const { data: responseData } = response;

      if (responseData) {
        // Generate home-owner link with job UUID
        const jobUuid = responseData?.uuid || responseData?.id;
        const homeOwnerLink = jobUuid ? generateHomeOwnerLink(jobUuid) : null;

        showSuccessToast(
          extractApiSuccessMessage(response, JOB_MESSAGES.CREATE_SUCCESS)
        );

        // Set the generated link
        if (homeOwnerLink) {
          setGeneratedLink(homeOwnerLink);
        }
        if (job_boxes_step?.length === 0) {
          setIsOpen(false);
          setGeneratedLink('');
          fetchJobsByTab(selectedTab, 1, false);
          fetchFilterCounts();
        }
        // Refresh jobs and counts after successful creation
      } else {
        showErrorToast(response.message || JOB_MESSAGES.CREATE_ERROR);
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, JOB_MESSAGES.CREATE_ERROR);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show full page skeleton on initial load
  if (loading) {
    return <JobManagementPageSkeleton />;
  }

  // Reusable job grid component
  const JobGrid = ({ jobs }: { jobs: Job[] }) => (
    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
      {jobs.map((job: Job) => {
        // Destructure job data for cleaner code
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
      {[...Array(4)].map((_, index) => (
        <JobCardSkeleton key={`job-skeleton-${index}`} />
      ))}
    </div>
  );

  // Check if user has permission to view jobs
  if (userPermissions && !canViewJobs) {
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
      <h2 className='page-title mb-6'>Jobs</h2>
      {/* Stats Cards */}
      {/* <div className='grid grid-cols-2 lg:grid-cols-4 md:gap-6 sm:gap-4 gap-2 mb-8'>
        {stats.map(stat => {
          // Destructure stat data for cleaner code
          const { id, icon, value, label, iconColor, bgColor } = stat;
          return (
            <StatsCard
              key={id}
              icon={icon}
              value={value}
              label={label}
              iconColor={iconColor}
              bgColor={bgColor}
            />
          );
        })}
      </div> */}

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
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full overflow-hidden shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                <TabsTrigger
                  value={NEW_LEADS_TAB}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal  data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      New Leads
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === NEW_LEADS_TAB ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
                    >
                      {filterCounts.new_leads}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={INFO}
                  className='hidden px-4 py-2 text-sm xl:text-base gap-3 transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Need Attention{' '}
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === INFO ? 'bg-sidebarpurple text-white' : 'bg-transparent text-sidebarpurple'}`}
                  >
                    {filterCounts.need_attention}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value={ONGOING_JOB}
                  className='hidden px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Ongoing Job
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === ONGOING_JOB ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                  >
                    {filterCounts.ongoing_jobs}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={WAITING_ON_CLIENT}
                  className='hidden px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  {filterCounts.waiting_on_client}
                  <Badge
                    className={`py-[2px] px-[10px] text-sm font-medium rounded-lg ${selectedTab === WAITING_ON_CLIENT ? 'bg-greenbrand text-white' : 'bg-transparent text-greenbrand'}`}
                  >
                    {filterCounts.waiting_on_client || 0}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value={ARCHIVE}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal  data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Archived
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === ARCHIVE ? 'bg-graybrand text-white shadow-sm sm:shadow-none' : 'bg-transparent text-graybrand'}`}
                    >
                      {filterCounts.archived}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value={CLOSED}
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal  data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Closed
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === CLOSED ? 'bg-greenbrand text-white shadow-sm sm:shadow-none' : 'bg-transparent text-greenbrand'}`}
                    >
                      {filterCounts.closed || 0}
                    </Badge>
                  </span>
                </TabsTrigger>
              </TabsList>
            </DynamicScrollArea>
            {canEdit && (
              <div className='flex gap-3'>
                <button
                  onClick={() => setIsOpen(true)}
                  className='btn-primary !hidden sm:!flex items-center shrink-0 justify-center !px-0 sm:!px-8 text-base text-center !h-12 sm:!h-12 !w-12 sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto w-14 h-14 sm:w-auto sm:h-12 shadow-2xl sm:shadow-none hover:shadow-3xl sm:hover:shadow-none shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] sm:shadow-none hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.4)] sm:hover:shadow-none'
                >
                  <span className='hidden sm:inline text-base'>
                    {JOB_MESSAGES.ADD_JOB_BUTTON}
                  </span>
                </button>
                <button
                  onClick={() => setIsAppointmentsOpen(true)}
                  className='btn-secondary !hidden sm:!flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-base text-center !h-12 sm:!h-12 !w-12 sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-20 z-50 sm:z-auto w-14 h-14 sm:w-auto sm:h-12 shadow-2xl sm:shadow-none hover:shadow-3xl sm:hover:shadow-none shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] sm:shadow-none hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.4)] sm:hover:shadow-none'
                >
                  <span className='hidden sm:inline text-base'>
                    Add Appointments
                  </span>
                </button>
              </div>
            )}
          </div>
          <TabsContent
            value={NEW_LEADS_TAB}
            className='pt-4 sm:pt-8 lg:max-h-[calc(100vh_-_298px)] overflow-auto'
          >
            {jobs.length === 0 && (loading || tabLoading) ? (
              // Show skeleton for initial loading or tab loading
              <JobSkeletonGrid />
            ) : jobs.length === 0 && !loading && !tabLoading ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <>
                <JobGrid jobs={jobs} />
                {/* Loading more jobs */}
                {tabLoading && jobs.length > 0 && (
                  <div className='w-full text-center py-4'>
                    <LoadingComponent variant='inline' size='md' text={''} />
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value={INFO} className='pt-4 sm:pt-8'>
            <ComingSoon />
          </TabsContent>

          <TabsContent value={ONGOING_JOB} className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value={WAITING_ON_CLIENT} className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value={CLOSED} className='pt-4 sm:pt-8'>
            {jobs.length === 0 && (loading || tabLoading) ? (
              // Show skeleton for initial loading or tab loading
              <JobSkeletonGrid />
            ) : jobs.length === 0 && !loading && !tabLoading ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <>
                <JobGrid jobs={jobs} />
                {/* Loading more jobs */}
                {tabLoading && jobs.length > 0 && (
                  <div className='w-full text-center py-4'>
                    <LoadingComponent variant='inline' size='md' text={''} />
                  </div>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value={ARCHIVE} className='pt-4 sm:pt-8'>
            {jobs.length === 0 && (loading || tabLoading) ? (
              // Show skeleton for initial loading or tab loading
              <JobSkeletonGrid />
            ) : jobs.length === 0 && !loading && !tabLoading ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <>
                <JobGrid jobs={jobs} />
                {/* Loading more jobs */}
                {tabLoading && jobs.length > 0 && (
                  <div className='w-full text-center py-4'>
                    <LoadingComponent variant='inline' size='md' text={''} />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SideSheet
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (!open) {
            if (generatedLink) {
              fetchJobsByTab(selectedTab, 1, false);
              fetchFilterCounts();
            }
            setGeneratedLink(''); // Clear generated link when opening form
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

      {/* Appointments Side Sheet */}
      <SideSheet
        open={isAppointmentsOpen}
        onOpenChange={setIsAppointmentsOpen}
        title='Add Appointments'
        size='800px'
      >
        <div className='space-y-4'>
          <AppointmentsComponent />
        </div>
      </SideSheet>
    </div>
  );
}
