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
import CategoryComponent from '@/components/Templates/CategoryComponent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { use, useMemo, useState } from 'react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const DynamicBoxPage = ({ params }: PageProps) => {
  const router = useRouter();
  const { slug } = use(params);
  const config = getFormConfig(slug);
  const [isQuestionSheetOpen, setIsQuestionSheetOpen] = useState(false);
  const [isFieldManagementOpen, setIsFieldManagementOpen] = useState(false);
  const [questions, setQuestions] = useState<
    Array<{
      id: number;
      text: string;
      answer: string;
    }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Category data based on the image
  const categoryData = [
    {
      id: 'full-home-build',
      name: 'Full Home Build/Addition',
      description:
        'Start a new home from scratch or add a room, floor, or extension to your existing space.',
      icon: 'home',
      color: '#10B981',
      bgColor: '#10B9811A',
    },
    {
      id: 'interior',
      name: 'Interior',
      description:
        'Renovate or upgrade interiors like kitchen, bathroom, living room, or complete home redesign.',
      icon: 'paint',
      color: '#3B82F6',
      bgColor: '#3B82F61A',
    },
    {
      id: 'exterior',
      name: 'Exterior',
      description:
        'Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.',
      icon: 'crane',
      color: '#F97316',
      bgColor: '#F973161A',
    },
    {
      id: 'single-multi-trade',
      name: 'Single/Multi Trade',
      description:
        'Get help with one or more specific trades like plumbing, electrical, flooring, or carpentry.',
      icon: 'tool',
      color: '#EAB308',
      bgColor: '#EAB3081A',
    },
    {
      id: 'repair',
      name: 'Repair',
      description:
        'Fix issues like leaks, cracks, broken fixtures, or any small-scale home damage.',
      icon: 'skrew',
      color: '#06B6D4',
      bgColor: '#06B6D41A',
    },
    {
      id: 'landscaping',
      name: 'Landscaping',
      description:
        'Design and maintain outdoor spaces including gardens, lawns, and hardscaping.',
      icon: 'home',
      color: '#059669',
      bgColor: '#0596691A',
    },
    {
      id: 'electrical',
      name: 'Electrical Work',
      description:
        'Install, repair, or upgrade electrical systems, wiring, and fixtures.',
      icon: 'tool',
      color: '#DC2626',
      bgColor: '#DC26261A',
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      description:
        'Install, repair, or maintain plumbing systems, pipes, and fixtures.',
      icon: 'crane',
      color: '#2563EB',
      bgColor: '#2563EB1A',
    },
  ];

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

  // Get enabled field names for the DynamicForm
  const enabledFieldNames = useMemo(() => {
    return fieldStates.filter(({ enabled }) => enabled).map(({ id }) => id);
  }, [fieldStates]);

  // Special handling for pages that don't use DynamicForm (category and estimation)
  if (slug === 'category' || slug === 'estimation') {
    // These pages don't need config, so we handle them separately
  } else if (!config) {
    // If slug doesn't match any config, show 404
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>Box Not Found</h1>
        <p className='text-gray-600 mb-6'>
          The requested box configuration does not exist.
        </p>
        <Button onClick={() => router.push('/company-profile/five-box-system')}>
          Back to 5-Box System
        </Button>
      </div>
    );
  }

  const breadcrumbData: BreadcrumbItem[] = [
    { name: 'Company Profile', href: '/company-profile' },
    { name: '5-box system', href: '/company-profile/five-box-system' },
    {
      name:
        slug === 'category'
          ? 'Category'
          : slug === 'estimation'
            ? 'Estimate'
            : config?.title || 'Unknown',
    },
  ];

  const handleSave = () => {
    // Here you would make an API call to save the data
  };

  const handleBack = () => {
    router.push('/company-profile/five-box-system');
  };

  const handleAddQuestion = () => {
    setIsQuestionSheetOpen(true);
  };

  const handleQuestionSave = (questionData: QuestionFormData) => {
    // Replace the entire questions array with the new data
    const newQuestions = questionData.questions.map((question, index) => ({
      id: index + 1, // Reset IDs to be sequential
      text: question,
      answer: '', // Reset answers for new questions
    }));
    setQuestions(newQuestions);
    setIsQuestionSheetOpen(false);
  };

  const handleQuestionCancel = () => {
    setIsQuestionSheetOpen(false);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, answer } : q))
    );
  };

  const handleManageFields = () => {
    setIsFieldManagementOpen(true);
  };

  const handleFieldToggle = (fieldId: string, enabled: boolean) => {
    setFieldStates(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, enabled } : field))
    );
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
  if (slug === 'category') {
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
  if (slug === 'estimation') {
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
              Nothing Here Yet
            </h2>

            {/* Description */}
            <p className='text-base md:text-lg text-[var(--text-secondary)] mb-8 max-w-md'>
              You haven&apos;t created any estimate yet. Start by adding your
              first one to organize your estimate.
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
                Add Room
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
                Add From Template
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
              Previous
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
          Add Question
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
                {questions.map(({ id, text, answer }) => (
                  <div key={id} className='space-y-3'>
                    <h3 className='text-sm sm:text-[14px] font-semibold text-[var(--text-dark)]'>
                      {text}
                    </h3>
                    <Textarea
                      placeholder='Type you answer here..'
                      value={answer}
                      onChange={e => handleAnswerChange(id, e.target.value)}
                      className='min-h-[80px] sm:min-h-[100px] resize-none input-field'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end mt-4 sm:mt-6'>
          <Button
            className='btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2'
            onClick={handleManageFields}
          >
            Manage Fields
          </Button>
        </div>
      </div>

      {/* Question Form Sidesheet */}
      <SideSheet
        open={isQuestionSheetOpen}
        onOpenChange={setIsQuestionSheetOpen}
        title='Add Question'
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
        title='Manage Fields'
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
