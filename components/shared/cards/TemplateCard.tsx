'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Template {
  id: string;
  name: string;
  propertyType: string;
  createdOn: string;
  category: string;
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onToggle: () => void;
}

// Color array from Avatar component for consistent color scheme
const CATEGORY_COLORS = [
  { bg: '#1A57BF1A', color: '#1A57BF' }, // Blue
  { bg: '#34AD4426', color: '#34AD44' }, // Green
  { bg: '#00A8BF26', color: '#00A8BF' }, // Teal
  { bg: '#90C91D26', color: '#90C91D' }, // Lime
  { bg: '#EBB40226', color: '#EBB402' }, // Yellow
  { bg: '#D4323226', color: '#D43232' }, // Red
  { bg: '#FF6B3526', color: '#FF6B35' }, // Orange
];

// Function to get background color based on category text
const getCategoryBackgroundColor = (category: string): string => {
  const categoryLower = category.toLowerCase();

  // Get the first character of the category
  const firstChar = categoryLower.length > 0 ? categoryLower[0] : '';
  if (!firstChar || CATEGORY_COLORS.length === 0) return '#1A57BF1A';

  // Use the same logic as Avatar component
  const charCode = firstChar.charCodeAt(0);
  const idx = charCode % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx]?.bg || '#1A57BF1A';
};

export function TemplateCard({
  template,
  isSelected,
  onToggle,
}: TemplateCardProps) {
  return (
    <Label
      className={`relative p-4 rounded-[10px] bg-transparent border border-[var(--border-dark)] transition-all duration-200 cursor-pointer hover:shadow-md [&:has(input:checked)]:border-[var(--primary)]`}
    >
      <div className='flex items-start flex-col'>
        <div className='flex items-base pt-0.5 gap-2 mb-3 w-full'>
          <p className='text-[18px] leading-[1.2] font-bold cursor-pointer block text-[var(--text-dark)]'>
            {template.name}
          </p>
          <Checkbox
            id={`template-${template.id}`}
            className='
            rounded-[6px] 
            border-2 
            border-[var(--dark-border-other)]
            data-[state=checked]:bg-[--primary]
            data-[state=checked]:border-[--primary]
            data-[state=checked]:text-white
            text-white 
            w-6 h-6
            flex items-center justify-center -mt-0.4
            ml-auto
          '
            checked={isSelected}
            onCheckedChange={onToggle}
          />
        </div>
        <div className='w-full flex  items-start gap-2'>
          <p className='text-sm flex flex-1 flex-col font-normal leading-relaxed text-[var(--text-secondary)] mb-2'>
            Property Type:{' '}
            <span className='text-[var(--text-dark)] font-medium'>
              {template.propertyType}
            </span>
          </p>
          <p className='text-sm flex flex-1 flex-col font-normal leading-relaxed text-[var(--text-secondary)] mb-4'>
            Created on{' '}
            <span className='text-[var(--text-dark)] font-medium'>
              {template.createdOn}
            </span>
          </p>
        </div>
        <div
          className='inline-block px-3 py-2 rounded-full text-sm text-[var(--text-dark)] font-medium w-full text-center'
          style={{
            backgroundColor: getCategoryBackgroundColor(template.category),
          }}
        >
          {template.category}
        </div>
      </div>
    </Label>
  );
}
