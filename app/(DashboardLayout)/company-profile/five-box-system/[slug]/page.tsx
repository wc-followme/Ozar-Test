'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import {
  FieldItem,
  FieldManagementSwitch,
} from '@/components/shared/common/FieldManagementSwitch';
import SideSheet from '@/components/shared/common/SideSheet';
import { DynamicForm, getFormConfig } from '@/components/shared/dynamicforms';
import {
  CreateQuestionForm,
  QuestionFormData,
} from '@/components/shared/forms/CreateQuestionForm';
import { SlugPageSkeleton } from '@/components/shared/skeleton/SlugPageSkeleton';
import CategoryComponent from '@/components/Templates/CategoryComponent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ROUTES } from '@/constants/common';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, getCompanyId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo, useState } from 'react';
import { FIVE_BOX_SLUGS, SLUG_TITLES } from '../five-box-slug-constants';
import { CATEGORY_DATA } from './slug-constants';
import { SLUG_MESSAGES } from './slug-messages';
import { PageProps, QuestionItem } from './slug-types';

const DynamicBoxPage = ({ params }: PageProps) => {
  const router = useRouter();
  const { slug } = use(params);
  const config = getFormConfig(slug);
  const { handleAuthError } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isQuestionSheetOpen, setIsQuestionSheetOpen] = useState(false);
  const [isFieldManagementOpen, setIsFieldManagementOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [questionJson, setQuestionJson] = useState<any>({});
  const [fieldStatusJson, setFieldStatusJson] = useState<any>({});
  // Category data from constants
  const categoryData = [...CATEGORY_DATA];

  // Fetch box settings from API
  const fetchBoxSettings = useCallback(async () => {
    try {
      setLoading(true);

      // Get fresh company ID inside the function
      const currentCompanyId = getCompanyId();

      const response = await apiService.getBoxSettings({
        company_id: currentCompanyId,
      });

      if (response.statusCode === 200 && response.data) {
        const { field_status_json, question_json } = response.data;

        // Handle field_status_json for the current slug
        if (field_status_json) {
          setFieldStatusJson(field_status_json);
          if (field_status_json[slug]) {
            const slugFieldStatus = field_status_json[slug];

            // Update field states based on API response
            setFieldStates(prev =>
              prev.map(field => {
                const fieldStatus = slugFieldStatus[field.id];
                return fieldStatus
                  ? { ...field, enabled: fieldStatus.enabled }
                  : field;
              })
            );
          }
        }

        // Handle question_json for the current slug
        if (question_json) {
          setQuestionJson(question_json);
          if (question_json[slug]) {
            setQuestions(question_json[slug]);
          }
        }

        // Box settings fetched successfully
      } else {
        showErrorToast(response?.message ?? SLUG_MESSAGES.FETCH_ERROR);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      const errorMessage = extractApiErrorMessage(
        err,
        SLUG_MESSAGES.FETCH_ERROR
      );
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug, handleAuthError, showErrorToast]);

  // Update box settings via API
  const updateBoxSettings = async (updatedData: any) => {
    try {
      // Get fresh company ID inside the function
      const currentCompanyId = getCompanyId();

      const response = await apiService.updateBoxSettings({
        ...updatedData,
        company_id: currentCompanyId,
      });

      if (response.statusCode === 200) {
        // Update related state values based on what was updated
        if (updatedData.question_json) {
          setQuestionJson(updatedData.question_json);
        }
        if (updatedData.field_status_json) {
          setFieldStatusJson(updatedData.field_status_json);
        }
        showSuccessToast(response?.message ?? SLUG_MESSAGES.UPDATE_SUCCESS);
      } else {
        showErrorToast(response?.message ?? SLUG_MESSAGES.UPDATE_ERROR);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      const errorMessage = extractApiErrorMessage(
        err,
        SLUG_MESSAGES.UPDATE_ERROR
      );
      showErrorToast(errorMessage);
    }
  };

  // Generate form fields from the actual configuration
  const formFields = useMemo(() => {
    if (!config) return [];

    return config.fields.map(({ name, label }) => ({
      id: name,
      label: label,
      enabled: true, // Start with all fields enabled
    }));
  }, [config]);

  const [fieldStates, setFieldStates] = useState<FieldItem[]>(formFields);

  // Handle company changes
  const refetchBoxSettings = useCallback(() => {
    setFieldStates(formFields);
    fetchBoxSettings();
  }, [fetchBoxSettings, formFields]);

  useCompanyChange(refetchBoxSettings);

  // Initial fetch handled by useCompanyChange hook

  // Get enabled field names for the DynamicForm
  const enabledFieldNames = useMemo(() => {
    return fieldStates.filter(({ enabled }) => enabled).map(({ id }) => id);
  }, [fieldStates]);

  // Special handling for pages that don't use DynamicForm (category and estimation)
  if (slug === FIVE_BOX_SLUGS.CATEGORY || slug === FIVE_BOX_SLUGS.ESTIMATION) {
    // These pages don't need config, so we handle them separately
  } else if (!config) {
    // If slug doesn't match any config, show 404
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>
          {SLUG_MESSAGES.BOX_NOT_FOUND}
        </h1>
        <p className='text-gray-600 mb-6'>
          {SLUG_MESSAGES.BOX_NOT_FOUND_DESCRIPTION}
        </p>
        <Button onClick={() => router.push(ROUTES.FIVE_BOX_SYSTEM)}>
          {SLUG_MESSAGES.BACK_TO_SYSTEM}
        </Button>
      </div>
    );
  }

  const breadcrumbData: BreadcrumbItem[] = [
    { name: SLUG_MESSAGES.COMPANY_PROFILE, href: ROUTES.COMPANY_PROFILE },
    { name: SLUG_MESSAGES.FIVE_BOX_SYSTEM, href: ROUTES.FIVE_BOX_SYSTEM },
    {
      name:
        SLUG_TITLES[slug as keyof typeof SLUG_TITLES] ||
        config?.title ||
        SLUG_MESSAGES.UNKNOWN,
    },
  ];

  // Loading skeleton
  if (loading) {
    return <SlugPageSkeleton breadcrumbData={breadcrumbData} />;
  }

  const handleSave = async (formData: any) => {
    // Update box settings via API
    await updateBoxSettings({
      default_selected_json: formData,
    });
  };

  const handleBack = () => {
    router.push(ROUTES.FIVE_BOX_SYSTEM);
  };

  const handleAddQuestion = () => {
    setIsQuestionSheetOpen(true);
  };

  const handleQuestionSave = async (questionData: QuestionFormData) => {
    // Get the next available ID by finding the maximum existing ID
    const maxId =
      questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0;

    // Create new questions with proper IDs
    const newQuestions = questionData.questions.map((question, index) => ({
      id: maxId + index + 1, // Use sequential IDs starting from max existing ID + 1
      text: question,
      answer: '', // Reset answers for new questions
    }));

    // Add new questions to existing ones for current slug
    const updatedQuestions = [...newQuestions];
    setQuestions(updatedQuestions);
    setIsQuestionSheetOpen(false);

    // Merge with existing question_json state to preserve other slugs' questions
    const updatedQuestionJson = {
      ...questionJson,
      [slug]: updatedQuestions,
    };

    // Update via API with merged data
    await updateBoxSettings({
      question_json: updatedQuestionJson,
    });
  };

  const handleQuestionCancel = () => {
    setIsQuestionSheetOpen(false);
  };

  const handleAnswerChange = async (questionId: number, answer: string) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, answer } : q
    );
    setQuestions(updatedQuestions);

    // Merge with existing question_json state to preserve other slugs' questions
    const updatedQuestionJson = {
      ...questionJson,
      [slug]: updatedQuestions,
    };

    // Update via API with merged data
    await updateBoxSettings({
      question_json: updatedQuestionJson,
    });
  };

  const handleManageFields = () => {
    setIsFieldManagementOpen(true);
  };

  const handleFieldToggle = async (fieldId: string, enabled: boolean) => {
    // Update local state
    setFieldStates(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, enabled } : field))
    );

    // Use existing field status from state
    const existingFieldStatus = fieldStatusJson || {};
    const existingSlugStatus = existingFieldStatus[slug] || {};

    const updatedFieldStatusJson = {
      ...existingFieldStatus,
      [slug]: {
        ...existingSlugStatus,
        [fieldId]: {
          enabled: enabled,
          required: false, // You can make this configurable if needed
        },
      },
    };
    // Update via API with merged data
    await updateBoxSettings({
      field_status_json: updatedFieldStatusJson,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleAddRoom = () => {
    // Here you would handle adding a room
  };

  const handleAddFromTemplate = () => {
    // Here you would handle adding from template
  };

  // Special handling for category page
  if (slug === FIVE_BOX_SLUGS.CATEGORY) {
    return (
      <section className=''>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <Breadcrumb items={breadcrumbData} />
        </div>

        <CategoryComponent
          categoryData={categoryData}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </section>
    );
  }

  // Special handling for estimate page
  if (slug === FIVE_BOX_SLUGS.ESTIMATION) {
    return (
      <section className=''>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <Breadcrumb items={breadcrumbData} />
        </div>

        {/* Estimate Empty State */}
        <div className='p-4 lg:p-10 rounded-[20px] bg-[var(--card-background)]'>
          <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
            {/* Icon */}
            <div className='mb-4 md:mb-8'>
              <div className='w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-16 h-16 md:w-20 md:h-20 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                  <text
                    x='12'
                    y='16'
                    textAnchor='middle'
                    className='text-xs font-bold fill-current'
                  >
                    ??
                  </text>
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className='text-xl md:text-2xl font-bold text-[var(--text-dark)] mb-2'>
              {SLUG_MESSAGES.NOTHING_HERE_YET}
            </h2>

            {/* Description */}
            <p className='text-base md:text-lg text-[var(--text-secondary)] mb-8 max-w-md'>
              {SLUG_MESSAGES.ESTIMATION_DESCRIPTION}
            </p>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
              <Button
                onClick={handleAddRoom}
                className='btn-primary flex items-center gap-2'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z'
                  />
                </svg>
                {SLUG_MESSAGES.ADD_ROOM}
              </Button>

              <Button
                onClick={handleAddFromTemplate}
                variant='outline'
                className='flex items-center gap-2'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                {SLUG_MESSAGES.ADD_FROM_TEMPLATE}
              </Button>
            </div>
          </div>

          {/* Previous Button */}
          <div className='flex justify-start'>
            <Button
              variant='outline'
              onClick={handleBack}
              className='btn-secondary'
            >
              {SLUG_MESSAGES.PREVIOUS}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Regular form handling for other pages
  return (
    <section className=''>
      {/* Breadcrumb */}
      <div className='mb-6 flex flex-wrap gap-4 items-center'>
        <Breadcrumb items={breadcrumbData} className='flex-1' />
        <Button
          className='btn-primary ml-auto shrink-0'
          onClick={handleAddQuestion}
        >
          {SLUG_MESSAGES.ADD_QUESTION}
        </Button>
      </div>

      {/* Left Column - Form */}
      <div className='p-5 sm:p-6 lg:p-8 xl:p-10 rounded-[20px] bg-[var(--card-background)]'>
        <div className='flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-6 items-start'>
          <div className='flex-1 w-full'>
            <DynamicForm
              config={config!}
              onSave={handleSave}
              onCancel={handleBack}
              showHeader={true}
              showActions={true}
              enabledFields={enabledFieldNames}
              titleAlignment={questions.length > 0 ? 'left' : 'center'}
            />
          </div>
          {questions.length > 0 && (
            <div className='w-full lg:w-[280px] xl:w-[420px] lg:shrink-0 h-auto lg:pl-4 lg:border-l lg:border-[var(--border-dark)] lg:max-h-[calc(100dvh_-_280px)] overflow-y-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-[var(--border-dark)]'>
              <div className='space-y-3'>
                {questions.map(question => {
                  // Safety check to ensure question has required properties
                  if (
                    !question ||
                    typeof question.id === 'undefined' ||
                    !question.text
                  ) {
                    return null;
                  }

                  const { id, text, answer } = question;
                  return (
                    <div key={id} className='space-y-3'>
                      <h3 className='text-sm sm:text-[14px] font-semibold text-[var(--text-dark)]'>
                        {text}
                      </h3>
                      <Textarea
                        placeholder={SLUG_MESSAGES.ANSWER_PLACEHOLDER}
                        value={answer || ''}
                        onChange={e => handleAnswerChange(id, e.target.value)}
                        className='min-h-[80px] sm:min-h-[100px] resize-none input-field'
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end mt-4 sm:mt-6'>
          <Button
            className='btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2'
            onClick={handleManageFields}
          >
            {SLUG_MESSAGES.MANAGE_FIELDS}
          </Button>
        </div>
      </div>

      {/* Question Form Sidesheet */}
      <SideSheet
        open={isQuestionSheetOpen}
        onOpenChange={setIsQuestionSheetOpen}
        title={SLUG_MESSAGES.ADD_QUESTION_TITLE}
        size='600px'
      >
        <CreateQuestionForm
          onSave={handleQuestionSave}
          onCancel={handleQuestionCancel}
          existingQuestions={questions.map(({ text }) => text)}
        />
      </SideSheet>

      {/* Field Management Sidesheet */}
      <SideSheet
        open={isFieldManagementOpen}
        onOpenChange={setIsFieldManagementOpen}
        title={SLUG_MESSAGES.MANAGE_FIELDS_TITLE}
        size='500px'
      >
        <FieldManagementSwitch
          fields={fieldStates}
          onFieldToggle={handleFieldToggle}
        />
      </SideSheet>
    </section>
  );
};

export default DynamicBoxPage;
