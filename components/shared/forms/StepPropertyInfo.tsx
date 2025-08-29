import {
  BHK_OPTIONS_ARRAY,
  COMMERCIAL_PROPERTY_TYPE_OPTIONS,
  FIVE_BOX_SLUGS,
  FLOOR_OPTIONS_ARRAY,
  INDUSTRIAL_PROPERTY_TYPE_OPTIONS,
  PROPERTY_AGE_OPTIONS_ARRAY,
  PROPERTY_INFORMATION_FIELDS,
  PROPERTY_TYPE_ARRAY,
  RESIDENTIAL_PROPERTY_TYPE_OPTIONS,
  SQUARE_FOOTAGE_OPTIONS_ARRAY,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SKIP_MESSAGES } from '@/constants/messages';

import { getFormConfig } from '@/components/shared/dynamicforms/formConfigs';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Textarea } from '../../ui/textarea';

// Create dynamic schema based on boxSettings
const createPropertyInfoSchema = (boxSettings: any) => {
  const isFieldRequired = (fieldName: string): boolean => {
    if (
      !boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROPERTY_INFORMATION]
    ) {
      return false;
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROPERTY_INFORMATION][
        fieldName
      ];
    return fieldConfig?.required ?? false;
  };

  return yup.object({
    property: isFieldRequired(PROPERTY_INFORMATION_FIELDS.PROPERTY)
      ? yup.string().required('Property type is required')
      : yup.string().optional(),
    propertyType: isFieldRequired(PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE)
      ? yup.string().required('Property type is required')
      : yup.string().optional(),
    bhk: isFieldRequired(PROPERTY_INFORMATION_FIELDS.BHK)
      ? yup.string().required('BHK is required')
      : yup.string().optional(),
    floor: isFieldRequired(PROPERTY_INFORMATION_FIELDS.FLOOR)
      ? yup.string().required('Floor is required')
      : yup.string().optional(),
    approxSqFt: isFieldRequired(PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT)
      ? yup.string().required('Approximate square footage is required')
      : yup.string().optional(),
    ageOfProperty: isFieldRequired(PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY)
      ? yup.string().required('Age of property is required')
      : yup.string().optional(),
  });
};

interface StepPropertyInfoProps {
  onNext: (
    data: any,
    questions?: { id: string; text: string; answer: string }[]
  ) => void;
  onPrev?: () => void;
  defaultValues?: any;
  isLastStep?: boolean;
  boxSettings?: any;
  allQuestionJson?: Record<string, any[]>;
  cancelButtonClass?: string;
  questionJson?: { id: string; text: string; answer: string }[];
  showSkipToEstimation?: boolean;
  onSkipToEstimation?: () => void;
}

