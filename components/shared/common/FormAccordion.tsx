'use client';

import React from 'react';

import {
  Accordion,
  AccordionContent as UIAccordionContent,
  AccordionItem as UIAccordionItem,
  AccordionTrigger as UIAccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowSquareDown } from 'iconsax-react';

interface FormAccordionProps {
  children: React.ReactNode;
}

export const FormAccordion: React.FC<FormAccordionProps> = ({ children }) => {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {children}
    </Accordion>
  );
};

interface FormAccordionItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
}

export const FormAccordionItem: React.FC<FormAccordionItemProps> = ({
  value,
  title,
  children,
}) => {
  return (
    <UIAccordionItem
      value={value}
      className='bg-[var(--card-background)] overflow-hidden'
    >
      <UIAccordionTrigger className='py-4 sm:py-5 text-base sm:text-lg font-semibold text-[var(--text-dark)] hover:no-underline flex items-center justify-between gap-3 group [&>svg]:hidden'>
        <span className='text-base font-bold text-[var(--text-dark)]'>
          {title}
        </span>
        <div>
          <ArrowSquareDown
            size={20}
            className='transition-transform duration-200 group-data-[state=open]:rotate-180'
            color='var(--text-dark)'
          />
        </div>
      </UIAccordionTrigger>
      <FormAccordionContent>{children}</FormAccordionContent>
    </UIAccordionItem>
  );
};

interface FormAccordionContentProps {
  children: React.ReactNode;
}

export const FormAccordionContent: React.FC<FormAccordionContentProps> = ({
  children,
}) => {
  return (
    <UIAccordionContent className='pb-5 sm:pb-6 bg-[var(--card-background)]'>
      {children}
    </UIAccordionContent>
  );
};

export default FormAccordion;
