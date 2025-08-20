import {
  FIVE_BOX_SLUGS,
  PROJECT_INFORMATION_FIELDS,
} from '@/app/(DashboardLayout)/company-profile/five-box-system/five-box-slug-constants';
import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import { TimePicker } from '@/components/shared/common/TimePicker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ROLE_IDS } from '@/constants/common';
import { PROJECT_MESSAGES, SKIP_MESSAGES } from '@/constants/messages';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '../common/SelectField';
import { getFormConfig } from '../dynamicforms/formConfigs';

// Create dynamic schema based on boxSettings
const createProjectInfoSchema = (boxSettings: any) => {
  const isFieldRequired = (fieldName: string): boolean => {
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROJECT_INFORMATION]) {
      return false;
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROJECT_INFORMATION][
        fieldName
      ];
    return fieldConfig?.required ?? false;
  };

  return yup.object({
    projectName: isFieldRequired(PROJECT_INFORMATION_FIELDS.PROJECT_NAME)
      ? yup.string().required(PROJECT_MESSAGES.PROJECT_NAME_REQUIRED)
      : yup.string().optional(),
    projectStartDate: isFieldRequired(
      PROJECT_INFORMATION_FIELDS.PROJECT_START_DATE
    )
      ? yup.string().required(PROJECT_MESSAGES.START_DATE_REQUIRED)
      : yup.string().optional(),
    projectFinishDate: isFieldRequired(
      PROJECT_INFORMATION_FIELDS.PROJECT_FINISH_DATE
    )
      ? yup.string().required(PROJECT_MESSAGES.FINISH_DATE_REQUIRED)
      : yup.string().optional(),
    ownerPresence: isFieldRequired(PROJECT_INFORMATION_FIELDS.OWNER_PRESENCE)
      ? yup.string().required(PROJECT_MESSAGES.OWNER_PRESENCE_REQUIRED)
      : yup.string().optional(),
    weekendWork: isFieldRequired(PROJECT_INFORMATION_FIELDS.WEEKEND_WORK)
      ? yup.string().required(PROJECT_MESSAGES.WEEKEND_WORK_REQUIRED)
      : yup.string().optional(),
    dailyWorkTimingStart: isFieldRequired(
      PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING
    )
      ? yup.string().required(PROJECT_MESSAGES.DAILY_WORK_TIMING_REQUIRED)
      : yup.string().optional(),
    dailyWorkTimingEnd: isFieldRequired(
      PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING
    )
      ? yup.string().required(PROJECT_MESSAGES.DAILY_WORK_TIMING_REQUIRED)
      : yup.string().optional(),
    budget: isFieldRequired(PROJECT_INFORMATION_FIELDS.BUDGET)
      ? yup.string().required(PROJECT_MESSAGES.BUDGET_REQUIRED)
      : yup.string().optional(),
    preferredContractor: isFieldRequired(
      PROJECT_INFORMATION_FIELDS.PREFERRED_CONTRACTOR
    )
      ? yup.string().required(PROJECT_MESSAGES.PREFERRED_CONTRACTOR_REQUIRED)
      : yup.string().optional(),
  });
};

interface StepProjectInfoProps {
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
  company_id?: string;
  showSkipToEstimation?: boolean;
  onSkipToEstimation?: () => void;
}

