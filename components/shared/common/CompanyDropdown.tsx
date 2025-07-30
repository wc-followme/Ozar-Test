'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DEFAULT_COMPANIES,
  HEADER_MESSAGES,
} from '@/constants/header-messages';
import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface Company {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CompanyDropdownProps {
  companies?: Company[];
  selectedCompany?: Company | undefined;
  onSelect: (company: Company) => void;
  placeholder?: string;
  className?: string;
}

export const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  companies,
  selectedCompany,
  onSelect,
  placeholder = HEADER_MESSAGES.COMPANY_DROPDOWN.PLACEHOLDER,
  className,
}) => {
  const companyList = companies || DEFAULT_COMPANIES;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = companyList.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company: Company) => {
    onSelect(company);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <Button
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 border-0 p-0 max-w-[160px] sm:max-w-none'
        )}
      >
        {selectedCompany ? (
          <span className='text-[var(--text-dark)] text-lg sm:text-2xl font-bold truncate'>
            {selectedCompany.name}
          </span>
        ) : (
          <span className='text-[var(--text-dark)] text-lg sm:text-2xl font-bold truncate'>
            {placeholder}
          </span>
        )}
        <ChevronDown
          className={cn(
            '!h-6 !w-6 text-[var(--text-dark)] transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 bg-[var(--card-background)] border border-[var(--border-dark)] rounded-lg shadow-boxShadow z-50 min-w-[260px]'>
          {/* Search Field */}
          <div className='p-3 border-b border-[var(--border-dark)]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--primary)]' />
              <Input
                type='text'
                placeholder={
                  HEADER_MESSAGES.COMPANY_DROPDOWN.SEARCH_PLACEHOLDER
                }
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-3 h-8 border-0 focus:ring-0 focus:border-0 bg-transparent !placeholder-[var(--text-placeholder)]'
              />
            </div>
          </div>

          {/* Scrollable List */}
          <div className='max-h-64 flex overflow-hidden relative pb-2'>
            <ScrollArea className='h-auto employees-dropdown-scrollbar w-full'>
              <div className='p-0 px-4'>
                {filteredCompanies.map((company, index) => (
                  <div
                    key={company.id}
                    onClick={() => handleSelect(company)}
                    className={cn(
                      'flex items-center gap-3 py-3 cursor-pointer hover:bg-[var(--card-hover)] transition-colors',
                      index !== filteredCompanies.length - 1 &&
                        'border-b border-[var(--border-dark)]'
                    )}
                  >
                    <div className='w-8 h-6 rounded-lg flex items-center justify-center truncate'>
                      <Image
                        src={company.icon}
                        alt={company.name}
                        width={20}
                        height={20}
                        className='w-5 h-5'
                      />
                    </div>
                    <span className='text-[var(--text-dark)] font-medium'>
                      {company.name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDropdown;
