import {
  ANIMALS_IN_HOME_OPTIONS_ARRAY,
  ANIMALS_VALUES,
  CONTACT_METHOD_OPTIONS_ARRAY,
  FIVE_BOX_SLUGS,
  GENERAL_INFORMATION_FIELDS,
  PET_TYPES,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import SelectField from '@/components/shared/common/SelectField';
import { TimePicker } from '@/components/shared/common/TimePicker';
import { getFormConfig } from '@/components/shared/dynamicforms/formConfigs';
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

import { Input } from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Textarea } from '../../ui/textarea';

// Create dynamic schema based on boxSettings
const createGeneralInfoSchema = (boxSettings: any) => {
  const isFieldRequired = (fieldName: string): boolean => {
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.GENERAL_INFORMATION]) {
      return false;
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.GENERAL_INFORMATION][
        fieldName
      ];
    return fieldConfig?.required ?? false;
  };

  return yup.object({
    fullName: isFieldRequired(GENERAL_INFORMATION_FIELDS.YOUR_NAME)
      ? yup.string().required(STEP_MESSAGES.FULL_NAME_REQUIRED)
      : yup.string().optional(),
    email: isFieldRequired(GENERAL_INFORMATION_FIELDS.EMAIL)
      ? yup
          .string()
          .email(STEP_MESSAGES.EMAIL_INVALID)
          .required(STEP_MESSAGES.EMAIL_REQUIRED)
      : yup.string().email(STEP_MESSAGES.EMAIL_INVALID).optional(),
    phone: isFieldRequired(GENERAL_INFORMATION_FIELDS.PHONE_NUMBER)
      ? yup
          .string()
          .matches(/^[0-9]+$/, STEP_MESSAGES.PHONE_NUMBER_REQUIRED)
          .required(STEP_MESSAGES.PHONE_REQUIRED)
      : yup
          .string()
          .matches(/^[0-9]+$/, STEP_MESSAGES.PHONE_NUMBER_REQUIRED)
          .optional(),
    address: isFieldRequired(GENERAL_INFORMATION_FIELDS.ADDRESS)
      ? yup.string().required(STEP_MESSAGES.ADDRESS_REQUIRED)
      : yup.string().optional(),
    preferredContactMethod: isFieldRequired(
      GENERAL_INFORMATION_FIELDS.PREFERRED_CONTACT_METHOD
    )
      ? yup.string().required(STEP_MESSAGES.PREFERRED_CONTACT_METHOD_REQUIRED)
      : yup.string().optional(),
    contactStartTime: isFieldRequired(
      GENERAL_INFORMATION_FIELDS.BEST_TIME_TO_CONTACT
    )
      ? yup.string().required(STEP_MESSAGES.CONTACT_START_TIME_REQUIRED)
      : yup.string().optional(),
    animals: isFieldRequired(GENERAL_INFORMATION_FIELDS.ANIMALS_IN_HOME)
      ? yup.string().required(STEP_MESSAGES.ANIMALS_REQUIRED)
      : yup.string().optional(),
    petType: yup.string().when('animals', {
      is: ANIMALS_VALUES.YES,
      then: schema =>
        isFieldRequired(GENERAL_INFORMATION_FIELDS.PET_TYPE)
          ? schema.required(STEP_MESSAGES.PET_TYPE_REQUIRED)
          : schema.optional(),
      otherwise: schema => schema.optional(),
    }),
  });
};

interface StepGeneralInfoProps {
  onNext: (
    data: any,
    questions?: { id: string; text: string; answer: string }[]
  ) => void;
  defaultValues?: any;
  isLastStep?: boolean;
  boxSettings?: any;
  allQuestionJson?: Record<string, any[]>;
  questionJson?: { id: string; text: string; answer: string }[];
  showSkipToEstimation?: boolean;
  onSkipToEstimation?: () => void;
}

