import React from 'react';

interface LoadingComponentProps {
  variant?: 'fullscreen' | 'inline' | 'page';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  variant = 'fullscreen',
  size = 'md',
  text = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--secondary)] border-t-transparent ${sizeClasses[size]}`}
    ></div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className='fixed h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-50'>
        <div className='flex flex-col items-center gap-3'>
          {spinner}
          <span className='text-white text-sm'>{text}</span>
        </div>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col items-center gap-3'>
          {spinner}
          <span className='text-gray-600 text-sm'>{text}</span>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className='flex flex-col items-center gap-3 py-10'>
      {spinner}
      <span className='text-gray-600 text-sm'>{text}</span>
    </div>
  );
};

export default LoadingComponent;
