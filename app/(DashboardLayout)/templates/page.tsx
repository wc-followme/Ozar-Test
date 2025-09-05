'use client';

import { TemplateListCard } from '@/components/shared/cards/TemplateListCard';
import { Dropdown } from '@/components/shared/common/Dropdown';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION, TEMPLATE_TYPES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, getCompanyId } from '@/lib/utils';
import {
  AddSquare,
  ArrowDown2,
  TableDocument,
  TaskSquare,
} from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { OptionBidIcon } from '../../../components/icons/OptionBidIcon';
import { Tool } from '../../../components/icons/Tool';
import { DynamicScrollArea } from '../../../components/shared/common/DynamicScrollArea';
import { TemplateApiData, TemplateData } from './template-types';

export default function TemplatesPage() {
  const router = useRouter();
  const { showErrorToast, showSuccessToast } = useToast();
  const { isAuthenticated, handleAuthError } = useAuth();
  const [selectedTab, setSelectedTab] = useState('estimate');
  const [initialLoading, setInitialLoading] = useState(true);

  // Separate state for each tab's templates and pagination
  const [tabTemplates, setTabTemplates] = useState<{
    [key: string]: {
      templates: TemplateApiData[];
      hasMore: boolean;
      currentPage: number;
    };
  }>({
    estimate: { templates: [], hasMore: true, currentPage: 1 },
    'service-option': { templates: [], hasMore: true, currentPage: 1 },
    tools: { templates: [], hasMore: true, currentPage: 1 },
    disclaimers: { templates: [], hasMore: true, currentPage: 1 },
    archive: { templates: [], hasMore: true, currentPage: 1 },
  });
  const [counts, setCounts] = useState({
    estimate: 0,
    serviceOptions: 0,
    tools: 0,
    disclaimers: 0,
    archive: 0,
    total: 0,
  });

  // Fetch templates from API with template_type filtering
  const fetchTemplates = useCallback(
    async (pageNum = 1, append = false, tabType?: string) => {
      try {
        // Check authentication first
        if (!isAuthenticated) {
          showErrorToast('Please log in to access templates.');
          router.push('/auth/login');
          return;
        }

        // Only show loading for initial load, not for infinite scroll
        if (!append) {
          setInitialLoading(true);
        }

        const companyId = getCompanyId();

        if (!companyId) {
          showErrorToast('Company ID not found. Please select a company.');
          return;
        }

        // Determine template_type based on tab
        const getTemplateType = (tab: string) => {
          switch (tab) {
            case 'estimate':
              return TEMPLATE_TYPES.ESTIMATE_TEMPLATES;
            case 'service-option':
              return TEMPLATE_TYPES.OPTION_BID_TEMPLATES;
            case 'tools':
              return TEMPLATE_TYPES.TOOL_TEMPLATES;
            case 'disclaimers':
              return TEMPLATE_TYPES.DISCLAIMER_TEMPLATES;
            default:
              return undefined; // For archive tab, don't filter by type
          }
        };

        const templateType = getTemplateType(tabType || selectedTab);
        const isArchive = (tabType || selectedTab) === 'archive';

        const response = await apiService.fetchTemplates({
          page: pageNum,
          limit: PAGINATION.TEMPLATES_LIMIT,
          company_id: companyId,
          status: isArchive ? 'INACTIVE' : 'ACTIVE',
          ...(templateType && { template_type: templateType }),
        });

        if (response.statusCode === 200 && response.data) {
          const { data: templatesData, totalPages } = response.data;
          const currentTab = tabType || selectedTab;

          setTabTemplates(prev => {
            const currentTabData = prev[currentTab] || {
              templates: [],
              hasMore: true,
              currentPage: 1,
            };

            if (append) {
              // Filter out duplicates when appending to prevent duplicate keys
              const existingUuids = new Set(
                currentTabData.templates.map(template => template.uuid)
              );
              const uniqueNewTemplates = templatesData.filter(
                (template: TemplateApiData) => !existingUuids.has(template.uuid)
              );
              return {
                ...prev,
                [currentTab]: {
                  templates: [
                    ...currentTabData.templates,
                    ...uniqueNewTemplates,
                  ],
                  hasMore: pageNum < totalPages,
                  currentPage: pageNum,
                },
              };
            } else {
              return {
                ...prev,
                [currentTab]: {
                  templates: templatesData,
                  hasMore: pageNum < totalPages,
                  currentPage: pageNum,
                },
              };
            }
          });
        } else {
          showErrorToast(
            extractApiErrorMessage(response, 'Failed to fetch templates.')
          );
          const currentTab = tabType || selectedTab;
          setTabTemplates(prev => ({
            ...prev,
            [currentTab]: {
              templates: append ? prev[currentTab]?.templates || [] : [],
              hasMore: false,
              currentPage: 1,
            },
          }));
        }
      } catch (error: any) {
        // Handle authentication errors
        if (handleAuthError(error)) {
          return; // Error was handled by auth context
        }

        showErrorToast(
          extractApiErrorMessage(error, 'Failed to fetch templates.')
        );
        const currentTab = tabType || selectedTab;
        setTabTemplates(prev => ({
          ...prev,
          [currentTab]: {
            templates: append ? prev[currentTab]?.templates || [] : [],
            hasMore: false,
            currentPage: 1,
          },
        }));
      } finally {
        if (!append) {
          setInitialLoading(false);
        }
      }
    },
    [showErrorToast, selectedTab, isAuthenticated, router, handleAuthError]
  );

  // Fetch counts for tabs
  const fetchTemplateCounts = useCallback(async () => {
    try {
      // Check authentication first
      if (!isAuthenticated) {
        return;
      }

      const companyId = getCompanyId();
      if (!companyId) {
        showErrorToast('Company ID not found. Please select a company.');
        return;
      }

      const response = await apiService.makeGenericRequest(
        `/templates/counts?company_id=${companyId}`,
        { method: 'GET' }
      );

      if (response?.statusCode === 200 && response?.data) {
        setCounts(response.data);
      } else {
        showErrorToast(
          extractApiErrorMessage(response, 'Failed to fetch template counts.')
        );
      }
    } catch (error: any) {
      // Handle authentication errors
      if (handleAuthError(error)) {
        return; // Error was handled by auth context
      }

      showErrorToast(
        extractApiErrorMessage(error, 'Failed to fetch template counts.')
      );
    }
  }, [showErrorToast, isAuthenticated, handleAuthError]);

  // Archive template handler
  const handleArchiveTemplate = useCallback(
    async (templateUuid: string) => {
      try {
        const response = await apiService.archiveTemplate(templateUuid);

        if (response.statusCode === 200) {
          showSuccessToast('Template archived successfully.');
          // Remove the archived template from all tab lists
          setTabTemplates(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(tab => {
              if (updated[tab]) {
                updated[tab] = {
                  ...updated[tab],
                  templates: updated[tab].templates.filter(
                    template => template.uuid !== templateUuid
                  ),
                };
              }
            });
            return updated;
          });
          fetchTemplateCounts();
        } else {
          showErrorToast(
            extractApiErrorMessage(response, 'Failed to archive template.')
          );
        }
      } catch (error: any) {
        // Handle authentication errors
        if (handleAuthError(error)) {
          return; // Error was handled by auth context
        }

        showErrorToast(
          extractApiErrorMessage(error, 'Failed to archive template.')
        );
      }
    },
    [showSuccessToast, showErrorToast, fetchTemplateCounts, handleAuthError]
  );

  // Retrieve (unarchive) template handler
  const handleRetrieveTemplate = useCallback(
    async (templateUuid: string) => {
      try {
        const response = await apiService.makeGenericRequest(
          `/templates/${templateUuid}/retrieve`,
          { method: 'PATCH' }
        );
        const { statusCode, message } = response || {};
        if (statusCode === 200) {
          showSuccessToast(message || 'Template retrieved successfully.');
          // Remove the retrieved template from the archive list in UI immediately
          setTabTemplates(prev => ({
            ...prev,
            archive: {
              templates:
                prev['archive']?.templates.filter(
                  t => t.uuid !== templateUuid
                ) || [],
              hasMore: prev['archive']?.hasMore || false,
              currentPage: prev['archive']?.currentPage || 1,
            },
          }));
          fetchTemplateCounts();
        } else {
          showErrorToast(
            extractApiErrorMessage(response, 'Failed to retrieve template.')
          );
        }
      } catch (error: any) {
        // Handle authentication errors
        if (handleAuthError(error)) {
          return; // Error was handled by auth context
        }

        showErrorToast(
          extractApiErrorMessage(error, 'Failed to retrieve template.')
        );
      }
    },
    [showSuccessToast, showErrorToast, fetchTemplateCounts, handleAuthError]
  );

  // Edit template handler
  const handleEditTemplate = useCallback(
    (templateUuid: string) => {
      router.push(`/templates/edit/${templateUuid}`);
    },
    [router]
  );

  // Handle tab change
  const handleTabChange = useCallback(
    (newTab: string) => {
      setSelectedTab(newTab);

      // If the tab doesn't have templates loaded yet, fetch them
      if (isAuthenticated && !tabTemplates[newTab]?.templates.length) {
        fetchTemplates(1, false, newTab);
      }
    },
    [isAuthenticated, tabTemplates, fetchTemplates]
  );

  // Fetch templates on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplates(1, false, selectedTab);
      fetchTemplateCounts();
    }
  }, [fetchTemplates, isAuthenticated, selectedTab]);

  // Infinite scroll with tab-specific pagination
  useEffect(() => {
    if (!isAuthenticated) return;

    let isLoadingMore = false;

    const handleScroll = () => {
      const currentTabData = tabTemplates[selectedTab];
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !isLoadingMore &&
        currentTabData?.hasMore
      ) {
        isLoadingMore = true;
        const nextPage = (currentTabData?.currentPage || 1) + 1;
        fetchTemplates(nextPage, true, selectedTab).finally(() => {
          isLoadingMore = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabTemplates, selectedTab, fetchTemplates, isAuthenticated]);

  // Get templates for each tab from tab-specific state
  const estimateTemplates = tabTemplates['estimate']?.templates || [];
  const serviceOptionTemplates =
    tabTemplates['service-option']?.templates || [];
  const toolsTemplates = tabTemplates['tools']?.templates || [];
  const disclaimersTemplates = tabTemplates['disclaimers']?.templates || [];
  const archiveTemplates = tabTemplates['archive']?.templates || [];

  // Archived templates by section for Archive tab
  const archivedEstimates = archiveTemplates.filter(
    template => template.template_type === TEMPLATE_TYPES.ESTIMATE_TEMPLATES
  );
  const archivedServiceOptions = archiveTemplates.filter(
    template => template.template_type === TEMPLATE_TYPES.OPTION_BID_TEMPLATES
  );
  const archivedTools = archiveTemplates.filter(
    template => template.template_type === TEMPLATE_TYPES.TOOL_TEMPLATES
  );
  const archivedDisclaimers = archiveTemplates.filter(
    template => template.template_type === TEMPLATE_TYPES.DISCLAIMER_TEMPLATES
  );

  // Transform API data to match TemplateListCard props based on template type
  const transformTemplateData = (
    template: TemplateApiData,
    targetType: string
  ): TemplateData => {
    const baseData = {
      id: template.uuid,
      templateName: template.name,
      createdDate: new Date(template.created_at).toLocaleDateString('en-GB'),
    };

    switch (targetType) {
      case 'estimate':
        return {
          ...baseData,
          type: 'estimate' as const,
          propertyType: 'Residential', // Default value since API doesn't provide this
          category: template.category?.name || 'Unknown',
          categoryColor: '#8B5CF6', // Default color
        };
      case 'service-option':
        return {
          ...baseData,
          type: 'service-option' as const,
          service: template.service?.name || 'Unknown Service',
          material: 'Default Material', // Default value since API doesn't provide this
        };
      case 'tools':
        return {
          ...baseData,
          type: 'tools' as const,
          service: template.service?.name || 'Unknown Service',
          material: 'Default Material', // Default value since API doesn't provide this
        };
      case 'disclaimer':
        return {
          ...baseData,
          type: 'disclaimer' as const,
          service: template.service?.name || 'Unknown Service',
          material: 'Default Material', // Default value since API doesn't provide this
        };
      default:
        return {
          ...baseData,
          type: 'estimate' as const,
          propertyType: 'Residential',
          category: template.category?.name || 'Unknown',
          categoryColor: '#8B5CF6',
        };
    }
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>Templates Management</h2>
          <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
            {/* Desktop Button */}
            <div className='hidden sm:block'>
              <Dropdown
                trigger={
                  <Button className='btn-primary flex items-center gap-2'>
                    <span className='text-base'>Create Templates</span>
                    <ArrowDown2
                      size={16}
                      color='currentColor'
                      className='[&_path]:stroke-[3px]'
                    />
                  </Button>
                }
                menuOptions={[
                  {
                    label: 'Estimate Template',
                    action: 'estimate',
                    icon: TaskSquare,
                  },
                  {
                    label: 'Service Options Template',
                    action: 'service-option',
                    icon: OptionBidIcon,
                  },
                  {
                    label: 'Tools Template',
                    action: 'tools',
                    icon: Tool,
                  },
                  {
                    label: 'Disclaimers Template',
                    action: 'disclaimers',
                    icon: TableDocument,
                  },
                ]}
                onAction={action => {
                  router.push(`/templates/create/${action}`);
                }}
              />
            </div>

            {/* Mobile Floating Action Button */}
            <div className='block sm:hidden'>
              <Dropdown
                trigger={
                  <Button className='btn-primary flex items-center justify-center !w-12 !h-12 rounded-full p-0 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 fixed bottom-6 right-6 z-50 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.4)]'>
                    <AddSquare size='24' color='#fff' className='!h-6 !w-6' />
                  </Button>
                }
                menuOptions={[
                  {
                    label: 'Estimate Template',
                    action: 'estimate',
                    icon: TaskSquare,
                  },
                  {
                    label: 'Service Options Template',
                    action: 'service-option',
                    icon: OptionBidIcon,
                    disabled: true,
                  },
                  {
                    label: 'Tools Template',
                    action: 'tools',
                    icon: Tool,
                  },
                  {
                    label: 'Disclaimers Template',
                    action: 'disclaimers',
                    icon: TableDocument,
                  },
                ]}
                onAction={action => {
                  router.push(`/templates/create/${action}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className='w-full'
        >
          <div className='flex flex-row items-center gap-2 w-full overflow-auto max-w-[calc(100vw_-_32px)] xl:max-w-full'>
            <DynamicScrollArea className='w-full'>
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1.5 sm:p-1 rounded-[32px] sm:rounded-[30px] h-auto font-normal justify-start max-w-full overflow-auto shadow-lg sm:shadow-none border border-[var(--border-dark)] sm:border-none'>
                <TabsTrigger
                  value='estimate'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Estimate
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'estimate' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-orangebrand'}`}
                    >
                      {counts.estimate}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='service-option'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Service Options
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'service-option' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-limebrand'}`}
                    >
                      {counts.serviceOptions}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='tools'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Tools
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'tools' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-yellowbrand'}`}
                    >
                      {counts.tools}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='disclaimers'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Disclaimers
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'disclaimers' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-cyanwave-main'}`}
                    >
                      {counts.disclaimers}
                    </Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value='archive'
                  className='px-6 sm:px-8 py-3 sm:py-2 text-sm xl:text-base gap-2 sm:gap-3 text-[var(--text-dark)] transition-all duration-300 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white data-[state=active]:shadow-lg sm:data-[state=active]:shadow-none rounded-[28px] sm:rounded-[30px] font-semibold sm:font-normal data-[state=active]:hover:bg-[var(--primary)]'
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-sm sm:text-sm xl:text-base'>
                      Archive
                    </span>
                    <Badge
                      className={`py-1 sm:py-[2px] px-2.5 sm:px-[10px] text-xs sm:text-sm font-bold sm:font-medium rounded-full sm:rounded-lg transition-all duration-300 ${selectedTab === 'archive' ? 'bg-[var(--badge-bg)] text-white shadow-sm sm:shadow-none' : 'bg-transparent text-[var(--text-secondary)]'}`}
                    >
                      {counts.archive}
                    </Badge>
                  </span>
                </TabsTrigger>
              </TabsList>
            </DynamicScrollArea>
          </div>

          {/* Estimate Tab Content */}
          <TabsContent value='estimate' className='mt-6'>
            {initialLoading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
              </div>
            ) : estimateTemplates.length === 0 ? (
              <NoDataFound
                title='No estimate templates found'
                description='Create your first estimate template to get started.'
                showButton={false}
              />
            ) : (
              <>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {estimateTemplates.map(template => (
                    <TemplateListCard
                      key={template.uuid}
                      template={transformTemplateData(template, 'estimate')}
                      onEdit={() => handleEditTemplate(template.uuid)}
                      onDelete={() => handleArchiveTemplate(template.uuid)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Service Options (Option Bid) Tab Content */}
          <TabsContent value='service-option' className='mt-6'>
            {/* <ComingSoon message="We're actively building this feature to make your experience even better. Got ideas or feedback? We'd love to hear them!" /> */}

            {/* Original dynamic code - commented out for now */}

            {initialLoading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
              </div>
            ) : serviceOptionTemplates.length === 0 ? (
              <NoDataFound
                title='No service option templates found'
                description='Create a service option template to manage options quickly.'
                showButton={false}
                
              />
            ) : (
              <>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {serviceOptionTemplates.map(template => (
                    <TemplateListCard
                      key={template.uuid}
                      template={transformTemplateData(
                        template,
                        'service-option'
                      )}
                      onEdit={() => handleEditTemplate(template.uuid)}
                      onDelete={() => handleArchiveTemplate(template.uuid)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Tools Tab Content */}
          <TabsContent value='tools' className='mt-6'>
            {initialLoading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
              </div>
            ) : toolsTemplates.length === 0 ? (
              <NoDataFound
                title='No tools templates found'
                description='Create a tools template to reuse tool lists across templates.'
                showButton={false}
              />
            ) : (
              <>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {toolsTemplates.map(template => (
                    <TemplateListCard
                      key={template.uuid}
                      template={transformTemplateData(template, 'tools')}
                      onEdit={() => handleEditTemplate(template.uuid)}
                      onDelete={() => handleArchiveTemplate(template.uuid)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Disclaimers Tab Content */}
          <TabsContent value='disclaimers' className='mt-6'>
            {initialLoading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
              </div>
            ) : disclaimersTemplates.length === 0 ? (
              <NoDataFound
                title='No disclaimer templates found'
                description='Create a disclaimer template to standardize your disclaimers.'
                showButton={false}
              />
            ) : (
              <>
                <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                  {disclaimersTemplates.map(template => (
                    <TemplateListCard
                      key={template.uuid}
                      template={transformTemplateData(template, 'disclaimer')}
                      onEdit={() => handleEditTemplate(template.uuid)}
                      onDelete={() => handleArchiveTemplate(template.uuid)}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            {initialLoading ? (
              <div className='flex justify-center items-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]'></div>
              </div>
            ) : archiveTemplates.length === 0 ? (
              <NoDataFound
                title='No archived templates found'
                description='Archived templates will appear here.'
                showButton={false}
              />
            ) : (
              <div className='space-y-8'>
                {/* Estimate Section */}
                <div>
                  <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                    Estimate
                  </h3>
                  {archivedEstimates.length === 0 ? (
                    <div className='py-6 text-sm text-[var(--text-secondary)]'>
                      No estimate templates found
                    </div>
                  ) : (
                    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                      {archivedEstimates.map(template => (
                        <TemplateListCard
                          key={template.uuid}
                          template={transformTemplateData(template, 'estimate')}
                          isArchived={true}
                          onRetrieve={() =>
                            handleRetrieveTemplate(template.uuid)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Options Section */}
                <div>
                  <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                    Service Options
                  </h3>
                  {archivedServiceOptions.length === 0 ? (
                    <div className='py-6 text-sm text-[var(--text-secondary)]'>
                      No service option templates found
                    </div>
                  ) : (
                    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                      {archivedServiceOptions.map(template => (
                        <TemplateListCard
                          key={template.uuid}
                          template={transformTemplateData(
                            template,
                            'service-option'
                          )}
                          isArchived={true}
                          onRetrieve={() =>
                            handleRetrieveTemplate(template.uuid)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tools Section */}
                <div>
                  <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                    Tools
                  </h3>
                  {archivedTools.length === 0 ? (
                    <div className='py-6 text-sm text-[var(--text-secondary)]'>
                      No tools templates found
                    </div>
                  ) : (
                    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                      {archivedTools.map(template => (
                        <TemplateListCard
                          key={template.uuid}
                          template={transformTemplateData(template, 'tools')}
                          isArchived={true}
                          onRetrieve={() =>
                            handleRetrieveTemplate(template.uuid)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Disclaimers Section */}
                <div>
                  <h3 className='text-base font-semibold text-[var(--text-dark)] mb-4'>
                    Disclaimers
                  </h3>
                  {archivedDisclaimers.length === 0 ? (
                    <div className='py-6 text-sm text-[var(--text-secondary)]'>
                      No disclaimer templates found
                    </div>
                  ) : (
                    <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
                      {archivedDisclaimers.map(template => (
                        <TemplateListCard
                          key={template.uuid}
                          template={transformTemplateData(
                            template,
                            'disclaimer'
                          )}
                          isArchived={true}
                          onRetrieve={() =>
                            handleRetrieveTemplate(template.uuid)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