export function StepGeneralInfo({
  onNext,
  defaultValues,
  isLastStep = false,
  boxSettings,
  allQuestionJson = {},
  questionJson = [],
  showSkipToEstimation = false,
  onSkipToEstimation,
}: StepGeneralInfoProps) {
  const form = useForm<any>({
    resolver: yupResolver(createGeneralInfoSchema(boxSettings)),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      preferredContactMethod: '',
      contactStartTime: '',
      animals: 'No',
      petType: '',
      ...defaultValues,
    },
  });
  const { watch } = form;
  const animals = watch('animals');

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
    const generalQuestions =
      allQuestionJson?.[FIVE_BOX_SLUGS.GENERAL_INFORMATION] || [];

    // Restore saved answers from questionJson array format
    const questionsWithSavedAnswers = generalQuestions.map(question => {
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
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.GENERAL_INFORMATION]) {
      return true; // Default to enabled if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.GENERAL_INFORMATION][
        fieldName
      ];
    return fieldConfig?.enabled ?? true; // Default to enabled if not specified
  };

  // Helper function to check if field is required
  const isFieldRequired = (fieldName: string): boolean => {
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.GENERAL_INFORMATION]) {
      return false; // Default to not required if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.GENERAL_INFORMATION][
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

  // Get form config for General Information
  const formConfig = getFormConfig(FIVE_BOX_SLUGS.GENERAL_INFORMATION);

  return (
    <div className='w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {formConfig?.title || STEP_MESSAGES.GENERAL_INFO_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {formConfig?.description || STEP_MESSAGES.GENERAL_INFO_DESCRIPTION}
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
                  {/* Your Name (full width) */}
                  {isFieldEnabled(GENERAL_INFORMATION_FIELDS.YOUR_NAME) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2 col-span-1 md:col-span-2'>
                      <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.YOUR_NAME_LABEL}
                              {isFieldRequired(
                                GENERAL_INFORMATION_FIELDS.YOUR_NAME
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={STEP_MESSAGES.ENTER_FULL_NAME}
                                className='input-field'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {/* Email */}
                  {isFieldEnabled(GENERAL_INFORMATION_FIELDS.EMAIL) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.EMAIL_LABEL}
                              {isFieldRequired(
                                GENERAL_INFORMATION_FIELDS.EMAIL
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='email'
                                placeholder={STEP_MESSAGES.ENTER_EMAIL}
                                className='input-field'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {/* Phone */}
                  {isFieldEnabled(GENERAL_INFORMATION_FIELDS.PHONE_NUMBER) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.PHONE_NUMBER_LABEL}
                              {isFieldRequired(
                                GENERAL_INFORMATION_FIELDS.PHONE_NUMBER
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={STEP_MESSAGES.ENTER_PHONE_NUMBER}
                                className='input-field'
                                {...field}
                                onKeyDown={e => {
                                  // Only allow numbers, backspace, delete, tab, escape, enter
                                  const allowedKeys = [
                                    'Backspace',
                                    'Delete',
                                    'Tab',
                                    'Escape',
                                    'Enter',
                                    'ArrowLeft',
                                    'ArrowRight',
                                    'ArrowUp',
                                    'ArrowDown',
                                    'Home',
                                    'End',
                                  ];

                                  // Allow if it's an allowed key
                                  if (allowedKeys.includes(e.key)) {
                                    return;
                                  }

                                  // Allow if it's a number
                                  if (/^[0-9]$/.test(e.key)) {
                                    return;
                                  }

                                  // Prevent all other keys
                                  e.preventDefault();
                                }}
                                onChange={e => {
                                  // Remove any non-numeric characters from the input
                                  const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ''
                                  );
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {/* Address */}
                  {isFieldEnabled(GENERAL_INFORMATION_FIELDS.ADDRESS) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2 col-span-1 md:col-span-2 '>
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.ADDRESS_LABEL}
                              {isFieldRequired(
                                GENERAL_INFORMATION_FIELDS.ADDRESS
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={STEP_MESSAGES.ENTER_ADDRESS}
                                className='input-field'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <div className='grid grid-cols-2 w-full gap-1.5 sm:gap-2 col-span-1 md:col-span-2'>
                    {/* Preferred contact method */}
                    {isFieldEnabled(
                      GENERAL_INFORMATION_FIELDS.PREFERRED_CONTACT_METHOD
                    ) && (
                      <div className='flex flex-col gap-1.5 sm:gap-2'>
                        <FormField
                          control={form.control}
                          name='preferredContactMethod'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='field-label'>
                                {STEP_MESSAGES.PREFERRED_CONTACT_METHOD_LABEL}
                                {isFieldRequired(
                                  GENERAL_INFORMATION_FIELDS.PREFERRED_CONTACT_METHOD
                                ) && <span className='text-red-500'>*</span>}
                              </FormLabel>
                              <FormControl>
                                <SelectField
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  options={CONTACT_METHOD_OPTIONS_ARRAY}
                                  placeholder={
                                    STEP_MESSAGES.SELECT_CONTACT_METHOD
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
                    {/* Best time to contact */}
                    {isFieldEnabled(
                      GENERAL_INFORMATION_FIELDS.BEST_TIME_TO_CONTACT
                    ) && (
                      <div className='flex flex-col gap-1.5 sm:gap-2'>
                        <FormField
                          control={form.control}
                          name='contactStartTime'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='field-label'>
                                {STEP_MESSAGES.BEST_TIME_TO_CONTACT_LABEL}
                                {isFieldRequired(
                                  GENERAL_INFORMATION_FIELDS.BEST_TIME_TO_CONTACT
                                ) && <span className='text-red-500'>*</span>}
                              </FormLabel>
                              <FormControl>
                                <TimePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder={
                                    STEP_MESSAGES.SELECT_BEST_TIME_TO_CONTACT
                                  }
                                  error={
                                    !!form.formState.errors['contactStartTime']
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {/* Animals in the Home */}
                    {isFieldEnabled(
                      GENERAL_INFORMATION_FIELDS.ANIMALS_IN_HOME
                    ) && (
                      <div className='flex flex-col gap-1.5 sm:gap-2'>
                        <FormField
                          control={form.control}
                          name='animals'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='field-label'>
                                {STEP_MESSAGES.ANIMALS_IN_HOME_LABEL}
                                {isFieldRequired(
                                  GENERAL_INFORMATION_FIELDS.ANIMALS_IN_HOME
                                ) && <span className='text-red-500'>*</span>}
                              </FormLabel>
                              <FormControl>
                                <SelectField
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  options={ANIMALS_IN_HOME_OPTIONS_ARRAY}
                                  placeholder={
                                    STEP_MESSAGES.SELECT_ANIMALS_IN_HOME
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
                    {/* Pet type? */}
                    {animals === 'Yes' &&
                      isFieldEnabled(GENERAL_INFORMATION_FIELDS.PET_TYPE) && (
                        <div className='flex flex-col gap-1.5 sm:gap-2'>
                          <FormField
                            control={form.control}
                            name='petType'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='field-label'>
                                  {STEP_MESSAGES.PET_TYPE_LABEL}
                                  {isFieldRequired(
                                    GENERAL_INFORMATION_FIELDS.PET_TYPE
                                  ) && <span className='text-red-500'>*</span>}
                                </FormLabel>
                                <FormControl>
                                  <SelectField
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    options={PET_TYPES}
                                    placeholder={STEP_MESSAGES.SELECT_PET_TYPE}
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

          {/* Submit/Next Step Button */}
          <div className='flex justify-end gap-2'>
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
