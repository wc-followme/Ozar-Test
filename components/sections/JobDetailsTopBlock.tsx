import OtherQuestionComponent from '@/components/shared/common/OtherQuestionComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import { ArrowDown2, Edit2 } from 'iconsax-react';
import Image from 'next/image';
import { useState } from 'react';

interface JobDetailsTopBlockProps {
  // Job status props
  status: string;
  jobStatus: string;
  isArchived: boolean;
  isClosed: boolean;

  // Job data props
  projectId: string;
  projectName: string;
  categoryName: string;
  spent: number;
  budgetAmount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  projectImage: string;
  mapImage: string;

  // Messages
  archivedStatusMessage: string;
  closedStatusMessage: string;

  // Callbacks
  onEditClick?: () => void;
  onOtherQuestionsClick?: () => void;
}

const JobDetailsTopBlock: React.FC<JobDetailsTopBlockProps> = ({
  status,
  jobStatus,
  isArchived,
  isClosed,
  projectId,
  projectName,
  categoryName,
  spent,
  budgetAmount,
  clientName,
  clientEmail,
  clientPhone,
  clientAddress,
  projectImage,
  mapImage,
  archivedStatusMessage,
  closedStatusMessage,
  onEditClick,
  onOtherQuestionsClick,
}) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showOtherQuestions, setShowOtherQuestions] = useState(false);

  return (
    <div className='bg-[var(--card-background)] rounded-[20px] p-6 border border-[var(--border-dark)]'>
      {isArchived && (
        <div className='absolute top-6 right-6 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
          {archivedStatusMessage}
        </div>
      )}
      {isClosed && (
        <div className='absolute top-6 right-6 bg-[var(--secondary)] text-white px-3 py-1 rounded-full text-sm font-medium'>
          {closedStatusMessage}
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-6 relative pt-12 lg:pt-0'>
        {/* Left Side - Project Image */}
        <div className='flex-shrink-0'>
          <Image
            src={projectImage}
            alt='Project'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[120px] h-[120px]'
          />
        </div>

        {/* Middle Section - Key Information */}
        <div className='flex-1 max-w-full space-y-6 w-full'>
          {/* First Row */}
          <div className='flex items-start gap-6 flex-wrap'>
            {/* Left: Labels/Values group */}
            <div className='flex flex-wrap gap-6 flex-1 w-min max-w-full'>
              <div className='flex-1 w-min max-w-full shrink-0 min-w-[150px]'>
                <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                  Project ID
                </div>
                <div className='font-semibold text-base text-[var(--text-dark)]'>
                  {projectId}
                </div>
              </div>

              <div className='flex-1 w-min max-w-full shrink-0 min-w-[120px]'>
                <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                  Project Name
                </div>
                <div className='font-semibold text-base text-[var(--text-dark)]'>
                  {projectName}
                </div>
              </div>

              <div className='flex-1 w-min max-w-full shrink-0 min-w-[120px]'>
                <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                  Job Category
                </div>
                <div className='font-semibold text-base text-[var(--text-dark)]'>
                  {categoryName}
                </div>
              </div>

              <div className='shrink-0 min-w-[280px]'>
                <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                  Budget
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-base text-[var(--text-dark)]'>
                      ${spent.toLocaleString()}
                    </span>
                    <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        className='h-2 bg-[var(--secondary)]'
                        style={{ width: `${(spent / budgetAmount) * 100}%` }}
                      />
                    </div>
                    <span className='text-[var(--text-dark)] font-semibold'>
                      ${budgetAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Status + View More */}
            <div className='flex items-center gap-2 ml-auto absolute top-0 right-0 lg:relative'>
              <div className='bg-[#D4323226] text-[var(--warning)] px-3 py-1 rounded-full text-sm font-medium animate-pulse'>
                Pending Details
              </div>
              <Button
                variant='ghost'
                className='bg-transparent p-0 h-auto w-[100px] !gap-0'
                onClick={() => setShowMoreDetails(prev => !prev)}
              >
                <span className='mr-1'>
                  {showMoreDetails ? 'View Less' : 'View More'}
                </span>
                <ArrowDown2
                  size={16}
                  className='text-[var(--text-secondary)] [&>path]:!stroke-2'
                  color='var(--text-dark)'
                  strokeWidth={3}
                />
              </Button>
            </div>
          </div>

          {/* Second Row */}
          <div className='flex items-start gap-6 flex-wrap pt-4 border-t border-[var(--border-dark)]'>
            <div className='flex-1 w-min max-w-full shrink-0 min-w-[150px]'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Client Name
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientName}
              </div>
            </div>

            <div className='flex-1 w-fit max-w-full shrink-0 min-w-fit'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Email
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientEmail}
              </div>
            </div>

            <div className='flex-1 w-min max-w-full shrink-0 min-w-[150px]'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Phone Number
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientPhone}
              </div>
            </div>

            <div className='flex-[2] min-w-[280px]'>
              <div className='text-sm text-[var(--text-secondary)] font-normal mb-1'>
                Address
              </div>
              <div className='font-semibold text-base text-[var(--text-dark)]'>
                {clientAddress}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {showMoreDetails && (
            <div className='space-y-4 transition-all duration-700 ease-in-out transform origin-top animate-in slide-in-from-top-2'>
              {/* Row 3 */}
              <div className='flex items-start gap-6 flex-wrap pt-4 border-t border-[var(--border-dark)]'>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[180px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Preferred Contact Method
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    Phone
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[200px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Best time to contact
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    09:00 AM - 08:00 PM
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[220px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Another Email
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    tanya.03@example.com
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[200px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Another Phone Number
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    (239) 555-0256
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[100px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Pet
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    Dog
                  </div>
                </div>
              </div>

              {/* Row 4 */}
              <div className='flex items-start gap-6 flex-wrap pt-4 border-t border-[var(--border-dark)]'>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[160px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Property
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    Residential
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[160px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Type of Property
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    House/Villa
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[120px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    BHK
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    5 BHK
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[120px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Floor
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    2 Floor
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[160px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Approx. sq ft
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    2500 Sq / Ft
                  </div>
                </div>
                <div className='flex-1 w-min max-w-full shrink-0 min-w-[140px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Age of Property
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    20 years
                  </div>
                </div>
              </div>

              {/* Row 5 */}
              <div className='flex items-start gap-6 flex-wrap pt-4 border-t border-[var(--border-dark)]'>
                <div className='shrink-0 min-w-[240px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Owner Presence
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    No
                  </div>
                </div>
                <div className='shrink-0 min-w-[140px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Weekend Work
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    Yes
                  </div>
                </div>
                <div className='shrink-0 min-w-[300px]'>
                  <div className='text-sm text-[var(--text-secondary)] mb-1'>
                    Daily Work Timing
                  </div>
                  <div className='font-semibold text-base text-[var(--text-dark)]'>
                    09:00 AM - 08:00 PM
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='btn-secondary'
                  onClick={() => setShowOtherQuestions(true)}
                >
                  Other Questions
                </Button>
                {/* Actions on the right */}
                <div className='flex items-center gap-3 ml-auto'>
                  <Button
                    variant='outline'
                    className='btn-secondary'
                    onClick={onEditClick}
                  >
                    <Edit2 size={18} color='var(--text-dark)' />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Map and Status */}
        <div className='flex flex-col items-center gap-4'>
          {/* Map Image */}
          <Image
            src={mapImage}
            alt='Map'
            width={120}
            height={120}
            className='rounded-[8px] object-cover w-[120px] h-[120px]'
          />
        </div>
      </div>

      {/* Other Questions SideSheet */}
      <SideSheet
        open={showOtherQuestions}
        onOpenChange={setShowOtherQuestions}
        title='Other Questions'
        size='600px'
      >
        <OtherQuestionComponent onClose={() => setShowOtherQuestions(false)} />
      </SideSheet>
    </div>
  );
};

export default JobDetailsTopBlock;
