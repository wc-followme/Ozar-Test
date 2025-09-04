'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import { Suspense } from 'react';
import SignupPageContent from './SignupPageContent';

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingComponent variant='fullscreen' />}>
      <SignupPageContent />
    </Suspense>
  );
}
