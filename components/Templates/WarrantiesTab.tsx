'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { WarrantyList } from '@/components/shared/common/WarrantyList';
import {
  WarrantyForm,
  WarrantyFormData,
} from '@/components/shared/forms/WarrantyForm';
import WarrantiesTabSkeleton from '@/components/shared/skeleton/WarrantiesTabSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { warranties, warrantyTabs } from '@/constants/dummy-data';
import { SearchNormal1 } from 'iconsax-react';
import { useMemo, useState } from 'react';

export const WarrantiesTab = () => {
  const [selectedTab, setSelectedTab] = useState('workmanship');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [warrantyToDelete, setWarrantyToDelete] = useState<string | null>(null);
  const [isAddWarrantyOpen, setIsAddWarrantyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Filter warranties based on search and filter
  const filteredWarranties = useMemo(() => {
    let filtered = warranties;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(warranty => warranty.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        warranty =>
          warranty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          warranty.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, filterType]);

  // Get unique warranty types for filter dropdown
  const warrantyTypes = useMemo(() => {
    const types = [...new Set(warranties.map(w => w.type))];
    return [
      { value: 'all', label: 'All Types' },
      ...types.map(type => ({ value: type, label: type })),
    ];
  }, []);

  const handleEdit = (id: string) => {
    const warranty = warranties.find(w => w.id === id);
    if (warranty) {
      setEditingWarranty(warranty);
      setIsAddWarrantyOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setWarrantyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (warrantyToDelete) {
      console.log('Deleting warranty:', warrantyToDelete);
      // Add your delete logic here
    }
    setIsDeleteModalOpen(false);
    setWarrantyToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWarrantyToDelete(null);
  };

  const handleAddWarranty = () => {
    setIsAddWarrantyOpen(true);
  };

  const handleWarrantySubmit = async (data: WarrantyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingWarranty) {
        console.log('Updating warranty:', editingWarranty.id, data);
        // Add your API call here to update the warranty
      } else {
        console.log('Adding new warranty:', data);
        // Add your API call here to save the warranty
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the side sheet after successful submission
      setIsAddWarrantyOpen(false);
      setEditingWarranty(null);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error saving warranty:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancelAddWarranty = () => {
    setIsAddWarrantyOpen(false);
    setEditingWarranty(null);
  };

  // Show loading state
  if (loading) {
    return <WarrantiesTabSkeleton />;
  }

  return (
    <div className='space-y-6'>
      {/* Header with Search, Filter, and Add Button */}
      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between'>
        <div className='relative flex-1 sm:flex-initial w-full'>
          <SearchNormal1
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]'
            color='var(--primary)'
            size={20}
          />
          <Input
            placeholder='Search here...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 lg:w-[360px] w-full h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
          />
        </div>
        <div className='flex flex-col items-start lg:items-center sm:flex-row gap-3 w-full lg:w-auto'>
          {/* Search Input */}

          {/* Filter Dropdown */}
          <SelectField
            options={warrantyTypes}
            value={filterType}
            onValueChange={value => setFilterType(value)}
            placeholder='Filter by type'
            className='w-full lg:w-48'
            triggerClassName='rounded-[30px] h-[42px]'
          />

          {/* Add Button */}
          <Button
            onClick={handleAddWarranty}
            className='btn-primary h-10 px-4 ml-auto'
          >
            Add Warranty
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)]'>
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
                  options={warrantyTabs.map(tab => ({
                    value: tab.value,
                    label: tab.label,
                  }))}
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  placeholder='Select warranty type'
                  className='w-full'
                  triggerClassName='rounded-lg h-[42px]'
                />
              </div>

              {/* Desktop Tabs */}
              <div className='hidden lg:block'>
                <TabsList className='flex flex-col w-full rounded-lg h-auto'>
                  {warrantyTabs.map((tab, index) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.value}
                      className={`w-full justify-start px-3 py-4 leading-none text-[var(--text-dark)] data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] rounded-lg font-medium ${
                        index !== warrantyTabs.length - 1
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
              {warrantyTabs.map(tab => (
                <TabsContent key={tab.id} value={tab.value} className='mt-0'>
                  <div className='space-y-4'>
                    {tab.value === 'all'
                      ? filteredWarranties.map(warranty => (
                          <WarrantyList
                            key={warranty.id}
                            id={warranty.id}
                            title={warranty.title}
                            duration={warranty.duration}
                            description={warranty.description}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))
                      : filteredWarranties
                          .filter(w => w.type.toLowerCase() === tab.value)
                          .map(warranty => (
                            <WarrantyList
                              key={warranty.id}
                              id={warranty.id}
                              title={warranty.title}
                              duration={warranty.duration}
                              description={warranty.description}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={cancelDelete}
        onDelete={confirmDelete}
        title='Delete Warranty'
        subtitle='Are you sure you want to delete this warranty? This action cannot be undone.'
        archiveButtonText='Delete'
      />

      {/* Add/Edit Warranty SideSheet */}
      <SideSheet
        open={isAddWarrantyOpen}
        onOpenChange={setIsAddWarrantyOpen}
        title={editingWarranty ? 'Edit Warranty' : 'Add Warranty'}
        size='600px'
      >
        <WarrantyForm
          onSubmit={handleWarrantySubmit}
          onCancel={handleCancelAddWarranty}
          isLoading={isSubmitting}
          initialData={editingWarranty}
        />
      </SideSheet>
    </div>
  );
};
