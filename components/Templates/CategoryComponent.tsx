'use client';

import { catIconOptions } from '@/constants/icon-options';
import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface CategoryComponentProps {
  categoryData: CategoryItem[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
  categoryData,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className='p-5 sm:p-6 lg:p-10 rounded-[20px] bg-[var(--card-background)]'>
      <div className='w-full flex flex-col items-center'>
        <h2 className='text-lg sm:text-xl md:text-2xl xl:text-[30px] font-bold text-center mb-2 text-[var(--text-dark)] leading-[1.4]'>
          Which type of project do you need for your home?
        </h2>
        <p className='text-[var(--text-secondary)] mt-2 text-sm md:text-[18px] font-normal text-center mb-6 sm:mb-8 px-2 sm:px-0 leading-[1.4]'>
          Choose the project category to help us provide accurate planning and
          estimates.
        </p>

        <div className='w-full max-w-[1062px]'>
          {Array.from(
            { length: Math.ceil(categoryData.length / 5) },
            (_, groupIndex) => {
              const startIndex = groupIndex * 5;
              const endIndex = Math.min(startIndex + 5, categoryData.length);
              const groupItems = categoryData.slice(startIndex, endIndex);

              return (
                <div
                  key={groupIndex}
                  className={`w-full grid gap-3 sm:gap-6 mb-6 ${
                    groupItems.length === 1
                      ? 'grid-cols-1'
                      : groupItems.length === 2
                        ? 'grid-cols-1 lg:grid-cols-2'
                        : groupItems.length === 3
                          ? 'grid-cols-1 lg:grid-cols-2'
                          : groupItems.length === 4
                            ? 'grid-cols-1 lg:grid-cols-2'
                            : 'grid-cols-1 lg:grid-cols-2'
                  }`}
                >
                  {/* First item in group - full width for 3+ items, half width for 2 items */}
                  {groupItems.length >= 2 &&
                    (() => {
                      const { id, name, description, icon, color, bgColor } =
                        groupItems[0] || {};
                      if (!id) return null;

                      const iconOption = catIconOptions.find(
                        opt => opt.value === icon
                      ) || {
                        icon: () => null,
                        color: '#EBB402',
                        bgColor: '#EBB4021A',
                      };

                      return (
                        <div
                          className={`${
                            groupItems.length === 2
                              ? 'col-span-1 lg:col-span-1 h-full'
                              : 'col-span-1 lg:col-span-2 h-full'
                          }`}
                        >
                          <div
                            className={`flex flex-col sm:flex-row items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                              selectedCategory === id
                                ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                : ''
                            }`}
                            onClick={() => onCategorySelect(id)}
                          >
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 ${bgColor} ${color}`}
                            >
                              {(() => {
                                const IconComponent = iconOption.icon;
                                if (IconComponent) {
                                  return React.createElement(IconComponent, {
                                    className: 'w-6 h-6',
                                  });
                                }
                                return null;
                              })()}
                            </div>
                            <div className='flex-1'>
                              <div className='font-bold text-sm sm:text-base mb-1 text-[var(--text-dark)] leading-[1.4]'>
                                {name}
                              </div>
                              <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-[1.4]'>
                                {description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  {/* Container for 2nd and 3rd items in group - always side by side in 2 columns */}
                  {groupItems.length >= 2 && (
                    <div
                      className={`${
                        groupItems.length === 2
                          ? 'col-span-1 lg:col-span-1'
                          : groupItems.length === 3
                            ? 'col-span-1 lg:col-span-2'
                            : 'col-span-1 lg:col-span-1'
                      }`}
                    >
                      {groupItems.length === 2 ? (
                        // For 2 items, render 2nd item directly without grid
                        (() => {
                          const {
                            id,
                            name,
                            description,
                            icon,
                            color,
                            bgColor,
                          } = groupItems[1] || {};
                          if (!id) return null;

                          const iconOption = catIconOptions.find(
                            opt => opt.value === icon
                          ) || {
                            icon: () => null,
                            color: '#EBB402',
                            bgColor: '#EBB4021A',
                          };

                          return (
                            <div
                              className={`flex flex-col sm:flex-row items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                                selectedCategory === id
                                  ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                  : ''
                              }`}
                              onClick={() => onCategorySelect(id)}
                            >
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 ${bgColor} ${color}`}
                              >
                                {(() => {
                                  const IconComponent = iconOption.icon;
                                  if (IconComponent) {
                                    return React.createElement(IconComponent, {
                                      className:
                                        'w-6 h-6 transition-transform duration-200',
                                    });
                                  }
                                  return null;
                                })()}
                              </div>
                              <div className='flex-1'>
                                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 leading-[1.4]'>
                                  {name}
                                </h3>
                                <p className='text-base text-[var(--text-secondary)] leading-[1.4]'>
                                  {description}
                                </p>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        // For 3+ items, use grid layout
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 h-full'>
                          {/* Second item */}
                          {(() => {
                            const {
                              id,
                              name,
                              description,
                              icon,
                              color,
                              bgColor,
                            } = groupItems[1] || {};
                            if (!id) return null;

                            const iconOption = catIconOptions.find(
                              opt => opt.value === icon
                            ) || {
                              icon: () => null,
                              color: '#EBB402',
                              bgColor: '#EBB4021A',
                            };

                            return (
                              <div
                                className={`flex flex-col items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                                  selectedCategory === id
                                    ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                    : ''
                                }`}
                                onClick={() => onCategorySelect(id)}
                              >
                                <div
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-200 ${bgColor} ${color}`}
                                >
                                  {(() => {
                                    const IconComponent = iconOption.icon;
                                    if (IconComponent) {
                                      return React.createElement(
                                        IconComponent,
                                        {
                                          className:
                                            'w-6 h-6 transition-transform duration-200',
                                        }
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 leading-[1.4]'>
                                  {name}
                                </h3>
                                <p className='text-base text-[var(--text-secondary)] leading-[1.4]'>
                                  {description}
                                </p>
                              </div>
                            );
                          })()}

                          {/* Third item - only show if 3+ items */}
                          {groupItems.length >= 3 &&
                            (() => {
                              const {
                                id,
                                name,
                                description,
                                icon,
                                color,
                                bgColor,
                              } = groupItems[2] || {};
                              if (!id) return null;

                              const iconOption = catIconOptions.find(
                                opt => opt.value === icon
                              ) || {
                                icon: () => null,
                                color: '#EBB402',
                                bgColor: '#EBB4021A',
                              };

                              return (
                                <div
                                  className={`flex flex-col items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                                    selectedCategory === id
                                      ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                      : ''
                                  }`}
                                  onClick={() => onCategorySelect(id)}
                                >
                                  <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-200 ${bgColor} ${color}`}
                                  >
                                    {(() => {
                                      const IconComponent = iconOption.icon;
                                      if (IconComponent) {
                                        return React.createElement(
                                          IconComponent,
                                          {
                                            className:
                                              'w-6 h-6 transition-transform duration-200',
                                          }
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2 leading-[1.4]'>
                                    {name}
                                  </h3>
                                  <p className='text-base text-[var(--text-secondary)] leading-[1.4]'>
                                    {description}
                                  </p>
                                </div>
                              );
                            })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Container for 4th and 5th items in group - vertical stack in right column for 4+ items */}
                  {groupItems.length >= 4 && (
                    <div className='col-span-1 lg:col-span-1'>
                      <div className='flex flex-col gap-3 sm:gap-4 h-full'>
                        {/* Fourth item */}
                        {(() => {
                          const {
                            id,
                            name,
                            description,
                            icon,
                            color,
                            bgColor,
                          } = groupItems[3] || {};
                          if (!id) return null;

                          const iconOption = catIconOptions.find(
                            opt => opt.value === icon
                          ) || {
                            icon: () => null,
                            color: '#EBB402',
                            bgColor: '#EBB4021A',
                          };

                          return (
                            <div
                              className={`flex flex-col sm:flex-row items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                                selectedCategory === id
                                  ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                  : ''
                              }`}
                              onClick={() => onCategorySelect(id)}
                            >
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 ${bgColor} ${color}`}
                              >
                                {(() => {
                                  const IconComponent = iconOption.icon;
                                  if (IconComponent) {
                                    return React.createElement(IconComponent, {
                                      className: 'w-6 h-6',
                                    });
                                  }
                                  return null;
                                })()}
                              </div>
                              <div className='flex-1'>
                                <div className='font-bold text-sm sm:text-base mb-2 text-[var(--text-dark)] leading-[1.4]'>
                                  {name}
                                </div>
                                <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-[1.4]'>
                                  {description}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Fifth item - only show if 5 items in group */}
                        {groupItems.length >= 5 &&
                          (() => {
                            const {
                              id,
                              name,
                              description,
                              icon,
                              color,
                              bgColor,
                            } = groupItems[4] || {};
                            if (!id) return null;

                            const iconOption = catIconOptions.find(
                              opt => opt.value === icon
                            ) || {
                              icon: () => null,
                              color: '#EBB402',
                              bgColor: '#EBB4021A',
                            };

                            return (
                              <div
                                className={`flex flex-row items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                                  selectedCategory === id
                                    ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                    : ''
                                }`}
                                onClick={() => onCategorySelect(id)}
                              >
                                <div
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${bgColor} ${color}`}
                                >
                                  {(() => {
                                    const IconComponent = iconOption.icon;
                                    if (IconComponent) {
                                      return React.createElement(
                                        IconComponent,
                                        {
                                          className: 'w-6 h-6',
                                        }
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                <div className='flex-1'>
                                  <div className='font-bold text-sm sm:text-base mb-2 text-[var(--text-dark)] leading-[1.4]'>
                                    {name}
                                  </div>
                                  <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-[1.4]'>
                                    {description}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                      </div>
                    </div>
                  )}

                  {/* Handle 1 item case separately */}
                  {groupItems.length === 1 &&
                    (() => {
                      const { id, name, description, icon, color, bgColor } =
                        groupItems[0] || {};
                      if (!id) return null;

                      const iconOption = catIconOptions.find(
                        opt => opt.value === icon
                      ) || {
                        icon: () => null,
                        color: '#EBB402',
                        bgColor: '#EBB4021A',
                      };

                      return (
                        <div className='col-span-1'>
                          <div
                            className={`flex flex-col sm:flex-row items-start border-2 border-[var(--border-dark)] rounded-3xl bg-[var(--card-background)] p-4 sm:p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${
                              selectedCategory === id
                                ? 'bg-[var(--card-hover)] shadow-green-100 border-[var(--primary)]'
                                : ''
                            }`}
                            onClick={() => onCategorySelect(id)}
                          >
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-[16px] flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 ${bgColor} ${color}`}
                            >
                              {(() => {
                                const IconComponent = iconOption.icon;
                                if (IconComponent) {
                                  return React.createElement(IconComponent, {
                                    className: 'w-6 h-6',
                                  });
                                }
                                return null;
                              })()}
                            </div>
                            <div className='flex-1'>
                              <div className='font-bold text-sm sm:text-base mb-2 text-[var(--text-dark)] leading-[1.4]'>
                                {name}
                              </div>
                              <div className='text-[var(--text-secondary)] text-sm sm:text-base font-normal leading-[1.4]'>
                                {description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
