'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/common';
import { THANK_YOU_MESSAGES } from '@/constants/messages';
import { TickCircle } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../ui/button';

interface ThankYouComponentProps {
  title?: string;
  message?: string;
}

export function ThankYouComponent({
  title = THANK_YOU_MESSAGES.DEFAULT_TITLE,
  message = THANK_YOU_MESSAGES.DEFAULT_MESSAGE,
}: ThankYouComponentProps) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push(ROUTES.AUTH_LOGIN);
  };

  return (
    <div className='bg-[var(--white-background)] flex flex-col items-center justify-center p-4 rounded-2xl'>
      <Card className='w-full bg-[var(--card-background)] border-0'>
        <CardContent className='p-8 text-center border-0'>
          {/* Success Icon */}
          <div className='flex justify-center mb-6'>
            <TickCircle
              className=' text-green-600'
              color='var(--secondary)'
              variant='Bold'
              size={125}
            />
          </div>

          {/* Title */}
          <h1 className='text-2xl font-normal text-[var(--text-dark)] mb-6 max-w-[505px] mx-auto text-center'>
            {title}
          </h1>

          {/* Message */}
          <p className='text-[var(--text-secondary)] text-lg leading-snug mb-8 max-w-[456px] mx-auto text-center'>
            {message}
          </p>

          {/* Additional Info */}
          <div className=''>
            <Button
              className='btn-primary text-center mx-auto'
              onClick={handleLoginClick}
            >
              {THANK_YOU_MESSAGES.GO_TO_LOGIN_BUTTON}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
