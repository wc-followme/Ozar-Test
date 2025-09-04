'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import SelectField from '@/components/shared/common/SelectField';
import SideSheet from '@/components/shared/common/SideSheet';
import { WarrantyList } from '@/components/shared/common/WarrantyList';
import {
  WarrantyForm,
  WarrantyFormData,
} from '@/components/shared/forms/WarrantyForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removed static import - using only API data
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { SearchNormal1 } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
import LoadingComponent from '../shared/common/LoadingComponent';
import NoDataFound from '../shared/common/NoDataFound';
import { showErrorToast, showSuccessToast } from '../ui/use-toast';

// Type definitions
interface WarrantyDetail {
  id: string;
  category_name: string;
  duration: string;
  description: string;
}

interface WarrantyGroup {
  warranties: string;
  warranties_details: WarrantyDetail[];
  uuid?: string;
}

interface FlatWarranty {
  id: string;
  group: string;
  title: string;
  duration: string;
  description: string;
}

interface WarrantiesTabProps {
  companyId?: string;
  canEditCompany?: boolean;
}

export const WarrantiesTab = ({
  companyId,
  canEditCompany = false,
}: WarrantiesTabProps) => {
  const { handleAuthError } = useAuth();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [warrantyToDelete, setWarrantyToDelete] = useState<string | null>(null);
  const [isAddWarrantyOpen, setIsAddWarrantyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<{
    id: string;
    type: string;
    category: string;
    description: string;
    duration: string;
  } | null>(null);

  // State for warranties data - starts empty, populated from API
  const [warrantiesData, setWarrantiesData] = useState<WarrantyGroup[]>([]);
  const [isLoadingWarranties, setIsLoadingWarranties] = useState(true);

  // Load warranties from API when component mounts
  useEffect(() => {
    const loadWarranties = async () => {
      if (!companyId) return;

      setIsLoadingWarranties(true);

      try {
        const response = await apiService.getCompanyWarranties({
          company_id: companyId,
          status: 'ACTIVE',
          sortBy: 'created_at',
          sortOrder: 'DESC',
        });

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Transform API response to match our local structure
          const transformedData = response.data.data.map(
            (warranty: {
              name: string;
              warranties_details?: WarrantyDetail[];
              uuid: string;
            }) => ({
              warranties: warranty.name,
              warranties_details: warranty.warranties_details || [],
              uuid: warranty.uuid,
            })
          );

          setWarrantiesData(transformedData);
        } else {
          // No warranties found
          setWarrantiesData([]);
        }
      } catch (error) {
        if (handleAuthError(error)) return;
        setWarrantiesData([]);
      } finally {
        setIsLoadingWarranties(false);
      }
    };

    loadWarranties();
  }, [companyId]);

  // Helper function to convert lowercase to title case for display
  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Derived tabs from grouped warranties
  const computedTabs = useMemo(() => {
    const groups = warrantiesData || [];
    const tabs = groups.map(g => ({
      id: g.warranties,
      value: g.warranties,
      label: toTitleCase(g.warranties), // Display in title case
    }));
    return [{ id: 'all', value: 'all', label: 'All Warranties' }, ...tabs];
  }, [warrantiesData]);
  // Flatten warranties with group for rendering and search
  const flatWarranties = useMemo((): FlatWarranty[] => {
    const groups = warrantiesData || [];
    return groups.flatMap(group =>
      (group.warranties_details || []).map((item: WarrantyDetail) => ({
        id: `${group.warranties}:${item.id}`,
        group: group.warranties,
        title: item.category_name,
        duration: item.duration,
        description: item.description,
      }))
    );
  }, [warrantiesData]);

  // Filter for search and selected tab
  const filteredWarranties = useMemo(() => {
    let list = flatWarranties;
    if (selectedTab !== 'all') {
      list = list.filter(w => w.group === selectedTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        w =>
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [flatWarranties, selectedTab, searchQuery]);

  const handleEdit = (id: string) => {
    // id is in form "group:detailId"
    const [groupKey, detailId] = id.split(':');
    if (!groupKey || !detailId) {
      return;
    }

    const group = (warrantiesData || []).find(g => g.warranties === groupKey);
    const item = group?.warranties_details?.find(
      (d: WarrantyDetail) => d.id === detailId
    );
    if (item) {
      const editData = {
        id,
        type: groupKey,
        category: item.category_name,
        description: item.description,
        duration: item.duration,
      };
      setEditingWarranty(editData);
      setIsAddWarrantyOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setWarrantyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (warrantyToDelete) {
      // Parse the composite ID
      const [groupKey, detailId] = warrantyToDelete.split(':');

      try {
        // Find the warranty group
        const existingGroup = warrantiesData.find(
          g => g.warranties === groupKey
        );
        if (!existingGroup) {
          throw new Error('Warranty group not found');
        }

        // Remove the specific warranty detail
        const updatedWarrantiesDetails =
          existingGroup.warranties_details.filter(
            (item: WarrantyDetail) => item.id !== detailId
          );

        // Find the UUID for this warranty group
        const warrantyGroup = warrantiesData.find(
          w => w.warranties === groupKey
        );
        if (!warrantyGroup?.uuid) {
          throw new Error('Warranty UUID not found');
        }
        let response: any = {};
        if (updatedWarrantiesDetails.length === 0) {
          // If no warranties left, delete the entire group
          try {
            response = await apiService.deleteCompanyWarranty(
              warrantyGroup.uuid
            );
          } catch (error) {
            if (handleAuthError(error)) return;
            throw error; // Re-throw to be caught by outer catch
          }
        } else {
          // Update the group with remaining warranties
          try {
            response = await apiService.updateCompanyWarranty(
              warrantyGroup.uuid,
              {
                warranties_details: updatedWarrantiesDetails,
              }
            );
          } catch (error) {
            if (handleAuthError(error)) return;
            throw error; // Re-throw to be caught by outer catch
          }
        }

        // Update local state
        setWarrantiesData(
          prevData =>
            prevData
              .map(group => {
                if (group.warranties === groupKey) {
                  return {
                    ...group,
                    warranties_details: updatedWarrantiesDetails,
                  };
                }
                return group;
              })
              .filter(group => group.warranties_details.length > 0) // Remove empty groups
        );

        // If the last warranty was deleted and the current tab is that group, reset to "all"
        if (updatedWarrantiesDetails.length === 0 && selectedTab === groupKey) {
          setSelectedTab('all');
        }
        if (response?.statusCode === 200) {
          showSuccessToast(
            response?.message || 'Warranty deleted successfully'
          );
        } else {
          showErrorToast(response?.message || 'Failed to delete warranty');
        }
      } catch (error) {
        if (handleAuthError(error)) return;
        // Handle error silently
      }
    }
    setIsDeleteModalOpen(false);
    setWarrantyToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWarrantyToDelete(null);
  };

  const handleAddWarranty = () => {
    setWarrantyToDelete(null);
    setEditingWarranty(null); // Ensure form resets for new warranty
    setIsAddWarrantyOpen(true);
  };

  const handleWarrantySubmit = async (data: WarrantyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingWarranty) {
        // Parse the composite ID
        const [groupKey, detailId] = editingWarranty.id.split(':');

        // Find the existing warranty group
        const existingGroup = warrantiesData.find(
          g => g.warranties === groupKey
        );
        if (!existingGroup) {
          throw new Error('Warranty group not found');
        }

        // Update the specific warranty detail
        const updatedWarrantiesDetails = existingGroup.warranties_details.map(
          (item: WarrantyDetail) => {
            if (item.id === detailId) {
              return {
                ...item,
                category_name: data.category,
                duration: data.duration,
                description: data.description,
              };
            }
            return item;
          }
        );

        // Find the UUID for this warranty group
        const warrantyGroup = warrantiesData.find(
          w => w.warranties === groupKey
        );
        if (!warrantyGroup?.uuid) {
          throw new Error('Warranty UUID not found');
        }
        const { type: name } = data;
        // Call API to update warranty
        let response: any = {};
        try {
          response = await apiService.updateCompanyWarranty(
            warrantyGroup.uuid,
            {
              name,
              warranties_details: updatedWarrantiesDetails,
            }
          );
        } catch (error) {
          if (handleAuthError(error)) return;
          throw error; // Re-throw to be caught by outer catch
        }

        // Update local state
        setWarrantiesData(prevData =>
          prevData.map(group => {
            if (group.warranties === groupKey) {
              return {
                ...group,
                warranties: name,
                warranties_details: updatedWarrantiesDetails,
              };
            }
            return group;
          })
        );
        if (selectedTab !== 'all' && selectedTab === groupKey) {
          setSelectedTab(name);
        }

        // Show success message for update
        if (response?.statusCode === 200) {
          showSuccessToast(
            response?.message || 'Warranty updated successfully'
          );
        }
      } else {
        // Generate new ID
        const newId = Date.now().toString();
        const newWarranty = {
          id: newId,
          category_name: data.category,
          duration: data.duration,
          description: data.description,
        };

        // Convert warranty type to lowercase for database storage
        const warrantyTypeLower = data.type.toLowerCase();

        // Check if warranty group already exists
        const existingGroupIndex = warrantiesData.findIndex(
          group => group.warranties === warrantyTypeLower
        );

        if (existingGroupIndex >= 0) {
          // Add to existing group
          const existingGroup = warrantiesData[existingGroupIndex];
          if (!existingGroup) {
            throw new Error('Existing group not found');
          }

          const updatedWarrantiesDetails = [
            ...existingGroup.warranties_details,
            newWarranty,
          ];

          // Call API to update existing warranty group
          let response: any = {};
          try {
            response = await apiService.updateCompanyWarranty(
              existingGroup.uuid || '',
              {
                warranties_details: updatedWarrantiesDetails,
              }
            );
          } catch (error) {
            if (handleAuthError(error)) return;
            throw error; // Re-throw to be caught by outer catch
          }

          // Update local state
          setWarrantiesData(prevData => {
            const newData = [...prevData];
            const existingGroup = newData[existingGroupIndex];
            if (existingGroup) {
              newData[existingGroupIndex] = {
                ...existingGroup,
                warranties_details: updatedWarrantiesDetails,
              };
            }
            return newData;
          });
          if (selectedTab !== 'all') {
            setSelectedTab(warrantyTypeLower);
          }

          // Show success message for adding to existing group
          if (response?.statusCode === 200) {
            showSuccessToast(
              response?.message || 'Warranty added successfully'
            );
          }
        } else {
          // Create new warranty group
          if (!companyId) return;

          let apiResponse;
          try {
            apiResponse = await apiService.createCompanyWarranty({
              company_id: companyId,
              name: warrantyTypeLower, // Save name in lowercase
              warranties_details: [newWarranty],
              status: 'ACTIVE',
            });
          } catch (error) {
            if (handleAuthError(error)) return;
            throw error; // Re-throw to be caught by outer catch
          }

          // Update local state with new group
          setWarrantiesData(prevData => [
            {
              warranties: warrantyTypeLower, // Store in lowercase for consistency
              warranties_details: [newWarranty],
              uuid: apiResponse.data?.uuid,
            },
            ...prevData,
          ]);
          if (selectedTab !== 'all') {
            setSelectedTab(warrantyTypeLower);
          }

          // Show success message for creating new group
          if (apiResponse?.data?.statusCode === 200) {
            showSuccessToast(
              apiResponse?.data?.message || 'Warranty created successfully'
            );
          }
        }
      }

      // Close the side sheet after successful submission
      setIsAddWarrantyOpen(false);
      setEditingWarranty(null);
      setIsSubmitting(false);
    } catch (error) {
      if (handleAuthError(error)) return;
      setIsSubmitting(false);
    }
  };

  const handleCancelAddWarranty = () => {
    setIsAddWarrantyOpen(false);
    setEditingWarranty(null);
  };

  // Show loading state
  if (isLoadingWarranties) {
    return <LoadingComponent variant='inline' size='md' text='' />;
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
        {canEditCompany && (
          <div className='flex flex-col items-start lg:items-center sm:flex-row gap-3 w-full lg:w-auto'>
            {/* Add Button */}
            <Button
              onClick={handleAddWarranty}
              className='btn-primary h-10 px-4 ml-auto'
            >
              Add Warranty
            </Button>
          </div>
        )}
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
                  options={computedTabs.map(tab => ({
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
                  {computedTabs.map((tab, index) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.value}
                      className={`w-full justify-start px-3 py-4 leading-none text-[var(--text-dark)] data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--primary)] rounded-lg font-medium ${
                        index !== computedTabs.length - 1
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
              {computedTabs.map(tab => (
                <TabsContent key={tab.id} value={tab.value} className='mt-0'>
                  <div className='space-y-4'>
                    {filteredWarranties.filter(
                      w => tab.value === 'all' || w.group === tab.value
                    ).length > 0 ? (
                      filteredWarranties
                        .filter(
                          w => tab.value === 'all' || w.group === tab.value
                        )
                        .map(warranty => (
                          <WarrantyList
                            key={warranty.id}
                            id={warranty.id}
                            title={warranty.title}
                            duration={warranty.duration}
                            description={warranty.description}
                            onEdit={canEditCompany ? handleEdit : undefined}
                            onDelete={canEditCompany ? handleDelete : undefined}
                          />
                        ))
                    ) : (
                      <NoDataFound
                        title='No warranties found'
                        description={
                          tab.value === 'all'
                            ? canEditCompany
                              ? 'Get started by adding your first warranty.'
                              : 'No warranties available for this company.'
                            : `No ${tab.label} warranties found.`
                        }
                        {...(canEditCompany && {
                          buttonText: 'Add Warranty',
                          onButtonClick: handleAddWarranty,
                        })}
                        showButton={canEditCompany}
                        height='h-auto'
                      />
                    )}
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
          key={editingWarranty?.id || 'new'}
          onSubmit={handleWarrantySubmit}
          onCancel={handleCancelAddWarranty}
          isLoading={isSubmitting}
          initialData={editingWarranty}
        />
      </SideSheet>
    </div>
  );
};
