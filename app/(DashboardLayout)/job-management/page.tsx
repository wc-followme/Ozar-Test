'use client';
import AccessDenied from '@/components/shared/common/AccessDenied';

import ComingSoon from '@/components/shared/common/ComingSoon';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { CreateJobForm } from '@/components/shared/forms/CreateJobForm';
import JobManagementPageSkeleton from '@/components/shared/skeleton/JobManagementPageSkeleton';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
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

import { ArchiveTab } from './components/ArchiveTab';
import { JobTabsList } from './components/JobTabsList';
import { NewLeadsTab } from './components/NewLeadsTab';
import { JOB_MESSAGES } from './job-messages';
import { CreateJobFormData, Job, JobFilterCounts } from './types';

export default function JobManagement() {
  // Destructure constants for better readability
  const { ACTIVE, INACTIVE } = CommonStatus;
  const { NEW_LEADS, ALL, ARCHIVED} = JobFilterType;
  const { DONE, PENDING } = JobStatus;
  const { HOME_OWNER } = ROUTES;
  const { JOBS_LIMIT } = PAGINATION;
  const { BASE_URL } = APP_CONFIG;
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

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]); // Replace mockJobs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [_page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [boxDefaults, setBoxDefaults] = useState<Array<{
    id: string;
    enabled: boolean;
  }> | null>(null);
  const [questionJson, setQuestionJson] = useState<any>(null);
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
    `${BASE_URL}${HOME_OWNER}/${jobUuid}`;

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

  // Fetch 5-box default selections for the selected company
  const fetchBoxDefaults = useCallback(async () => {
    try {
      const company_id = getCompanyId();
      const response = await apiService.getBoxSettings(
        company_id ? { company_id } : {}
      );
      if (response.statusCode === 200 && response.data) {
        const { default_selected_json, question_json } = response.data;
        setBoxDefaults(default_selected_json);
        setQuestionJson(question_json);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      // Non-critical: ignore toast for this auxiliary fetch
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
            params.job_status = PENDING;
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
            params.type = ARCHIVED;
            params.job_status = DONE;
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
  }, [selectedTab, fetchFilterCounts, fetchJobsByTab]);

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

  // Effect to fetch box defaults when form opens
  useEffect(() => {
    if (isOpen) {
      fetchBoxDefaults();
    }
  }, [isOpen, fetchBoxDefaults]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // Handle job restoration
  const handleRestoreJob = async (uuid: string) => {
    try {
      // Find the job to get its current job_status
      const job = jobs.find(j => j.uuid === uuid);
      
      const updatePayload: any = { status: ACTIVE };
      
      // Add job_status update conditionally
      if (job?.job_status === DONE) {
        updatePayload.job_status = 'PENDING';
      }
     
      const response = await apiService.updateJob(uuid, updatePayload);
      showSuccessToast(
        extractApiSuccessMessage(response, JOB_MESSAGES.RESTORE_SUCCESS)
      );
      
      // Remove the restored job from the current list immediately
      setJobs(prev => prev.filter(job => job.uuid !== uuid));
      
      // Refresh jobs and counts to reflect latest server state
      await fetchJobsByTab(selectedTab, 1, false);
      fetchFilterCounts();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, JOB_MESSAGES.RESTORE_ERROR);
      showErrorToast(message);
    }
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
      // Prepare payload for API
      const payload: any = {
        client_name,
        client_email,
        client_phone_number,
        job_privacy,
        job_boxes_step,
        question_json: questionJson,
      };

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
        if (!job_boxes_step || job_boxes_step.length === 0) {
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

  // Scroll handler for infinite loading
  const handleScroll = useCallback((tab: string) => (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (loading || tabLoading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = target;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchJobsByTab(tab, nextPage, true);
        return nextPage;
      });
    }
  }, [loading, tabLoading, hasMore, fetchJobsByTab]);

  // Only show full page skeleton on initial load
  if (loading) {
    return <JobManagementPageSkeleton />;
  }

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
      <h2 className='page-title sm:mb-6 mb-4 xl:mb-8'>Projects</h2>
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
          <JobTabsList
            selectedTab={selectedTab}
            filterCounts={filterCounts}
            canEdit={canEdit || false}
            onCreateJob={() => setIsOpen(true)}
            buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
          />
          <NewLeadsTab
            jobs={jobs}
            loading={loading}
            tabLoading={tabLoading}
            onScroll={handleScroll(NEW_LEADS_TAB)}
            onCreateJob={() => setIsOpen(true)}
          />

          <TabsContent value={INFO} className='pt-4 sm:pt-8'>
            <ScrollArea className='h-[calc(100vh_-_276px)]'>
              <ComingSoon />
            </ScrollArea>
          </TabsContent>

          <TabsContent value={ONGOING_JOB} className='p-8'>
            <ScrollArea className='h-[calc(100vh_-_276px)]'>
              <NoDataFound buttonText='Create Job' />
            </ScrollArea>
          </TabsContent>
          <TabsContent value={WAITING_ON_CLIENT} className='p-8'>
            <ScrollArea className='h-[calc(100vh_-_276px)]'>
              <NoDataFound buttonText='Create Job' />
            </ScrollArea>
          </TabsContent>
          <ArchiveTab
            jobs={jobs}
            loading={loading}
            tabLoading={tabLoading}
            onScroll={handleScroll(ARCHIVE)}
            onCreateJob={() => setIsOpen(true)}
            onRestoreJob={handleRestoreJob}
          />
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
          boxDefaults={boxDefaults}
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
