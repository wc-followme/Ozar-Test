'use client';

import { FIVE_BOX_SLUGS } from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import { HomeOwnerHeader } from '@/components/layout/HomeOwnerHeader';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { ThankYouComponent } from '@/components/shared/common/ThankYouComponent';
import { StepCategory } from '@/components/shared/forms/StepCategory';
import { StepEstimation } from '@/components/shared/forms/StepEstimation';
import { StepGeneralInfo } from '@/components/shared/forms/StepGeneralInfo';
import { StepProjectInfo } from '@/components/shared/forms/StepProjectInfo';
import { StepPropertyInfo } from '@/components/shared/forms/StepPropertyInfo';
import { showErrorToast, showSuccessToast } from '@/components/ui/use-toast';
import { ROLE_IDS, ROUTES } from '@/constants/common';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HOME_OWNER_MESSAGES } from '../home-owner-messages';
import {
  CategoryData,
  GeneralInfoData,
  HomeOwnerFormData,
  JOB_BOXES_STEPS,
  JobData,
  ProjectInfoData,
  PropertyInfoData,
  WIZARD_STEPS,
  WizardStep,
} from '../home-owner-types';

export default function HomeOwnerWizardPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, handleAuthError, user } = useAuth();
  const uuid = params['uuid'] as string;

  // Job data state
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard step state - start with first available step
  const [step, setStep] = useState<WizardStep | null>(null);

  // Form data state
  const [generalInfoData, setGeneralInfoData] =
    useState<GeneralInfoData | null>(null);
  const [propertyInfoData, setPropertyInfoData] = useState<any | null>(null);
  const [projectInfoData, setProjectInfoData] =
    useState<ProjectInfoData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [estimationData, setEstimationData] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string | null>(null); // Store company UUID from job data

  // State for Thank You component
  const [showThankYou, setShowThankYou] = useState(false);

  // Helper function to convert 24-hour format to 12-hour format
  const convert24To12Hour = (time24: string): string => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours || '0', 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const minutesStr = minutes || '00';

    return `${hour12.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
  };

  // Helper function to convert 12-hour format to 24-hour format
  const convert12To24Hour = (time12: string): string => {
    if (!time12) return '';

    const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return time12;

    let hour = parseInt(match[1] || '0', 10);
    const minutes = match[2] || '00';
    const ampm = (match[3] || 'AM').toUpperCase();

    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
  };

  // Box settings state
  const [boxSettings, setBoxSettings] = useState<any>(null);

  // Question JSON state for all steps in one state with complete question data
  const [questionsByStep, setQuestionsByStep] = useState<
    Record<string, { id: string; text: string; answer: string }[]>
  >({
    [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: [],
    [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: [],
    [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: [],
  });

  // Fetch box settings
  const fetchBoxSettings = async () => {
    if (!companyId) {
      return;
    }

    try {
      const response = await apiService.getBoxSettings({
        company_id: companyId,
      });

      if (response.statusCode === 200 && response.data) {
        setBoxSettings(response.data);
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
            project_name,
            preferred_contact_method,
            contact_start_time,
            contact_end_time,
            project_start_date,
            project_finish_date,
            budget,
            preferred_contractor,
            property_type,
            property_type_detail,
            bhk,
            floor,
            age_of_property,
            approx_sq_ft,
            daily_work_start_time,
            daily_work_end_time,
            owner_present_need,
            weekend_work,
            has_animals,
            pet_type,
            category_id,
            company,
            question_json,
          } = job;
          const { uuid: companyUuid } = company || {};

          if (companyUuid) {
            setCompanyId(companyUuid);
          }

          // Initialize questionsByStep from existing question_json
          if (question_json) {
            setQuestionsByStep(question_json);
          }
          // Reset general info data
          setGeneralInfoData({
            fullName: client_name || '',
            email: client_email || '',
            phone: client_phone_number || '',
            address: client_address || '',
            preferredContactMethod: preferred_contact_method || '',
            contactStartTime: contact_start_time
              ? convert24To12Hour(contact_start_time)
              : '',
            contactEndTime: contact_end_time
              ? convert24To12Hour(contact_end_time)
              : '',
            animals: has_animals ? 'Yes' : 'No',
            petType: pet_type || '',
          });

          // Reset property info data
          setPropertyInfoData({
            property: property_type || 'COMMERCIAL',
            propertyType: property_type_detail || '', // Use property_type_detail from API
            bhk: bhk ? bhk.toString() : '',
            floor: floor === 0 ? 'ground' : floor ? floor.toString() : '',
            approxSqFt: approx_sq_ft
              ? `${approx_sq_ft}-${approx_sq_ft + 500}`
              : '',
            ageOfProperty: age_of_property || '0-5',
          });

          // Reset project info data
          setProjectInfoData({
            projectName: project_name || '',
            projectStartDate: project_start_date
              ? new Date(project_start_date).toISOString()
              : '',
            projectFinishDate: project_finish_date
              ? new Date(project_finish_date).toISOString()
              : '',
            ownerPresence: owner_present_need ? 'yes' : 'no',
            weekendWork: weekend_work ? 'yes' : 'no',
            dailyWorkTimingStart: daily_work_start_time
              ? convert24To12Hour(daily_work_start_time)
              : '',
            dailyWorkTimingEnd: daily_work_end_time
              ? convert24To12Hour(daily_work_end_time)
              : '',
            budget: budget ? budget.toString() : '',
            preferredContractor: preferred_contractor || '',
            questions: [],
          });

          // Reset category data
          setCategoryData({
            selectedType: category_id || '',
          });

          // Reset estimation data
          //setEstimationData({});
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
  // Sequential order of steps
  const SEQUENTIAL_STEPS = [
    'FIRST',
    'SECOND',
    'THIRD',
    'FOURTH',
    'FIFTH',
  ] as const;
  // Get job boxes step from job data - handle as array
  const jobBoxesStepArray = jobData?.job_boxes_step || [];
  const jobBoxesStep = SEQUENTIAL_STEPS.filter(step =>
    (jobBoxesStepArray as string[]).includes(step)
  );

  const getNextStep = () => {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return null;

    const currentSequentialIndex = SEQUENTIAL_STEPS.indexOf(
      currentStepKey as any
    );
    if (currentSequentialIndex === -1) return null;

    // Find the next step in sequential order that exists in jobBoxesStep
    for (let i = currentSequentialIndex + 1; i < SEQUENTIAL_STEPS.length; i++) {
      const nextStep = SEQUENTIAL_STEPS[i];
      if (nextStep && jobBoxesStep.includes(nextStep)) {
        return nextStep;
      }
    }
    return null;
  };

  const getPreviousStep = () => {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return null;

    const currentSequentialIndex = SEQUENTIAL_STEPS.indexOf(
      currentStepKey as any
    );
    if (currentSequentialIndex === -1) return null;

    // Find the previous step in sequential order that exists in jobBoxesStep
    for (let i = currentSequentialIndex - 1; i >= 0; i--) {
      const prevStep = SEQUENTIAL_STEPS[i];
      if (prevStep && jobBoxesStep.includes(prevStep)) {
        return prevStep;
      }
    }
    return null;
  };

  // Set initial step based on available jobBoxesStep
  useEffect(() => {
    if (step) {
      return;
    }
    if (jobBoxesStep.length > 0) {
      // Find the first step in sequential order that exists in jobBoxesStep
      const firstStep = SEQUENTIAL_STEPS.find(step =>
        jobBoxesStep.includes(step)
      );
      const stepMapping: Record<string, WizardStep> = {
        FIRST: WIZARD_STEPS.GENERAL,
        SECOND: WIZARD_STEPS.PROPERTY,
        THIRD: WIZARD_STEPS.OPTIONAL,
        FOURTH: WIZARD_STEPS.PROJECT_TYPE,
        FIFTH: WIZARD_STEPS.ESTIMATION,
      };
      setStep(
        stepMapping[firstStep as keyof typeof stepMapping] ||
          WIZARD_STEPS.GENERAL
      );
    }
  }, [jobBoxesStep]);

  const getCurrentStepKey = () => {
    if (!step) return null;
    const stepMapping: Record<string, string> = {
      [WIZARD_STEPS.GENERAL]: 'FIRST',
      [WIZARD_STEPS.PROPERTY]: 'SECOND',
      [WIZARD_STEPS.OPTIONAL]: 'THIRD',
      [WIZARD_STEPS.PROJECT_TYPE]: 'FOURTH',
      [WIZARD_STEPS.ESTIMATION]: 'FIFTH',
    };
    return stepMapping[step];
  };

  const goToNextStep = () => {
    const nextStepKey = getNextStep();
    if (nextStepKey) {
      const stepMapping: Record<string, WizardStep> = {
        FIRST: WIZARD_STEPS.GENERAL,
        SECOND: WIZARD_STEPS.PROPERTY,
        THIRD: WIZARD_STEPS.OPTIONAL,
        FOURTH: WIZARD_STEPS.PROJECT_TYPE,
        FIFTH: WIZARD_STEPS.ESTIMATION,
      };
      setStep(stepMapping[nextStepKey] || WIZARD_STEPS.GENERAL);
    }
  };

  const goToPreviousStep = () => {
    const prevStepKey = getPreviousStep();
    if (prevStepKey) {
      const stepMapping: Record<string, WizardStep> = {
        FIRST: WIZARD_STEPS.GENERAL,
        SECOND: WIZARD_STEPS.PROPERTY,
        THIRD: WIZARD_STEPS.OPTIONAL,
        FOURTH: WIZARD_STEPS.PROJECT_TYPE,
        FIFTH: WIZARD_STEPS.ESTIMATION,
      };
      setStep(stepMapping[prevStepKey] || WIZARD_STEPS.GENERAL);
    }
  };

  const goToSkipTarget = () => {
    const targetStep = getSkipToEstimationTarget();
    if (targetStep) {
      const stepMapping: Record<string, WizardStep> = {
        FIRST: WIZARD_STEPS.GENERAL,
        SECOND: WIZARD_STEPS.PROPERTY,
        THIRD: WIZARD_STEPS.OPTIONAL,
        FOURTH: WIZARD_STEPS.PROJECT_TYPE,
        FIFTH: WIZARD_STEPS.ESTIMATION,
      };
      setStep(stepMapping[targetStep] || WIZARD_STEPS.GENERAL);
    } else {
      // If no estimation step available, show thank you page
      setShowThankYou(true);
    }
  };

  const isLastStep = () => {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return true;

    const currentSequentialIndex = SEQUENTIAL_STEPS.indexOf(
      currentStepKey as any
    );
    if (currentSequentialIndex === -1) return true;

    // Check if there's a next step in sequential order
    for (let i = currentSequentialIndex + 1; i < SEQUENTIAL_STEPS.length; i++) {
      const nextStep = SEQUENTIAL_STEPS[i];
      if (nextStep && jobBoxesStep.includes(nextStep)) {
        return false; // There is a next step
      }
    }
    return true; // No next step found
  };

  const isFirstStep = () => {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return true;

    const currentSequentialIndex = SEQUENTIAL_STEPS.indexOf(
      currentStepKey as any
    );
    if (currentSequentialIndex === -1) return true;

    // Check if there's a previous step in sequential order
    for (let i = currentSequentialIndex - 1; i >= 0; i--) {
      const prevStep = SEQUENTIAL_STEPS[i];
      if (prevStep && jobBoxesStep.includes(prevStep)) {
        return false; // There is a previous step
      }
    }
    return true; // No previous step found
  };

  // Form submission handlers
  const handleGeneralInfoSubmit = (
    data: GeneralInfoData,
    questions?: { id: string; text: string; answer: string }[]
  ) => {
    setGeneralInfoData(data);
    if (questions) {
      setQuestionsByStep(prev => ({
        ...prev,
        [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: questions,
      }));
    }
    if (isLastStep()) {
      // Submit only general info with current questions
      const currentQuestions = questions
        ? {
            ...questionsByStep,
            [FIVE_BOX_SLUGS.GENERAL_INFORMATION]: questions,
          }
        : {};
      handleFinalSubmit({ generalInfo: data }, currentQuestions);
    } else {
      // Move to next step
      goToNextStep();
    }
  };
  const handlePropertyInfoSubmit = (
    data: PropertyInfoData,
    questions?: { id: string; text: string; answer: string }[]
  ) => {
    setPropertyInfoData(data);
    if (questions) {
      setQuestionsByStep(prev => ({
        ...prev,
        [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: questions,
      }));
    }
    if (isLastStep()) {
      // Submit general + property info with current questions
      const currentQuestions = questions
        ? {
            ...questionsByStep,
            [FIVE_BOX_SLUGS.PROPERTY_INFORMATION]: questions,
          }
        : questionsByStep;
      handleFinalSubmit(
        {
          generalInfo: generalInfoData!,
          propertyInfo: data,
        },
        currentQuestions
      );
    } else {
      // Move to next step
      goToNextStep();
    }
  };

  const handleProjectInfoSubmit = (
    data: ProjectInfoData,
    questions?: { id: string; text: string; answer: string }[]
  ) => {
    setProjectInfoData(data);
    if (questions) {
      setQuestionsByStep(prev => ({
        ...prev,
        [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: questions,
      }));
    }
    if (isLastStep()) {
      // Submit general + property + project info with current questions
      const currentQuestions = questions
        ? {
            ...questionsByStep,
            [FIVE_BOX_SLUGS.PROJECT_INFORMATION]: questions,
          }
        : questionsByStep;
      handleFinalSubmit(
        {
          generalInfo: generalInfoData!,
          propertyInfo: propertyInfoData!,
          projectInfo: data,
        },
        currentQuestions
      );
    } else {
      // Move to next step
      goToNextStep();
    }
  };

  const handleCategorySubmit = (data: CategoryData) => {
    setCategoryData(data);
    if (isLastStep()) {
      // Submit all data with current questions
      handleFinalSubmit(
        {
          generalInfo: generalInfoData!,
          propertyInfo: propertyInfoData!,
          projectInfo: projectInfoData!,
          category: data,
        },
        questionsByStep
      );
    } else {
      // Move to next step
      goToNextStep();
    }
  };

  const handleEstimationSubmit = (data: any) => {
    setEstimationData(data);
    if (isLastStep()) {
      // Submit all data with current questions
      handleFinalSubmit(
        {
          generalInfo: generalInfoData!,
          propertyInfo: propertyInfoData!,
          projectInfo: projectInfoData!,
          category: categoryData!,
          estimation: data,
        },
        questionsByStep
      );
    } else {
      // Move to next step
      goToNextStep();
    }
  };

  const handleFinalSubmit = async (
    allData: HomeOwnerFormData,
    currentQuestions?: Record<
      string,
      { id: string; text: string; answer: string }[]
    >
  ) => {
    try {
      // Use provided questions or fall back to state
      const questionsToProcess = currentQuestions || questionsByStep;

      // Prepare API payload
      const payload: any = {};
      const {
        generalInfo,
        propertyInfo,
        projectInfo,
        category,
        estimation: _estimation,
      } = allData;

      // Map general info data
      if (generalInfo) {
        const {
          fullName,
          email,
          phone,
          address,
          animals,
          petType,
          preferredContactMethod,
          contactStartTime,
          contactEndTime,
        } = generalInfo;
        if (fullName && fullName.trim() !== '') {
          payload.client_name = fullName;
        }
        if (email && email.trim() !== '') {
          payload.client_email = email;
        }
        if (phone && phone.trim() !== '') {
          payload.client_phone_number = phone;
        }
        if (address && address.trim() !== '') {
          payload.client_address = address;
        }
        payload.has_animals = animals === 'Yes';
        if (petType && petType.trim() !== '') {
          payload.pet_type = petType;
        }
        if (preferredContactMethod && preferredContactMethod.trim() !== '') {
          payload.preferred_contact_method =
            preferredContactMethod.toLowerCase();
        }
        if (contactStartTime && contactStartTime.trim() !== '') {
          payload.contact_start_time = convert12To24Hour(contactStartTime);
        }
        if (contactEndTime && contactEndTime.trim() !== '') {
          payload.contact_end_time = convert12To24Hour(contactEndTime);
        }
      }

      // Map property info data
      if (propertyInfo) {
        const {
          property,
          propertyType,
          bhk,
          floor,
          approxSqFt,
          ageOfProperty,
        } = propertyInfo;
        if (property && property.trim() !== '') {
          payload.property_type = property.toUpperCase();
        }
        if (propertyType && propertyType.trim() !== '') {
          payload.property_type_detail = propertyType;
        }
        if (bhk && bhk.trim() !== '') {
          payload.bhk = parseInt(bhk, 10);
        }
        if (floor && floor.trim() !== '') {
          payload.floor = floor === 'ground' ? 0 : parseInt(floor, 10);
        }
        if (approxSqFt && approxSqFt.trim() !== '') {
          payload.approx_sq_ft = parseInt(approxSqFt.split('-')[0] || '0', 10);
        }
        if (ageOfProperty && ageOfProperty.trim() !== '') {
          payload.age_of_property = ageOfProperty;
        }
      }

      // Map project info data
      if (projectInfo) {
        if (projectInfo.projectName && projectInfo.projectName.trim() !== '') {
          payload.project_name = projectInfo.projectName;
        }

        // Convert date objects to YYYY-MM-DD format
        if (projectInfo.projectStartDate) {
          const startDate = new Date(projectInfo.projectStartDate);
          if (!isNaN(startDate.getTime())) {
            payload.project_start_date = startDate.toISOString().split('T')[0];
          }
        }

        if (projectInfo.projectFinishDate) {
          const finishDate = new Date(projectInfo.projectFinishDate);
          if (!isNaN(finishDate.getTime())) {
            payload.project_finish_date = finishDate
              .toISOString()
              .split('T')[0];
          }
        }

        payload.owner_present_need = projectInfo.ownerPresence === 'yes';
        payload.weekend_work = projectInfo.weekendWork === 'yes';

        if (
          projectInfo.dailyWorkTimingStart &&
          projectInfo.dailyWorkTimingStart.trim() !== ''
        ) {
          payload.daily_work_start_time = convert12To24Hour(
            projectInfo.dailyWorkTimingStart
          );
        }
        if (
          projectInfo.dailyWorkTimingEnd &&
          projectInfo.dailyWorkTimingEnd.trim() !== ''
        ) {
          payload.daily_work_end_time = convert12To24Hour(
            projectInfo.dailyWorkTimingEnd
          );
        }

        if (projectInfo.budget && projectInfo.budget.trim() !== '') {
          payload.budget =
            parseInt(projectInfo.budget.replace(/[^0-9]/g, '')) || 0;
        }

        if (
          projectInfo.preferredContractor &&
          projectInfo.preferredContractor.trim() !== ''
        ) {
          payload.preferred_contractor = projectInfo.preferredContractor;
        }
      }

      // Map category data
      if (category) {
        payload.category_id = category.selectedType || '';
      }

      // Add existing job data if available
      if (jobData) {
        const job = jobData!;

        payload.company_id = Number(job.company_id) || null;
        payload.client_id = job.client_id || null;
        payload.job_image = job.job_image || '';

        payload.latitude = job.latitude || '';
        payload.longitude = job.longitude || '';
        payload.job_status = job.job_status || 'PENDING';
        payload.job_privacy = job.job_privacy || 'PUBLIC';
        payload.status = job.status || 'ACTIVE';
      }

      // Sort job_boxes_step in sequential order before saving
      const sortedJobBoxesStep = SEQUENTIAL_STEPS.filter(step =>
        jobBoxesStep.includes(step)
      );
      payload.job_boxes_step = sortedJobBoxesStep;

      // Process questionsByStep to match API format
      const processedQuestionJson: Record<string, any[]> = {};

      Object.entries(questionsToProcess).forEach(([stepKey, stepQuestions]) => {
        if (
          stepQuestions &&
          Array.isArray(stepQuestions) &&
          stepQuestions.length > 0
        ) {
          processedQuestionJson[stepKey] = stepQuestions;
        }
      });

      payload.question_json = processedQuestionJson;

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
      FIFTH: {
        key: WIZARD_STEPS.ESTIMATION,
        label: HOME_OWNER_MESSAGES.ESTIMATION_LABEL,
      },
    };

    // Sort steps in sequential order
    const sortedSteps = SEQUENTIAL_STEPS.filter(step =>
      jobBoxesStep.includes(step)
    )
      .map(step => stepMapping[step])
      .filter(step => step);

    return sortedSteps;
  };

  const steps = getSteps();

  const totalSteps = steps.length;

  // Get current step position in sequential order
  const getCurrentStepPosition = () => {
    const currentStepKey = getCurrentStepKey();
    if (!currentStepKey) return 0;

    const sequentialSteps = SEQUENTIAL_STEPS.filter(step =>
      jobBoxesStep.includes(step)
    );
    return sequentialSteps.indexOf(currentStepKey as any);
  };

  const currentStepPosition = getCurrentStepPosition();

  // Helper function to determine if Previous button should be shown
  const shouldShowPreviousButton = () => {
    return jobBoxesStep.length > 1 && !isFirstStep();
  };

  // Helper function to determine target step for skip to estimation
  const getSkipToEstimationTarget = () => {
    if (jobBoxesStep.includes('FOURTH')) {
      return 'FOURTH';
    } else if (jobBoxesStep.includes('FIFTH')) {
      return 'FIFTH';
    }
    return null;
  };

  // Helper function to check if user is a contractor
  const isContractor = () => {
    return isAuthenticated && user?.role?.id === ROLE_IDS.CONTRACTOR;
  };

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
                    {steps.map((_, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          className={`w-4 md:w-6 h-4 md:h-6 shrink-0 rounded-full flex items-center justify-center z-10 ${currentStepPosition >= idx ? 'bg-green-600' : 'bg-gray-300'}`}
                        />
                        {/* Line (except after last circle) */}
                        {idx < totalSteps - 1 && (
                          <div
                            className={`h-1 md:h-2 w-[50px] md:w-[120px] -mx-[1px] xl:w-[180px] ${currentStepPosition > idx ? 'bg-green-600' : 'bg-gray-300'}`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            {/* Wizard Steps */}
            {step === WIZARD_STEPS.GENERAL &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.FIRST) &&
              (() => {
                return (
                  <StepGeneralInfo
                    onNext={handleGeneralInfoSubmit}
                    defaultValues={generalInfoData}
                    isLastStep={isLastStep()}
                    boxSettings={boxSettings}
                    allQuestionJson={jobData?.question_json || {}}
                    questionJson={
                      questionsByStep[FIVE_BOX_SLUGS.GENERAL_INFORMATION] || []
                    }
                    showSkipToEstimation={isContractor()}
                    onSkipToEstimation={goToSkipTarget}
                  />
                );
              })()}
            {step === WIZARD_STEPS.PROPERTY &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.SECOND) && (
                <StepPropertyInfo
                  {...(shouldShowPreviousButton() && {
                    onPrev: goToPreviousStep,
                  })}
                  onNext={handlePropertyInfoSubmit}
                  cancelButtonClass={cancelButtonClass}
                  defaultValues={propertyInfoData}
                  isLastStep={isLastStep()}
                  boxSettings={boxSettings}
                  allQuestionJson={jobData?.question_json || {}}
                  questionJson={
                    questionsByStep[FIVE_BOX_SLUGS.PROPERTY_INFORMATION] || []
                  }
                  showSkipToEstimation={isContractor()}
                  onSkipToEstimation={goToSkipTarget}
                />
              )}
            {step === WIZARD_STEPS.OPTIONAL &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.THIRD) && (
                <StepProjectInfo
                  {...(shouldShowPreviousButton() && {
                    onPrev: goToPreviousStep,
                  })}
                  onNext={handleProjectInfoSubmit}
                  cancelButtonClass={cancelButtonClass}
                  defaultValues={projectInfoData}
                  isLastStep={isLastStep()}
                  boxSettings={boxSettings}
                  allQuestionJson={jobData?.question_json || {}}
                  questionJson={
                    questionsByStep[FIVE_BOX_SLUGS.PROJECT_INFORMATION] || []
                  }
                  company_id={companyId || ''}
                  showSkipToEstimation={isContractor()}
                  onSkipToEstimation={goToSkipTarget}
                />
              )}
            {step === WIZARD_STEPS.PROJECT_TYPE &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.FOURTH) &&
              (() => {
                return companyId ? (
                  <StepCategory
                    {...(shouldShowPreviousButton() && {
                      onPrev: goToPreviousStep,
                    })}
                    onSubmit={handleCategorySubmit}
                    cancelButtonClass={cancelButtonClass}
                    defaultValues={categoryData as any}
                    isLastStep={isLastStep()}
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
            {step === WIZARD_STEPS.ESTIMATION &&
              jobBoxesStep.includes(JOB_BOXES_STEPS.FIFTH) && (
                <StepEstimation
                  {...(shouldShowPreviousButton() && {
                    onPrev: goToPreviousStep,
                  })}
                  onSubmit={handleEstimationSubmit}
                  cancelButtonClass={cancelButtonClass}
                  defaultValues={estimationData}
                  isLastStep={isLastStep()}
                  jobId={uuid}
                  categoryId={categoryData?.selectedType}
                />
                // <EstimateComponent
                //   breadcrumbData={breadcrumbData}
                //   onAddRoom={handleAddRoom}
                //   jobId={uuid}
                //   onSaveSuccess={() => {
                //     // Success handling is now done via toast messages in EstimationBox
                //   }}
                //   onSaveError={_error => {
                //     // Error handling is now done via toast messages in EstimationBox
                //   }}
                // />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
