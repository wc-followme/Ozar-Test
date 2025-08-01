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

  // Generate form fields from the actual configuration
  const formFields = useMemo(() => {
    if (!config) return [];

    return config.fields.map(field => ({
      id: field.name,
      label: field.label,
      enabled: true, // Start with all fields enabled
    }));
  }, [config]);

  const [fieldStates, setFieldStates] = useState<FieldItem[]>(formFields);

  // Get enabled field names for the DynamicForm
  const enabledFieldNames = useMemo(() => {
    return fieldStates.filter(field => field.enabled).map(field => field.id);
  }, [fieldStates]);

  // If slug doesn't match any config, show 404
  if (!config) {
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
    { name: config.title },
  ];

  const handleSave = (data: Record<string, any>) => {
    console.log('Saving form data for', config.title, ':', data);
    // Here you would make an API call to save the data
  };

  const handleBack = () => {
    router.push('/company-profile/five-box-system');
  };

  const handleAddQuestion = () => {
    setIsQuestionSheetOpen(true);
  };

  const handleQuestionSave = (questionData: QuestionFormData) => {
    console.log('New question data:', questionData);
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
    console.log(`Field ${fieldId} ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <section className=''>
      {/* Breadcrumb */}
      <div className='mb-6 flex items-center'>
        <Breadcrumb items={breadcrumbData} />
        <Button className='btn-primary ml-auto' onClick={handleAddQuestion}>
          Add Question
        </Button>
      </div>

      {/* Left Column - Form */}
      <div className='p-10 rounded-[20px] bg-[var(--card-background)]'>
        <div className='flex gap-4 items-start'>
          <div className='flex-1'>
            <DynamicForm
              config={config}
              onSave={handleSave}
              onCancel={handleBack}
              showHeader={true}
              showActions={true}
              enabledFields={enabledFieldNames}
              titleAlignment={questions.length > 0 ? 'left' : 'center'}
            />
          </div>
          {questions.length > 0 && (
            <div className='w-[420px] shrink-0 pl-4 border-l border-[var(--border-dark)] max-h-[calc(100dvh_-_350px)] overflow-y-auto'>
              <div className='space-y-3'>
                {questions.map(question => (
                  <div key={question.id} className='space-y-3'>
                    <h3 className='text-[14px] font-semibold text-[var(--text-dark)]'>
                      {question.text}
                    </h3>
                    <Textarea
                      placeholder='Type you answer here..'
                      value={question.answer}
                      onChange={e =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      className='min-h-[100px] resize-none input-field'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex justify-end mt-6'>
          <Button className='btn-secondary' onClick={handleManageFields}>
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
          existingQuestions={questions.map(q => q.text)}
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
