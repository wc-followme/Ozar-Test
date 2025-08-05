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
            border-[#BFBFBF]
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
            backgroundColor:
              template.category === 'Interior' ? '#24338C26' : '#34AD4426',
          }}
        >
          {template.category}
        </div>
      </div>
    </Label>
  );
}
