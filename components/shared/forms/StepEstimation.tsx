import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const estimationSchema = yup.object({
  // Placeholder schema for future implementation
});

interface StepEstimationProps {
  onPrev?: () => void;
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isLastStep?: boolean;
  cancelButtonClass?: string;
}

export function StepEstimation({
  onPrev,
  onSubmit,
  defaultValues,
  isLastStep = false,
  cancelButtonClass,
}: StepEstimationProps) {
  const form = useForm({
    resolver: yupResolver(estimationSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className='w-full max-w-[1200px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        Estimation
      </h2>
      <p className='text-[var(--text-secondary)] text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 max-w-lg px-2 sm:px-0'>
        Get detailed cost estimates for your project
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='estimation'
            render={({}) => (
              <FormItem>
                <FormControl>
                  <div className='h-auto md:h-[calc(100vh_-_550px)] md:-mx-4 md:px-4 overflow-y-auto'>
                    <div className='w-full flex items-center justify-center h-64'>
                      <div className='text-center'>
                        <p className='text-lg text-[var(--text-secondary)] mb-4'>
                          Estimation
                        </p>
                        <p className='text-sm text-[var(--text-secondary)]'>
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex w-full justify-between items-center gap-2'>
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
            <Button
              type='submit'
              className='btn-primary !px-4 md:!px-8 text-sm sm:text-base'
            >
              {isLastStep ? 'Submit' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
