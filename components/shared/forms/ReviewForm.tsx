'use client';

import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import SelectField from '@/components/shared/common/SelectField';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star1 } from 'iconsax-react';
import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: any;
}

export interface ReviewFormData {
  title: string;
  rating: string;
  review: string;
}

const ratingOptions = [
  { value: '1', label: '1.0' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2.0' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3.0' },
  { value: '3.5', label: '3.5' },
  { value: '4', label: '4.0' },
  { value: '4.5', label: '4.5' },
  { value: '5', label: '5.0' },
];

export const ReviewForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: ReviewFormProps) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    title: initialData?.title || '',
    rating: initialData?.rating?.toString() || '4.5',
    review: initialData?.review || '',
  });

  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ReviewFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    }
    if (!formData.review.trim()) {
      newErrors.review = 'Review is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field] && isSubmitted) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const renderStar = (_rating: string) => {
    return <Star1 size={16} className='text-yellow-500 fill-yellow-500' />;
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Rating Selection */}
      <div className='space-y-2'>
        <Label htmlFor='rating' className='field-label'>
          Rating
        </Label>
        <div className='relative'>
          <SelectField
            options={ratingOptions}
            value={formData.rating}
            onValueChange={value => handleInputChange('rating', value)}
            placeholder='Select rating'
            triggerClassName={`w-full ${errors.rating ? '!border-[var(--warning)]' : ''}`}
          />
          <div className='absolute left-[40px] top-1/2 transform -translate-y-1/2 flex items-center gap-1 pointer-events-none'>
            {renderStar(formData.rating)}
          </div>
        </div>
        {errors.rating && <FormErrorMessage message={errors.rating} />}
      </div>

      {/* Review Title */}
      <div className='space-y-2'>
        <Label htmlFor='title' className='field-label'>
          Review Title
        </Label>
        <input
          type='text'
          id='title'
          placeholder='Enter a title for your review...'
          value={formData.title}
          onChange={e => handleInputChange('title', e.target.value)}
          className={`w-full input-field border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] px-4 py-3 ${
            errors.title
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.title && <FormErrorMessage message={errors.title} />}
      </div>

      {/* Review Text */}
      <div className='space-y-2'>
        <Label htmlFor='review' className='field-label'>
          Write a Review
        </Label>
        <Textarea
          id='review'
          placeholder='Write your review here...'
          value={formData.review}
          onChange={e => handleInputChange('review', e.target.value)}
          className={`min-h-[120px] input-field resize-none border-2 focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] ${
            errors.review
              ? '!border-[var(--warning)] focus:!border-[var(--warning)]'
              : 'border-[var(--border-dark)] focus:border-[var(--secondary)]'
          }`}
        />
        {errors.review && <FormErrorMessage message={errors.review} />}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='btn-secondary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='btn-primary flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
