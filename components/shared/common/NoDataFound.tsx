import Image from 'next/image';
import React from 'react';

interface NoDataFoundProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = 'Nothing Here Yet',
  description = 'You haven&apos;t created any items yet. Start by adding your first one.',
  buttonText = 'Create',
  onButtonClick,
  showButton = true,
}) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] h-full text-center'>
      <div className='mb-4 md:mb-8'>
        <Image
          src='/images/no-data-found.svg'
          height={250}
          width={250}
          alt=''
          className='object-fit max-h-32 md:max-h-fit'
        />
      </div>
      <h2 className='text-xl md:text-2xl font-bold text-[var(--text-dark)] mb-2'>
        {title}
      </h2>
      <p className='text-base md:text-2xl font-medium text-[var(--text-dark)] mb-6 max-w-[738px]'>
        {description}
      </p>
      {showButton && onButtonClick && (
        <button onClick={onButtonClick} className='btn-primary !px-6'>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default NoDataFound;
