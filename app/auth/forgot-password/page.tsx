'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { Suspense } from 'react';
import ForgotPasswordPageContent from './ForgotPasswordPageContent';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingComponent variant='fullscreen' />}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
