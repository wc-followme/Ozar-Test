import {
  BHK_OPTIONS_ARRAY,
  FIVE_BOX_SLUGS,
  FLOOR_OPTIONS_ARRAY,
  PROPERTY_AGE_OPTIONS_ARRAY,
  PROPERTY_INFORMATION_FIELDS,
  PROPERTY_TYPE_ARRAY,
  PROPERTY_TYPE_OPTIONS_ARRAY,
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
  onNext: (data: any) => void;
  defaultValues?: any;
  isLastStep?: boolean;
  boxSettings?: any;
  allQuestionJson?: Record<string, any[]>;
}

export function StepPropertyInfo({
  onNext,
  defaultValues,
  isLastStep = false,
  boxSettings,
  allQuestionJson = {},
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

  // Update questions when allQuestionJson changes
  useEffect(() => {
    const propertyQuestions =
      allQuestionJson?.[FIVE_BOX_SLUGS.PROPERTY_INFORMATION] || [];
    setQuestions(propertyQuestions);
  }, [allQuestionJson]);

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
    const formDataWithQuestions = {
      ...data,
      questions,
    };
    onNext(formDataWithQuestions);
  };

  // Get form config for Property Information
  const formConfig = getFormConfig(FIVE_BOX_SLUGS.PROPERTY_INFORMATION);

  return (
    <div className='w-full max-w-[1200px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
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
              <div className='h-auto md:h-[calc(100vh_-_550px)] md:-mx-4 md:px-4 overflow-y-auto'>
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
                              Property
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.PROPERTY
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROPERTY_TYPE_ARRAY}
                                placeholder='Select property type'
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
                              Type of Property
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.PROPERTY_TYPE
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROPERTY_TYPE_OPTIONS_ARRAY}
                                placeholder='Select property type'
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
                              BHK
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.BHK
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={BHK_OPTIONS_ARRAY}
                                placeholder='Select BHK'
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
                              Floor
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.FLOOR
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={FLOOR_OPTIONS_ARRAY}
                                placeholder='Select floor'
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
                              Approx. sq ft
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.APPROX_SQ_FT
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={SQUARE_FOOTAGE_OPTIONS_ARRAY}
                                placeholder='Select square footage'
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
                              Age of Property
                              {isFieldRequired(
                                PROPERTY_INFORMATION_FIELDS.AGE_OF_PROPERTY
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROPERTY_AGE_OPTIONS_ARRAY}
                                placeholder='Select property age'
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
              <div className='w-full lg:w-[280px] xl:w-[420px] lg:shrink-0 h-auto lg:pl-4 lg:border-l lg:border-[var(--border-dark)] lg:max-h-[calc(100dvh_-_280px)] overflow-y-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-[var(--border-dark)]'>
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
                          placeholder='Type your answer here...'
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

          {/* Submit/Next Step Button */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 text-sm sm:text-base'
            >
              {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