export function StepPropertyInfo({
  onNext,
  onPrev,
  defaultValues,
  isLastStep = false,
  boxSettings,
  allQuestionJson = {},
  cancelButtonClass,
  questionJson = [],
  showSkipToEstimation = false,
  onSkipToEstimation,
}: StepPropertyInfoProps) {
  const form = useForm<any>({
    resolver: yupResolver(createPropertyInfoSchema(boxSettings)),
    defaultValues: {
      property: '',
      propertyType: '',
      bhk: '',
      floor: '',
      approxSqFt: '',
      ageOfProperty: '',
      ...defaultValues,
    },
  });

  const { watch, setValue } = form;
  const selectedProperty = watch('property');
  // Reset propertyType when property changes
  useEffect(() => {
    setValue('propertyType', '');
  }, [selectedProperty, setValue]);

  // Get property type options based on selected property
  const getPropertyTypeOptions = () => {
    switch (selectedProperty) {
      case 'RESIDENTIAL':
        return RESIDENTIAL_PROPERTY_TYPE_OPTIONS;
      case 'COMMERCIAL':
        return COMMERCIAL_PROPERTY_TYPE_OPTIONS;
      case 'INDUSTRIAL':
        return INDUSTRIAL_PROPERTY_TYPE_OPTIONS;
      default:
        return [
          ...RESIDENTIAL_PROPERTY_TYPE_OPTIONS,
          ...COMMERCIAL_PROPERTY_TYPE_OPTIONS,
          ...INDUSTRIAL_PROPERTY_TYPE_OPTIONS,
        ];
    }
  };

  // State for questions with id, text, and answer
  const [questions, setQuestions] = useState<any[]>([]);

  // Function to update question answer
  const updateQuestionAnswer = (questionId: number, answer: string) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId ? { ...question, answer } : question
      )
    );
  };

  // Update questions when allQuestionJson changes and restore saved answers
  useEffect(() => {
    const propertyQuestions =
      allQuestionJson?.[FIVE_BOX_SLUGS.PROPERTY_INFORMATION] || [];
    // Restore saved answers from questionJson array format
    const questionsWithSavedAnswers = propertyQuestions.map(question => {
      const savedQuestion = questionJson?.find(
        (q: any) => q.id === question.id.toString()
      );
      return {
        ...question,
        answer: savedQuestion?.answer || question.answer || '',
      };
    });

    setQuestions(questionsWithSavedAnswers);
  }, [allQuestionJson, questionJson]);

  // Helper function to check if field is enabled
  const isFieldEnabled = (fieldName: string): boolean => {
    if (
      !boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROPERTY_INFORMATION]
    ) {
      return true; // Default to enabled if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROPERTY_INFORMATION][
        fieldName
      ];
    return fieldConfig?.enabled ?? true; // Default to enabled if not specified
  };

  // Helper function to check if field is required
  const isFieldRequired = (fieldName: string): boolean => {
    if (
      !boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROPERTY_INFORMATION]
    ) {
      return false; // Default to not required if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROPERTY_INFORMATION][
        fieldName
      ];
    return fieldConfig?.required ?? false; // Default to not required if not specified
  };

  const onSubmit = (data: any) => {
    // Convert questions array to array format with complete question data
    const questionsRecord: { id: string; text: string; answer: string }[] = [];
    questions.forEach(question => {
      if (question.answer) {
        questionsRecord.push({
          id: question.id.toString(),
          text: question.text,
          answer: question.answer,
        });
      }
    });

    onNext(data, questionsRecord);
  };

  // Get form config for Property Information
  const formConfig = getFormConfig(FIVE_BOX_SLUGS.PROPERTY_INFORMATION);

  return (
    <div className='w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {formConfig?.title || 'Property Information'}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {formConfig?.description ||
          'Share key property details to help us tailor solutions that suit your space and structure.'}
      </p>
      <Form {...form}>
        <form
          className='w-full flex flex-col gap-4 sm:gap-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-6 items-start'>
            {/* Left Column - Form Fields */}
            <div className='flex-1 w-full'>
              <div className='h-auto md:h-[calc(100vh_-_440px)] md:-mx-4 md:px-4 overflow-y-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                  {/* Property */}
                  {isFieldEnabled(PROPERTY_INFORMATION_FIELDS.PROPERTY) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='property'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.PROPERTY_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.PROPERTY
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROPERTY_TYPE_ARRAY}
                                placeholder={STEP_MESSAGES.SELECT_PROPERTY}
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Property Type */}
                  {isFieldEnabled(
                    PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='propertyType'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.PROPERTY_TYPE_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={getPropertyTypeOptions()}
                                placeholder={STEP_MESSAGES.SELECT_PROPERTY_TYPE}
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* BHK */}
                  {isFieldEnabled(PROPERTY_INFORMATION_FIELDS.BHK) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='bhk'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.BHK_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.BHK
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={BHK_OPTIONS_ARRAY}
                                placeholder={STEP_MESSAGES.SELECT_BHK}
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Floor */}
                  {isFieldEnabled(PROPERTY_INFORMATION_FIELDS.FLOOR) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='floor'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.FLOOR_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.FLOOR
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={FLOOR_OPTIONS_ARRAY}
                                placeholder={STEP_MESSAGES.SELECT_FLOOR}
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Approx. sq ft */}
                  {isFieldEnabled(PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='approxSqFt'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.APPROX_SQ_FT_PROPERTY_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={SQUARE_FOOTAGE_OPTIONS_ARRAY}
                                placeholder={
                                  STEP_MESSAGES.SELECT_SQUARE_FOOTAGE
                                }
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Age of Property */}
                  {isFieldEnabled(
                    PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='ageOfProperty'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.AGE_OF_PROPERTY_PROPERTY_LABEL}
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROPERTY_AGE_OPTIONS_ARRAY}
                                placeholder={STEP_MESSAGES.SELECT_PROPERTY_AGE}
                                className=''
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Questions */}
            {questions && questions.length > 0 && (
              <div className='w-full lg:w-[280px] xl:w-[420px] lg:shrink-0 h-auto lg:pl-4 lg:border-l lg:border-[var(--border-dark)] md:h-[calc(100vh_-_440px)] overflow-y-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-[var(--border-dark)]'>
                <div className='space-y-3'>
                  {questions.map((question: any) => {
                    // Safety check to ensure question has required properties
                    if (
                      !question ||
                      typeof question.id === 'undefined' ||
                      !question.text
                    ) {
                      return null;
                    }

                    const { id, text } = question;
                    return (
                      <div key={id} className='space-y-3'>
                        <h3 className='text-sm sm:text-[14px] font-semibold text-[var(--text-dark)]'>
                          {text}
                        </h3>
                        <Textarea
                          placeholder={STEP_MESSAGES.ENTER_ANSWER_HERE}
                          value={question.answer || ''}
                          onChange={e => {
                            updateQuestionAnswer(id, e.target.value);
                          }}
                          className='min-h-[80px] sm:min-h-[100px] resize-none input-field'
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className='flex w-full items-center gap-2'>
            {onPrev && (
              <button
                type='button'
                className={
                  cancelButtonClass ||
                  'btn-secondary !px-4 md:!px-8 text-sm sm:text-base'
                }
                onClick={onPrev}
              >
                Previous
              </button>
            )}
            <div className='flex gap-2 ml-auto'>
              {showSkipToEstimation && onSkipToEstimation && (
                <Button
                  type='button'
                  variant='outline'
                  className='btn-secondary !px-4 md:!px-8 text-sm sm:text-base'
                  onClick={onSkipToEstimation}
                >
                  {SKIP_MESSAGES.SKIP_TO_ESTIMATION}
                </Button>
              )}
              <Button
                className='btn-primary !px-4 md:!px-8 text-sm sm:text-base'
                type='submit'
              >
                {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
