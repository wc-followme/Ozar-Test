'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { BoxCard } from '@/components/shared/cards/BoxCard';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, ROUTES } from '@/constants/common';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, getCompanyId } from '@/lib/utils';
import { Edit2 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FIVE_BOX_DATA } from './five-box-constants';
import { FIVE_BOX_MESSAGES } from './five-box-messages';
import { FiveBoxItem, MenuOption } from './five-box-types';

const FiveBoxSystem = () => {
  const router = useRouter();
  const { handleAuthError } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  const breadcrumbData: BreadcrumbItem[] = [
    { name: FIVE_BOX_MESSAGES.COMPANY_PROFILE, href: ROUTES.COMPANY_PROFILE },
    { name: FIVE_BOX_MESSAGES.PAGE_TITLE }, // current page
  ];

  const [boxData, setBoxData] = useState<FiveBoxItem[]>(FIVE_BOX_DATA);
  const [loading, setLoading] = useState(true);

  const getMenuOptions = (): MenuOption[] => {
    return [
      {
        label: FIVE_BOX_MESSAGES.EDIT_MENU,
        action: ACTIONS.EDIT,
        icon: Edit2,
      },
    ];
  };

  const handleEdit = (id: string) => {
    const box = boxData.find(b => b.id === id);
    if (box) {
      // Redirect to the dynamic page based on slug
      router.push(`${ROUTES.FIVE_BOX_SYSTEM}/${box.slug}`);
    }
  };

  const handleCardClick = (id: string) => {
    const box = boxData.find(b => b.id === id);
    if (box) {
      // Redirect to the dynamic page based on slug
      router.push(`${ROUTES.FIVE_BOX_SYSTEM}/${box.slug}`);
    }
  };

  const handleDelete = (id: string) => {
    setBoxData(prev => prev.filter(box => box.id !== id));
  };

  // Fetch box settings from API
  const fetchBoxSettings = useCallback(async () => {
    try {
      setLoading(true);

      // Get fresh company ID inside the function
      const currentCompanyId = getCompanyId();

      const response = await apiService.getBoxSettings({
        company_id: currentCompanyId,
      });

      if (response.statusCode === 200 && response?.data) {
        const { default_selected_json } = response?.data || {};

        // Update box data with API response
        const updatedBoxData = FIVE_BOX_DATA.map(box => {
          const apiBox = default_selected_json?.find(
            (apiBox: any) => apiBox.id === box.id
          );
          return {
            ...box,
            enabled: apiBox?.enabled ?? box.enabled,
          };
        });

        setBoxData(updatedBoxData);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      const errorMessage = extractApiErrorMessage(
        err,
        FIVE_BOX_MESSAGES.FETCH_ERROR
      );
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, showErrorToast]); // Removed companyUuid from dependencies

  // Update box settings via API
  const updateBoxSettings = async (updatedBoxData: FiveBoxItem[]) => {
    try {
      const default_selected_json = updatedBoxData.map(box => ({
        id: box.id,
        enabled: box.enabled,
      }));

      // Get fresh company ID inside the function
      const currentCompanyId = getCompanyId();

      const response = await apiService.updateBoxSettings({
        default_selected_json,
        company_id: currentCompanyId,
      });

      if (response.statusCode === 200) {
        showSuccessToast(response?.message ?? FIVE_BOX_MESSAGES.UPDATE_SUCCESS);
      } else {
        showErrorToast(response?.message ?? FIVE_BOX_MESSAGES.UPDATE_ERROR);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      const errorMessage = extractApiErrorMessage(
        err,
        FIVE_BOX_MESSAGES.UPDATE_ERROR
      );
      showErrorToast(errorMessage);
    }
  };

  // Handle company changes
  const refetchBoxSettings = useCallback(() => {
    setBoxData(FIVE_BOX_DATA);
    fetchBoxSettings();
  }, [fetchBoxSettings]);

  useCompanyChange(refetchBoxSettings);

  // Initial fetch handled by useCompanyChange hook

  const handleToggle = async (id: string) => {
    const updatedBoxData = boxData.map(box =>
      box.id === id ? { ...box, enabled: !box.enabled } : box
    );

    setBoxData(updatedBoxData);

    // Update via API
    await updateBoxSettings(updatedBoxData);
  };

  if (loading) {
    return (
      <section className=''>
        <div className='mb-6'>
          <Breadcrumb items={breadcrumbData} />
        </div>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>{FIVE_BOX_MESSAGES.LOADING}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className=''>
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbData} />
      </div>

      {/* 5-box System Grid */}
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl w-full gap-3 xl:gap-6'>
        {boxData.map(
          ({ id, number, color, textColor, title, description, enabled }) => (
            <BoxCard
              key={id}
              id={id}
              number={number}
              color={color}
              textColor={textColor}
              title={title}
              description={description}
              enabled={enabled}
              menuOptions={getMenuOptions()}
              onEdit={() => handleEdit(id)}
              onDelete={() => handleDelete(id)}
              onToggle={() => handleToggle(id)}
              onClick={() => handleCardClick(id)}
              showMenu={id !== '04' && id !== '05'} // Hide menu for Category (04) and Estimation (05)
            />
          )
        )}
      </div>
    </section>
  );
};

export default FiveBoxSystem;