export function StepProjectInfo({
  onNext,
  onPrev,
  defaultValues,
  isLastStep = false,
  boxSettings,
  allQuestionJson = {},
  cancelButtonClass,
  questionJson = [],
  company_id,
  showSkipToEstimation = false,
  onSkipToEstimation,
}: StepProjectInfoProps) {
  const form = useForm<any>({
    resolver: yupResolver(createProjectInfoSchema(boxSettings)),
    defaultValues: {
      projectName: '',
      projectStartDate: '',
      projectFinishDate: '',
      ownerPresence: '',
      weekendWork: '',
      dailyWorkTimingStart: '',
      dailyWorkTimingEnd: '',
      budget: '',
      preferredContractor: '',
      ...defaultValues,
    },
  });

  // State for questions with id, text, and answer
  const [questions, setQuestions] = useState<any[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState<Record<string, boolean>>(
    {}
  );

  // State for contractors
  const [contractors, setContractors] = useState<any[]>([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(false);

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
    const projectQuestions =
      allQuestionJson?.[FIVE_BOX_SLUGS.PROJECT_INFORMATION] || [];

    // Restore saved answers from questionJson array format
    const questionsWithSavedAnswers = projectQuestions.map(question => {
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

  // Fetch contractors from API
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setIsLoadingContractors(true);
        const response = await apiService.getUsersDropdown({
          role_id: ROLE_IDS.CONTRACTOR, // Contractor role
          ...(company_id && { company_id }), // Only include company_id if it exists
          page: 1,
          limit: 50,
        });

        if (response) {
          let contractorsData: any[] = [];

          if (response.data && Array.isArray(response.data)) {
            contractorsData = response.data;
          } else if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            contractorsData = response.data.data;
          }
          setContractors(contractorsData);
        }
      } catch (err) {
      } finally {
        setIsLoadingContractors(false);
      }
    };

    fetchContractors();
  }, [company_id]);

  // Helper function to check if field is enabled
  const isFieldEnabled = (fieldName: string): boolean => {
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROJECT_INFORMATION]) {
      return true; // Default to enabled if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROJECT_INFORMATION][
        fieldName
      ];
    return fieldConfig?.enabled ?? true; // Default to enabled if not specified
  };

  // Helper function to check if field is required
  const isFieldRequired = (fieldName: string): boolean => {
    if (!boxSettings?.field_status_json?.[FIVE_BOX_SLUGS.PROJECT_INFORMATION]) {
      return false; // Default to not required if no settings
    }
    const fieldConfig =
      boxSettings.field_status_json[FIVE_BOX_SLUGS.PROJECT_INFORMATION][
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

  // Get form config for Project Information
  const formConfig = getFormConfig(FIVE_BOX_SLUGS.PROJECT_INFORMATION);

  return (
    <div
      className={`w-full bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center`}
    >
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {formConfig?.title || PROJECT_MESSAGES.FORM_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {formConfig?.description || PROJECT_MESSAGES.FORM_DESCRIPTION}
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
                  {/* Project Name */}
                  {isFieldEnabled(PROJECT_INFORMATION_FIELDS.PROJECT_NAME) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2 sm:col-span-2'>
                      <FormField
                        control={form.control}
                        name='projectName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.PROJECT_NAME_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.PROJECT_NAME
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  PROJECT_MESSAGES.PROJECT_NAME_PLACEHOLDER
                                }
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

                  {/* Project Start Date */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.PROJECT_START_DATE
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='projectStartDate'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.PROJECT_START_DATE_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.PROJECT_START_DATE
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Popover
                                open={
                                  datePickerOpen['projectStartDate'] || false
                                }
                                onOpenChange={open =>
                                  setDatePickerOpen(prev => ({
                                    ...prev,
                                    projectStartDate: open,
                                  }))
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full h-12 justify-between text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] mt-2 hover:!bg-[var(--white-background)]',
                                      !field.value && 'text-muted-foreground',
                                      'border-[var(--border-dark)]'
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), 'PPP')
                                    ) : (
                                      <span className='flex-1'>
                                        {PROJECT_MESSAGES.SELECT_START_DATE}
                                      </span>
                                    )}
                                    <IconsaxCalendar
                                      className='ml-2 !h-6 !w-6'
                                      color='var(--primary)'
                                    />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                                  align='start'
                                >
                                  <Calendar
                                    mode='single'
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={date => {
                                      field.onChange(date);
                                      setDatePickerOpen(prev => ({
                                        ...prev,
                                        projectStartDate: false,
                                      }));
                                    }}
                                    initialFocus
                                    classNames={{
                                      day_selected:
                                        'bg-[var(--secondary)] text-white hover:bg-[var(--secondary)] hover:text-white focus:bg-[var(--secondary)] focus:text-white',
                                      day_today:
                                        'bg-[var(--secondary)]/20 text-[var(--text-dark)] hover:bg-[var(--secondary)]/30',
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Project Finish Date */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.PROJECT_FINISH_DATE
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='projectFinishDate'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.PROJECT_FINISH_DATE_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.PROJECT_FINISH_DATE
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Popover
                                open={
                                  datePickerOpen['projectFinishDate'] || false
                                }
                                onOpenChange={open =>
                                  setDatePickerOpen(prev => ({
                                    ...prev,
                                    projectFinishDate: open,
                                  }))
                                }
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full h-12 justify-between text-left font-normal border-2 bg-[var(--white-background)] rounded-[10px] mt-2 hover:!bg-[var(--white-background)]',
                                      !field.value && 'text-muted-foreground',
                                      'border-[var(--border-dark)]'
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), 'PPP')
                                    ) : (
                                      <span className='flex-1'>
                                        {PROJECT_MESSAGES.SELECT_FINISH_DATE}
                                      </span>
                                    )}
                                    <IconsaxCalendar
                                      className='ml-2 !h-6 !w-6'
                                      color='var(--primary)'
                                    />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                                  align='start'
                                >
                                  <Calendar
                                    mode='single'
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={date => {
                                      field.onChange(date);
                                      setDatePickerOpen(prev => ({
                                        ...prev,
                                        projectFinishDate: false,
                                      }));
                                    }}
                                    initialFocus
                                    classNames={{
                                      day_selected:
                                        'bg-[var(--secondary)] text-white hover:bg-[var(--secondary)] hover:text-white focus:bg-[var(--secondary)] focus:text-white',
                                      day_today:
                                        'bg-[var(--secondary)]/20 text-[var(--text-dark)] hover:bg-[var(--secondary)]/30',
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Owner Presence */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.OWNER_PRESENCE
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='ownerPresence'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.OWNER_PRESENCE_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.OWNER_PRESENCE
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={[
                                  {
                                    value: 'yes',
                                    label: PROJECT_MESSAGES.YES_OPTION,
                                  },
                                  {
                                    value: 'no',
                                    label: PROJECT_MESSAGES.NO_OPTION,
                                  },
                                ]}
                                placeholder={
                                  PROJECT_MESSAGES.SELECT_OWNER_PRESENCE
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

                  {/* Weekend Work */}
                  {isFieldEnabled(PROJECT_INFORMATION_FIELDS.WEEKEND_WORK) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='weekendWork'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.WEEKEND_WORK_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.WEEKEND_WORK
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={[
                                  {
                                    value: 'yes',
                                    label: PROJECT_MESSAGES.YES_OPTION,
                                  },
                                  {
                                    value: 'no',
                                    label: PROJECT_MESSAGES.NO_OPTION,
                                  },
                                ]}
                                placeholder={
                                  PROJECT_MESSAGES.SELECT_WEEKEND_WORK
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

                  {/* Daily Work Timing Start */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormLabel className='field-label'>
                        {PROJECT_MESSAGES.DAILY_WORK_TIMING_LABEL}
                        {isFieldRequired(
                          PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING
                        ) && <span className='text-red-500'>*</span>}
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name='dailyWorkTimingStart'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={
                                  PROJECT_MESSAGES.START_TIME_PLACEHOLDER
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Daily Work Timing End */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.DAILY_WORK_TIMING
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormLabel className='field-label'>&nbsp;</FormLabel>
                      <FormField
                        control={form.control}
                        name='dailyWorkTimingEnd'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <TimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={
                                  PROJECT_MESSAGES.END_TIME_PLACEHOLDER
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Budget */}
                  {isFieldEnabled(PROJECT_INFORMATION_FIELDS.BUDGET) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='budget'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {PROJECT_MESSAGES.BUDGET_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.BUDGET
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  PROJECT_MESSAGES.BUDGET_PLACEHOLDER
                                }
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

                  {/* Preferred Contractor */}
                  {isFieldEnabled(
                    PROJECT_INFORMATION_FIELDS.PREFERRED_CONTRACTOR
                  ) && (
                    <div className='flex flex-col gap-1.5 sm:gap-2'>
                      <FormField
                        control={form.control}
                        name='preferredContractor'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='field-label'>
                              {STEP_MESSAGES.PREFERRED_CONTRACTOR_LABEL}
                              {isFieldRequired(
                                PROJECT_INFORMATION_FIELDS.PREFERRED_CONTRACTOR
                              ) && <span className='text-red-500'>*</span>}
                            </FormLabel>
                            <FormControl>
                              <SelectField
                                value={field.value}
                                onValueChange={field.onChange}
                                options={contractors.map((contractor: any) => ({
                                  value: contractor.uuid,
                                  label: contractor.name,
                                }))}
                                placeholder={
                                  isLoadingContractors
                                    ? STEP_MESSAGES.LOADING_CONTRACTORS
                                    : STEP_MESSAGES.SELECT_CONTRACTOR
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
                        <textarea
                          placeholder='Type your answer here...'
                          value={question.answer || ''}
                          onChange={e => {
                            updateQuestionAnswer(id, e.target.value);
                          }}
                          className='min-h-[80px] sm:min-h-[100px] resize-none input-field w-full p-3 border border-[var(--border-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent'
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
                {isLastStep ? 'Submit' : 'Next Step'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
