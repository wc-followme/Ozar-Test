import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import {
  StepOptionalDetailsData,
  StepOptionalDetailsProps,
} from '@/app/(DashboardLayout)/job-management/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { yupResolver } from '@hookform/resolvers/yup';
import { Clock } from 'iconsax-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '../common/SelectField';

const optionalDetailsSchema = yup.object({
  typeOfProperty: yup.string().required(STEP_MESSAGES.PROPERTY_TYPE_REQUIRED),
  ageOfProperty: yup.string().required(STEP_MESSAGES.PROPERTY_AGE_REQUIRED),
  approxSqft: yup
    .string()
    .matches(/^[0-9]+$/, 'Square footage must contain only numbers')
    .required(STEP_MESSAGES.SQUARE_FOOTAGE_REQUIRED),
  notificationStyle: yup
    .string()
    .required(STEP_MESSAGES.NOTIFICATION_STYLE_REQUIRED),
  dailyWorkStart: yup.string().optional(),
  dailyWorkEnd: yup.string().optional(),
  ownerPresent: yup.string().required(STEP_MESSAGES.OWNER_PRESENCE_REQUIRED),
  weekendWork: yup.string().required(STEP_MESSAGES.WEEKEND_WORK_REQUIRED),
  animals: yup.string().required(STEP_MESSAGES.ANIMALS_REQUIRED),
  petType: yup.string().when('animals', {
    is: 'Yes',
    then: schema => schema.required(STEP_MESSAGES.PET_TYPE_REQUIRED),
    otherwise: schema => schema.optional(),
  }),
});
export function StepOptionalDetails({
  onPrev,
  onNext,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
}: StepOptionalDetailsProps) {
  const form = useForm({
    resolver: yupResolver(optionalDetailsSchema),
    defaultValues: {
      typeOfProperty: 'Residential',
      ageOfProperty: '0-5 years',
      approxSqft: '',
      notificationStyle: 'Email',
      dailyWorkStart: '',
      dailyWorkEnd: '',
      ownerPresent: 'No',
      weekendWork: 'No',
      animals: 'No',
      petType: '',
      ...defaultValues,
    },
  });

  const { watch } = form;
  const animals = watch('animals');

  const onSubmit = (data: any) => {
    onNext(data as StepOptionalDetailsData);
  };

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {STEP_MESSAGES.OPTIONAL_DETAILS_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        {STEP_MESSAGES.OPTIONAL_DETAILS_DESCRIPTION}
      </p>
      <Form {...form}>
        <form
          className='w-full flex flex-col gap-4 sm:gap-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-auto md:-mx-4 md:px-4 md:h-[calc(100vh_-_550px)] overflow-y-auto'>
            {/* Type of Property */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='typeOfProperty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.TYPE_OF_PROPERTY_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          {
                            value: 'Residential',
                            label: STEP_MESSAGES.RESIDENTIAL,
                          },
                          { value: 'Commercial', label: 'Commercial' },
                        ]}
                        placeholder={STEP_MESSAGES.RESIDENTIAL}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Age of Property */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='ageOfProperty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.AGE_OF_PROPERTY_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: '0-5 years', label: '0-5 years' },
                          { value: '6-10 years', label: '6-10 years' },
                          { value: '11-20 years', label: '11-20 years' },
                          { value: '21-30 years', label: '21-30 years' },
                          { value: '31-50 years', label: '31-50 years' },
                          { value: '50+ years', label: '50+ years' },
                        ]}
                        placeholder={STEP_MESSAGES.SELECT_AGE}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Approx. sq ft */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='approxSqft'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.APPROX_SQ_FT_LABEL}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={STEP_MESSAGES.APPROX_SQ_FT_PLACEHOLDER}
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
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Notification Style */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='notificationStyle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.NOTIFICATION_STYLE_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          {
                            value: 'Email',
                            label: STEP_MESSAGES.EMAIL_NOTIFICATION,
                          },
                          { value: 'SMS', label: 'SMS' },
                          { value: 'Phone', label: 'Phone' },
                        ]}
                        placeholder={STEP_MESSAGES.EMAIL_NOTIFICATION}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Daily Work Timing */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormLabel className='field-label'>
                {STEP_MESSAGES.DAILY_WORK_TIMING_LABEL}
              </FormLabel>
              <div className='relative'>
                <FormField
                  control={form.control}
                  name='dailyWorkStart'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          placeholder={STEP_MESSAGES.START_TIME}
                          className='input-field pr-12 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <Clock size='24' color='#24338C' />
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormLabel className='field-label'>&nbsp;</FormLabel>
              <div className='relative'>
                <FormField
                  control={form.control}
                  name='dailyWorkEnd'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          placeholder={STEP_MESSAGES.END_TIME}
                          className='input-field pr-12 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <Clock size='24' color='#24338C' />
                </span>
              </div>
            </div>
            {/* Owner Need to Be Present */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='ownerPresent'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.OWNER_PRESENT_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: 'Yes', label: STEP_MESSAGES.YES },
                          { value: 'No', label: STEP_MESSAGES.NO },
                        ]}
                        placeholder={STEP_MESSAGES.NO}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Weekend Work Availability */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='weekendWork'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.WEEKEND_WORK_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: 'Yes', label: STEP_MESSAGES.YES },
                          { value: 'No', label: STEP_MESSAGES.NO },
                        ]}
                        placeholder={STEP_MESSAGES.YES}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Animals in the Home */}
            <div className='flex flex-col gap-1.5 sm:gap-2'>
              <FormField
                control={form.control}
                name='animals'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.ANIMALS_IN_HOME_LABEL}
                    </FormLabel>
                    <FormControl>
                      <SelectField
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: 'Yes', label: STEP_MESSAGES.YES },
                          { value: 'No', label: STEP_MESSAGES.NO },
                        ]}
                        placeholder={STEP_MESSAGES.YES}
                        className=''
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Pet type? */}
            {animals === 'Yes' && (
              <div className='flex flex-col gap-1.5 sm:gap-2'>
                <FormField
                  control={form.control}
                  name='petType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PET_TYPE_LABEL}
                      </FormLabel>
                      <FormControl>
                        <SelectField
                          value={field.value}
                          onValueChange={field.onChange}
                          options={[
                            { value: 'Dog', label: 'Dog' },
                            { value: 'Cat', label: 'Cat' },
                          ]}
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
          <div className='flex w-full justify-between items-center gap-2'>
            <button
              type='button'
              className={
                cancelButtonClass ||
                'btn-secondary !px-4 md:!px-8 text-sm sm:text-base'
              }
              onClick={onPrev}
            >
              {STEP_MESSAGES.PREVIOUS}
            </button>
            <div className='flex gap-2'>
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
