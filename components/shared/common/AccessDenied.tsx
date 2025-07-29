import { Button } from '@/components/ui/button';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';
import { Lock } from 'iconsax-react';
import { useRouter } from 'next/navigation';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  redirectPath?: string;
  redirectText?: string;
}

export default function AccessDenied({
  title = ACCESS_DENIED_MESSAGES.DEFAULT_TITLE,
  message = ACCESS_DENIED_MESSAGES.DEFAULT_MESSAGE,
  redirectPath,
  redirectText = ACCESS_DENIED_MESSAGES.DEFAULT_REDIRECT_TEXT,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-200px)]'>
      <div className='text-center max-w-md mx-auto p-6'>
        {/* Icon */}
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 rounded-full bg-red-100 flex items-center justify-center'>
            <Lock size='40' color='#ef4444' />
          </div>
        </div>

        {/* Title */}
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>{title}</h1>

        {/* Message */}
        <p className='text-gray-600 mb-8 leading-relaxed'>{message}</p>

        {/* Action Button - Only show if redirectPath is provided */}
        {redirectPath && (
          <Button
            onClick={() => router.push(redirectPath)}
            className='btn-primary px-6 py-3'
          >
            {redirectText}
          </Button>
        )}
      </div>
    </div>
  );
}
