'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface Employee {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface EmployeesDropdownProps {
  employees?: Employee[];
  selectedEmployee?: Employee | undefined;
  onSelect: (employee: Employee) => void;
  placeholder?: string;
  className?: string;
}

const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'Virtual Homes',
    icon: '/images/company-management/company-img-1.png',
    color: '#8B5CF6',
  },
  {
    id: '2',
    name: 'Innovative Dwellings',
    icon: '/images/company-management/company-img-2.png',
    color: '#F59E0B',
  },
  {
    id: '3',
    name: 'Dream Builders',
    icon: '/images/company-management/company-img-3.png',
    color: '#10B981',
  },
  {
    id: '4',
    name: 'Future Foundations',
    icon: '/images/company-management/company-img-4.png',
    color: '#EC4899',
  },
  {
    id: '5',
    name: 'Eco Homes',
    icon: '/images/company-management/company-img-1.png',
    color: '#10B981',
  },
  {
    id: '6',
    name: 'Urban Living',
    icon: '/images/company-management/company-img-2.png',
    color: '#3B82F6',
  },
];

export const EmployeesDropdown: React.FC<EmployeesDropdownProps> = ({
  employees,
  selectedEmployee,
  onSelect,
  placeholder = 'Select Company',
  className,
}) => {
  const employeeList = employees || defaultEmployees;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredEmployees = employeeList.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <Button
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 border-0 p-0 max-w-[140px] sm:max-w-none'
        )}
      >
        {selectedEmployee ? (
          <span className='text-[var(--text-dark)] text-base sm:text-[18px] font-bold truncate'>
            {selectedEmployee.name}
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
        <div className='absolute top-full -left-[50px] sm:left-0 mt-1 bg-[var(--card-background)] border border-[var(--border-dark)] rounded-lg shadow-boxShadow z-50 min-w-[260px]'>
          {/* Search Field */}
          <div className='p-3 border-b border-[var(--border-dark)]'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--primary)]' />
              <Input
                type='text'
                placeholder='Search here...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-3 h-8 border-0 focus:ring-0 focus:border-0 bg-transparent !placeholder-[var(--text-placeholder)]'
              />
            </div>
          </div>

          {/* Scrollable List */}
          <div className='max-h-64 flex overflow-hidden relative'>
            <ScrollArea className='h-auto employees-dropdown-scrollbar w-full'>
              <div className='p-0 px-4'>
                {filteredEmployees.map((employee, index) => (
                  <div
                    key={employee.id}
                    onClick={() => handleSelect(employee)}
                    className={cn(
                      'flex items-center gap-3 py-3 cursor-pointer hover:bg-[var(--card-hover)] transition-colors',
                      index !== filteredEmployees.length - 1 &&
                        'border-b border-[var(--border-dark)]'
                    )}
                  >
                    <div className='w-8 h-6 rounded-lg flex items-center justify-center truncate'>
                      <Image
                        src={employee.icon}
                        alt={employee.name}
                        width={20}
                        height={20}
                        className='w-5 h-5'
                      />
                    </div>
                    <span className='text-[var(--text-dark)] font-medium'>
                      {employee.name}
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

export default EmployeesDropdown;
