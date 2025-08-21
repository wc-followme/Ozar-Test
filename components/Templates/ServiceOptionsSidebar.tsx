'use client';

import { ServiceCategory } from './service-options-types';

interface ServiceOptionsSidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  handleAddCategory: () => void;
  expandedCategories: string[];
  handleAccordionChange: (value: string[]) => void;
  categories: ServiceCategory[];
  handleCategorySelect: (categoryUniqueKey: string) => void;
  selectedServiceOption: string | null;
  formatCurrency: (amount: number) => string;
  selectedCategoryId: string;
  toggleMainAccordion: () => void;
}

export function ServiceOptionsSidebar({
  isSidebarCollapsed,
  toggleSidebar,
  handleAddCategory,
  categories,
  handleCategorySelect,
  selectedServiceOption,
  formatCurrency,
  selectedCategoryId,
  toggleMainAccordion,
}: ServiceOptionsSidebarProps) {
  const totalAmount = categories.reduce(
    (total, category) => total + category.total,
    0
  );

  return (
    <div
      className={`bg-[var(--card-background)] border-r border-[var(--border-dark)] transition-all duration-300 ${
        isSidebarCollapsed ? 'w-14' : 'w-80'
      }`}
    >
      {/* Header Section */}

      {/* Categories List */}
      {!isSidebarCollapsed && (
        <div className='h-[calc(100vh_-_200px)] overflow-y-auto px-4 py-2'>
          {categories.length === 0 ? (
            <div className='p-4 text-center'>
              <p className='text-sm text-[var(--text-secondary)]'>
                No categories yet
              </p>
            </div>
          ) : (
            <div className='space-y-1'>
              {categories.map(category => (
                <div
                  key={category.uniqueKey}
                  className={`group flex items-center cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-[var(--card-hover)] ${
                    selectedCategoryId === category.id
                      ? 'bg-[var(--card-hover)]'
                      : 'bg-transparent'
                  }`}
                  onClick={() => handleCategorySelect(category.uniqueKey)}
                >
                  <span
                    className={`text-sm font-medium group-hover:text-[var(--primary)] ${
                      selectedCategoryId === category.id
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--text-dark)]'
                    }`}
                  >
                    {category.name}
                  </span>
                  <span className='text-xs font-semibold text-[var(--text-dark)] ml-auto'>
                    {formatCurrency(category.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
