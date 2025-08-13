'use client';

import { HomeOwnerHeader } from '@/components/layout/HomeOwnerHeader';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { ThankYouComponent } from '@/components/shared/common/ThankYouComponent';
import { StepGeneralInfo } from '@/components/shared/forms/StepGeneralInfo';
import { StepOptionalDetails } from '@/components/shared/forms/StepOptionalDetails';
import { StepProjectType } from '@/components/shared/forms/StepProjectType';
import { StepPropertyInfo } from '@/components/shared/forms/StepPropertyInfo';
import { showErrorToast, showSuccessToast } from '@/components/ui/use-toast';
import { ROUTES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HOME_OWNER_MESSAGES } from '../home-owner-messages';
import {
  GeneralInfoData,
  HomeOwnerFormData,
  JOB_BOXES_STEPS,
  JobData,
  OptionalDetailsData,
  ProjectTypeData,
  PropertyInfoData,
  WIZARD_STEPS,
  WizardStep,
} from '../home-owner-types';

export default function HomeOwnerWizardPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, handleAuthError } = useAuth();
  const uuid = params['uuid'] as string;

  // Job data state
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard step state - start with first available step
  const [step, setStep] = useState<WizardStep>(WIZARD_STEPS.GENERAL);

  // Form data state
  const [generalInfoData, setGeneralInfoData] =
    useState<GeneralInfoData | null>(null);
  const [propertyInfoData, setPropertyInfoData] = useState<any | null>(null);
  const [optionalDetailsData, setOptionalDetailsData] =
    useState<OptionalDetailsData | null>(null);
  const [projectTypeData, setProjectTypeData] =
    useState<ProjectTypeData | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null); // Store company UUID from job data

  // State for Thank You component
  const [showThankYou, setShowThankYou] = useState(false);

  // Box settings state
  const [boxSettings, setBoxSettings] = useState<any>(null);

  // Fetch box settings
  const fetchBoxSettings = async () => {
    if (!companyId) {
      console.log('Company ID not available for box settings');
      return;
    }

    try {
      const response = await apiService.getBoxSettings({
        company_id: companyId,
      });

      if (response.statusCode === 200 && response.data) {
        setBoxSettings(response.data);
        console.log('Box settings loaded:', response.data);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch box settings:', err);
      // Don't show error toast for box settings as it's not critical
    }
  };

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      if (!uuid) {
        setError(HOME_OWNER_MESSAGES.NO_UUID_ERROR);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.fetchJobById(uuid);
        const { data } = response;
        const job = data || response;
        setJobData(job);

        // Set company ID in state

        // Reset form data based on existing job data
        if (job) {
          const {
            client_name,
            client_email,
            client_phone_number,
            client_address,

            property_type,
            age_of_property,
            approx_sq_ft,
            notification_style,
            daily_work_start_time,
            daily_work_end_time,
            owner_present_need,
            weekend_work,
            has_animals,
            pet_type,
            category_id,
            company,
          } = job;
          const { uuid: companyUuid } = company || {};

          if (companyUuid) {
            setCompanyId(companyUuid);
          }
          // Reset general info data
          setGeneralInfoData({
            fullName: client_name || '',
            email: client_email || '',
            phone: client_phone_number || '',
            address: client_address || '',
            preferredContactMethod: '',
            contactStartTime: '',
            contactEndTime: '',
            animals: has_animals ? 'Yes' : 'No',
            petType: pet_type || '',
          });

          // Reset property info data
          setPropertyInfoData({
            property: property_type?.toLowerCase() || 'residential',
            propertyType: '', // Will be set based on property type
            bhk: '',
            floor: '',
            approxSqFt: approx_sq_ft ? approx_sq_ft.toString() : '',
            ageOfProperty: age_of_property || '0-5',
          });

          // Reset optional details data
          setOptionalDetailsData({
            typeOfProperty: property_type
              ? property_type.toLowerCase().charAt(0).toUpperCase() +
                property_type.toLowerCase().slice(1)
              : 'Residential',
            ageOfProperty: age_of_property || '0-5 years',
            approxSqft: approx_sq_ft ? approx_sq_ft.toString() : '',
            notificationStyle: notification_style || 'Email',
            dailyWorkStart: daily_work_start_time || '',
            dailyWorkEnd: daily_work_end_time || '',
            ownerPresent: owner_present_need ? 'Yes' : 'No',
            weekendWork: weekend_work ? 'Yes' : 'No',
            animals: has_animals ? 'Yes' : 'No',
            petType: pet_type || '',
          });

          // Reset project type data
          setProjectTypeData({
            selectedType: category_id ? category_id.toString() : '',
          });
        }
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show error if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          HOME_OWNER_MESSAGES.JOB_FETCH_ERROR
        );
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [uuid]);

  // Fetch box settings when companyId is available
  useEffect(() => {
    if (companyId) {
      fetchBoxSettings();
    }
  }, [companyId]);

  // Get job boxes step from job data - handle as array
  const jobBoxesStepArray = jobData?.job_boxes_step || [];
  const jobBoxesStep = Array.isArray(jobBoxesStepArray)
    ? jobBoxesStepArray
    : [jobBoxesStepArray || JOB_BOXES_STEPS.THIRD];

  // Set initial step based on available jobBoxesStep
  useEffect(() => {
    if (jobBoxesStep.length > 0) {
      if (jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST)) {
        setStep(WIZARD_STEPS.GENERAL);
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND)) {
        setStep(WIZARD_STEPS.PROPERTY);
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)) {
        setStep(WIZARD_STEPS.OPTIONAL);
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
        setStep(WIZARD_STEPS.PROJECT_TYPE);
      }
    }
  }, [jobBoxesStep]);

  // Navigation handlers - navigate to next available step
  // const goToGeneral = () => {
  //   if (jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST)) {
  //     setStep(WIZARD_STEPS.GENERAL);
  //   }
  // };
  const goToProperty = () => {
    if (jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND)) {
      setStep(WIZARD_STEPS.PROPERTY);
    }
  };
  const goToOptional = () => {
    if (jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)) {
      setStep(WIZARD_STEPS.OPTIONAL);
    }
  };
  const goToProjectType = () => {
    if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
      setStep(WIZARD_STEPS.PROJECT_TYPE);
    }
  };

  // Form submission handlers
  const handleGeneralInfoSubmit = (data: GeneralInfoData) => {
    setGeneralInfoData(data);
    if (
      jobBoxesStep.length === 1 &&
      jobBoxesStep[0] === JOB_BOXES_STEPS.FIRST
    ) {
      // Submit only general info
      handleFinalSubmit({ generalInfo: data });
    } else {
      // Move to next available step
      if (jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND)) {
        goToProperty();
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)) {
        goToOptional();
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
        goToProjectType();
      }
    }
  };

  const handlePropertyInfoSubmit = (data: PropertyInfoData) => {
    setPropertyInfoData(data);
    if (
      jobBoxesStep.length === 2 &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND)
    ) {
      // Submit general + property info
      handleFinalSubmit({
        generalInfo: generalInfoData!,
        propertyInfo: data,
      });
    } else {
      // Move to next available step
      if (jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)) {
        goToOptional();
      } else if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
        goToProjectType();
      }
    }
  };

  const handleOptionalDetailsSubmit = (data: OptionalDetailsData) => {
    setOptionalDetailsData(data);
    if (
      jobBoxesStep.length === 3 &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND) &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)
    ) {
      // Submit general + property + optional info
      handleFinalSubmit({
        generalInfo: generalInfoData!,
        propertyInfo: propertyInfoData!,
        optionalDetails: data,
      });
    } else {
      // Move to next step if FOURTH is available
      if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
        goToProjectType();
      }
    }
  };

  const handleOptionalDetailsSkip = () => {
    if (
      jobBoxesStep.length === 3 &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND) &&
      jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)
    ) {
      // Submit general + property info (skip optional)
      handleFinalSubmit({
        generalInfo: generalInfoData!,
        propertyInfo: propertyInfoData!,
      });
    } else {
      // Move to next step if FOURTH is available
      if (jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH)) {
        goToProjectType();
      }
    }
  };

  const handleProjectTypeSubmit = (data: ProjectTypeData) => {
    setProjectTypeData(data);
    // Submit all data
    handleFinalSubmit({
      generalInfo: generalInfoData!,
      propertyInfo: propertyInfoData!,
      optionalDetails: optionalDetailsData!,
      projectType: data,
    });
  };

  const handleFinalSubmit = async (allData: HomeOwnerFormData) => {
    try {
      // Prepare API payload
      const payload: any = {};

      // Map general info data
      if (allData.generalInfo) {
        const generalInfo = allData.generalInfo!;
        payload.client_name = generalInfo.fullName || '';
        payload.client_email = generalInfo.email || '';
        payload.client_phone_number = generalInfo.phone || '';
        payload.client_address = generalInfo.address || '';
        payload.has_animals = generalInfo.animals === 'Yes';
        payload.pet_type = generalInfo.petType || '';

        // Handle questions separately (questions are passed separately from form data)
        const questions = (allData as any).questions;
        if (
          questions &&
          Object.keys(questions).length > 0 &&
          boxSettings?.question_json
        ) {
          // Process questions for all sections
          const processedQuestionJson: Record<string, any[]> = {};

          Object.entries(boxSettings.question_json).forEach(
            ([section, sectionQuestions]) => {
              const sectionAnswers = (sectionQuestions as any[])
                .filter((q: any) => questions[q.id]) // Only include questions that have answers
                .map((q: any) => ({
                  id: q.id,
                  text: q.text,
                  answer: questions[q.id] || '',
                }));

              if (sectionAnswers.length > 0) {
                processedQuestionJson[section] = sectionAnswers;
              }
            }
          );

          if (Object.keys(processedQuestionJson).length > 0) {
            payload.question_json = processedQuestionJson;
          }
        }
      }

      // Map optional details data
      if (allData.optionalDetails) {
        const optionalDetails = allData.optionalDetails!;
        payload.property_type =
          optionalDetails.typeOfProperty?.toUpperCase() || 'RESIDENTIAL';
        payload.age_of_property = optionalDetails.ageOfProperty || '';
        payload.approx_sq_ft =
          parseInt(optionalDetails.approxSqft?.replace(/[^0-9]/g, '')) || 0;
        payload.notification_style =
          optionalDetails.notificationStyle || 'Email';
        if (optionalDetails.dailyWorkStart) {
          payload.daily_work_start_time = optionalDetails.dailyWorkStart;
        }
        if (optionalDetails.dailyWorkEnd) {
          payload.daily_work_end_time = optionalDetails.dailyWorkEnd;
        }
        payload.owner_present_need = optionalDetails.ownerPresent === 'Yes';
        payload.weekend_work = optionalDetails.weekendWork === 'Yes';
        payload.has_animals = optionalDetails.animals === 'Yes';
        if (payload.has_animals === true) {
          payload.pet_type = optionalDetails.petType || '';
        }
      }

      // Map project type data
      if (allData.projectType) {
        const projectType = allData.projectType!;
        payload.category_id = Number(projectType.selectedType) || null;
      }

      // Add existing job data if available
      if (jobData) {
        const job = jobData!;

        payload.company_id = Number(job.company_id) || null;
        payload.client_id = job.client_id || null;
        payload.job_image = job.job_image || '';
        payload.project_name = job.project_name || '';
        payload.latitude = job.latitude || '';
        payload.longitude = job.longitude || '';
        payload.job_status = job.job_status || 'PENDING';
        payload.job_privacy = job.job_privacy || 'PUBLIC';
        payload.status = job.status || 'ACTIVE';
      }

      payload.job_boxes_step = jobBoxesStep;

      // Call the API using apiService
      const response = await apiService.updateJob(uuid, payload);

      // Show success toast with API response message
      if (response && response.message) {
        showSuccessToast(response.message);

        // Check if user is logged in - redirect to job management, otherwise show thank you
        if (isAuthenticated) {
          router.push(ROUTES.JOB_MANAGEMENT);
        } else {
          setShowThankYou(true); // Show Thank You component for non-logged in users
        }
      } else {
        showSuccessToast(HOME_OWNER_MESSAGES.FORM_SUBMIT_SUCCESS);

        // Check if user is logged in - redirect to job management, otherwise show thank you
        if (isAuthenticated) {
          router.push(ROUTES.JOB_MANAGEMENT);
        } else {
          setShowThankYou(true); // Show Thank You component for non-logged in users
        }
      }

      // Redirect to job management page after a short delay
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        HOME_OWNER_MESSAGES.FORM_SUBMIT_ERROR
      );
      showErrorToast(message);
    } finally {
    }
  };

  // Progress indicator logic based on job_boxes_step array
  const getSteps = () => {
    // If no steps or empty array, default to THIRD
    if (!jobBoxesStep.length) {
      return [
        {
          key: WIZARD_STEPS.GENERAL,
          label: HOME_OWNER_MESSAGES.GENERAL_INFO_LABEL,
        },
        {
          key: WIZARD_STEPS.OPTIONAL,
          label: HOME_OWNER_MESSAGES.OPTIONAL_DETAILS_LABEL,
        },
        {
          key: WIZARD_STEPS.PROJECT_TYPE,
          label: HOME_OWNER_MESSAGES.PROJECT_TYPE_LABEL,
        },
      ];
    }

    // Map array steps to wizard steps
    const stepMapping: Record<string, any> = {
      FIRST: {
        key: WIZARD_STEPS.GENERAL,
        label: HOME_OWNER_MESSAGES.GENERAL_INFO_LABEL,
      },
      SECOND: {
        key: WIZARD_STEPS.PROPERTY,
        label: 'Property Information',
      },
      THIRD: {
        key: WIZARD_STEPS.OPTIONAL,
        label: HOME_OWNER_MESSAGES.OPTIONAL_DETAILS_LABEL,
      },
      FOURTH: {
        key: WIZARD_STEPS.PROJECT_TYPE,
        label: HOME_OWNER_MESSAGES.PROJECT_TYPE_LABEL,
      },
    };

    // Convert array to wizard steps, maintaining order
    return jobBoxesStep.map(step => stepMapping[step]).filter(step => step); // Remove undefined steps
  };

  const steps = getSteps();
  const stepIndex = steps.findIndex(({ key }) => key === step);
  const totalSteps = steps.length;

  // Cancel/Previous button class
  const cancelButtonClass =
    'h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center';

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
        <HomeOwnerHeader />
        <div className='flex-1 flex items-center justify-center'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
        <HomeOwnerHeader />
        <div className='mt-auto'>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-8 md:py-16 shadow-none'>
            <div className='flex items-center justify-center h-64'>
              <div className='text-lg text-red-600'>{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Thank You state
  if (showThankYou) {
    return (
      <ThankYouComponent
        title='Project Submitted Successfully!'
        message='Thank you for submitting your project details. Our team will review your information and contact you soon with next steps.'
      />
    );
  }

  return (
    <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
      <HomeOwnerHeader />
      {/* Centered content with background */}
      <div className='mt-auto'>
        <div className=''>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-4 md:py-8 shadow-none'>
            {/* Custom Progress Bar - Only show if not FIRST step */}
            {!(
              jobBoxesStep.length === 1 &&
              jobBoxesStep[0] === JOB_BOXES_STEPS.FIRST
            ) &&
              steps.length > 0 && (
                <div className='w-full flex justify-center mb-4 md:mb-8'>
                  <div className='flex items-center justify-center w-full max-w-2xl'>
                    {steps.map((s, idx) => (
                      <div
                        key={s.key}
                        className={`flex items-center ${idx !== 0 ? 'ml-0' : ''}`}
                      >
                        {/* Circle */}
                        <div
                          className={`w-4 md:w-6 h-4 md:h-6 rounded-full flex items-center justify-center z-10 ${stepIndex >= idx ? 'bg-green-600' : 'bg-gray-300'}`}
                        />
                        {/* Line (except after last circle) */}
                        {idx < totalSteps - 1 && (
                          <div
                            className={`h-1 md:h-2 w-[50px] md:w-[120px] -mx-[1px] xl:w-[180px] ${stepIndex > idx ? 'bg-green-600' : 'bg-gray-300'}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* Wizard Steps */}
            {step === WIZARD_STEPS.GENERAL &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) && (
                <StepGeneralInfo
                  onNext={handleGeneralInfoSubmit}
                  defaultValues={generalInfoData}
                  isLastStep={
                    jobBoxesStep.length === 1 &&
                    jobBoxesStep[0] === JOB_BOXES_STEPS.FIRST
                  }
                  boxSettings={boxSettings}
                  allQuestionJson={jobData?.question_json || {}}
                />
              )}
            {step === WIZARD_STEPS.PROPERTY &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND) && (
                <StepPropertyInfo
                  onNext={handlePropertyInfoSubmit}
                  defaultValues={propertyInfoData}
                  isLastStep={
                    jobBoxesStep.length === 2 &&
                    jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
                    jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND)
                  }
                  boxSettings={boxSettings}
                  allQuestionJson={jobData?.question_json || {}}
                />
              )}
            {step === WIZARD_STEPS.OPTIONAL &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD) && (
                <StepOptionalDetails
                  onPrev={goToProperty}
                  {...(jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH) && {
                    onSkip: handleOptionalDetailsSkip,
                  })}
                  onNext={handleOptionalDetailsSubmit}
                  cancelButtonClass={cancelButtonClass}
                  defaultValues={optionalDetailsData}
                  isLastStep={
                    (jobBoxesStep.length === 3 &&
                      jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
                      jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND) &&
                      jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD)) ||
                    (jobBoxesStep.length === 3 &&
                      jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD) &&
                      !jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH))
                  }
                />
              )}
            {step === WIZARD_STEPS.PROJECT_TYPE &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH) &&
              (() => {
                return companyId ? (
                  <StepProjectType
                    onPrev={goToOptional}
                    onSubmit={handleProjectTypeSubmit}
                    cancelButtonClass={cancelButtonClass}
                    defaultValues={projectTypeData as any}
                    isLastStep={true}
                    company_id={companyId}
                  />
                ) : (
                  <div className='flex items-center justify-center h-64'>
                    <div className='text-lg text-red-600'>
                      Company ID is required to load project types. Please
                      contact support.
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}
