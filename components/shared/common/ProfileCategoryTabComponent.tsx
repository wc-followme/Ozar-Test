'use client';

import SelectField from '@/components/shared/common/SelectField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCompanyId } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ProfileCategoryTabComponentProps {
  companyId?: string | undefined;
}

export const ProfileCategoryTabComponent = ({
  companyId,
}: ProfileCategoryTabComponentProps) => {
  const [selectedTab, setSelectedTab] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAuthError } = useAuth();

  // Fetch categories with services
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentCompanyId = companyId || getCompanyId();
        const response = await apiService.fetchCategoriesWithServices({
          page: 1,
          limit: 50,
          ...(currentCompanyId && { company_id: currentCompanyId }),
        });

        if (
          response &&
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          setCategories(response.data.data);
          // Set first category as selected if available
          if (response.data.data.length > 0 && response.data.data[0]?.uuid) {
            setSelectedTab(response.data.data[0].uuid);
          }
        }
      } catch (err) {
        if (handleAuthError(err)) return;
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform API data to match component structure
  const tabData = categories.map(category => ({
    id: category.uuid || '',
    label: category.name || '',
    services:
      category.services?.map((service: any) => service.name || '') || [],
  }));

  // Show loading state
  if (loading) {
    return (
      <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4'>
        <div className='text-center text-[var(--text-secondary)]'>
          Loading categories...
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4'>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    );
  }

  // Show empty state
  if (tabData.length === 0) {
    return (
      <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-4'>
        <div className='text-center text-[var(--text-secondary)]'>
          No categories available
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)]'>
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className='w-full'
      >
        <div className='flex lg:gap-6 gap-0 lg:flex-row flex-col'>
          <div className='lg:w-[280px] w-full shrink-0 p-4'>
            {/* Mobile Select Dropdown */}
            <div className='lg:hidden'>
              <SelectField
                options={tabData.map(tab => ({
                  value: tab.id,
                  label: tab.label,
                }))}
                value={selectedTab}
                onValueChange={setSelectedTab}
                placeholder='Select category'
                className='w-full'
                triggerClassName='rounded-lg h-[42px]'
              />
            </div>

            {/* Desktop Tabs */}
            <div className='hidden lg:block'>
              <TabsList className='flex flex-col w-full rounded-lg h-auto'>
                {tabData.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`w-full justify-start px-3 py-4 leading-none text-[var(--text-dark)] data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] rounded-lg font-medium ${
                      index !== tabData.length - 1
                        ? 'border-b border-[var(--border-dark)]'
                        : ''
                    }`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className='flex-1 p-4 bg-[var(--background)] lg:rounded-r-[20px]'>
            {tabData.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className='mt-0'>
                <div className='flex flex-wrap gap-3 bg-[var(--card-background)] rounded-[10px] p-5'>
                  {tab.services.map((service: string, index: number) => (
                    <div
                      key={index}
                      className='bg-[var(--background)] px-3 py-2 rounded-[30px] text-sm font-medium text-[var(--text-dark)]'
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};
