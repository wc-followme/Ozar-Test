import { AlertCircle } from 'lucide-react';

export const DisciplinaryTab = () => {
  return (
    <div className='bg-white rounded-lg p-8 shadow-sm border border-gray-200'>
      <div className='text-center'>
        <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <AlertCircle className='w-8 h-8 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No Disciplinary Records Found
        </h3>
        <p className='text-gray-500'>
          There are currently no disciplinary records for this employee. All
          records will appear here if any disciplinary actions are taken.
        </p>
      </div>
    </div>
  );
};
