import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export const PromotionTab = () => {
  return (
    <div className='space-y-6'>
      {/* Current Role Card */}
      <div className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
        <h2 className='text-lg font-semibold text-[var(--text-dark)] mb-4'>
          Current Roll
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-center'>
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Wage Charges</p>
            <p className='font-medium text-[var(--text-dark)]'>$15/hour</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Job Roll</p>
            <p className='font-medium text-[var(--text-dark)]'>Painter</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>Date Last Promoted</p>
            <p className='font-medium text-[var(--text-dark)]'>Feb 01, Mon</p>
          </div>
          <div className='flex justify-end'>
            <Button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg'>
              Request Promotion
            </Button>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
        <h2 className='text-lg font-semibold text-[var(--text-dark)] mb-4'>
          Ratings
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { label: 'Cleanliness', value: '4.5', showStar: true },
            { label: 'Communication', value: '4.5', showStar: true },
            { label: 'Punctuality', value: '4.5', showStar: true },
            { label: 'Work Quality', value: '4.5', showStar: true },
            { label: 'Overall', value: '4.5', showStar: true },
            { label: 'Classes Passed', value: 'Second Class', showStar: false },
            { label: 'Test Scores', value: '65%', showStar: false },
          ].map((item, index) => (
            <div key={index} className='space-y-1'>
              <p className='text-sm text-gray-500'>{item.label}</p>
              <div className='flex items-center gap-1'>
                <span className='font-medium text-[var(--text-dark)]'>
                  {item.value}
                </span>
                {item.showStar && (
                  <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion History Table */}
      <div className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
        <h2 className='text-lg font-semibold text-[var(--text-dark)] mb-4'>
          Promotion History
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Application Date
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Current Role
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Applied Role
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Current Wage
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Applied Wage
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Decision Date
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Status
                </th>
                <th className='text-left py-3 px-4 text-sm font-medium text-gray-500'>
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-gray-100'>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  20/03/2024
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Painter
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Carpenter
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  $12/hour
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  $15/hour
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  22/03/2024
                </td>
                <td className='py-3 px-4'>
                  <Badge className='bg-green-100 text-green-700 border-green-200'>
                    Approved
                  </Badge>
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Leadership potential shown
                </td>
              </tr>
              <tr className='border-b border-gray-100'>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  20/03/2023
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Painter
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Plumber
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  $12/hour
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  $15/hour
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  24/03/2023
                </td>
                <td className='py-3 px-4'>
                  <Badge className='bg-red-100 text-red-700 border-red-200'>
                    Rejected
                  </Badge>
                </td>
                <td className='py-3 px-4 text-sm text-[var(--text-dark)]'>
                  Needs more technical experience
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
