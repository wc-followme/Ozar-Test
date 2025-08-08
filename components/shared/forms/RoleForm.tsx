import { ROLE_MESSAGES } from '@/app/(DashboardLayout)/role-management/role-messages';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ACCESS_CONTROL_ACCORDIONS_DATA } from '@/constants/access-control';
import { roleIconOptions } from '@/constants/icon-options';
import type { UserPermissions } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CreateRoleFormData, createRoleSchema } from '@/lib/validations/role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormErrorMessage from '../common/FormErrorMessage';
import IconFieldWrapper from '../common/IconFieldWrapper';
import AccessControlAccordion from '../CompanyManagementAddUser';

interface RoleFormProps {
  initialValues?: Partial<CreateRoleFormData>;
  onSubmit: (data: CreateRoleFormData) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export const RoleForm: React.FC<RoleFormProps> = React.memo(
  ({ initialValues, onSubmit, isSubmitting, mode }) => {
    const router = useRouter();

    // Ensure iconOptions is always an array
    const safeIconOptions = Array.isArray(roleIconOptions)
      ? roleIconOptions.map(opt => ({
          ...opt,
          label: opt.value.charAt(0).toUpperCase() + opt.value.slice(1),
        }))
      : [];

    // Memoize default icon option to prevent unnecessary re-computations
    const defaultIconOption = useMemo(
      () => safeIconOptions[0] || null,
      [safeIconOptions]
    );

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<CreateRoleFormData>({
      resolver: yupResolver(createRoleSchema),
      defaultValues: {
        name: '',
        description: '',
        icon: defaultIconOption?.value ?? '',
        ...initialValues,
      },
    });

    // Reset form when initialValues change (for edit mode)
    useEffect(() => {
      if (initialValues) {
        reset({
          name: initialValues.name || '',
          description: initialValues.description || '',
          icon: (initialValues.icon || defaultIconOption?.value) ?? '',
        });
      }
    }, [initialValues, reset, defaultIconOption?.value]);

    // Memoize the cancel handler to prevent unnecessary re-renders
    const handleCancel = useCallback(() => {
      router.push('/role-management');
    }, [router]);

    // Memoize submit button content
    const submitButtonContent = useMemo(() => {
      if (isSubmitting) {
        return (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            {mode === 'edit'
              ? ROLE_MESSAGES.UPDATING_BUTTON
              : ROLE_MESSAGES.CREATING_BUTTON}
          </>
        );
      }
      return mode === 'edit'
        ? ROLE_MESSAGES.UPDATE_BUTTON
        : ROLE_MESSAGES.CREATE_BUTTON;
    }, [isSubmitting, mode]);

    // --- Permissions Accordions State ---
    // Map accordion indices to permission keys
    const accordionToPermissionMap = [
      'roles',
      'users',
      'companies',
      'categories',
      'trades',
      'services',
      'materials',
      'tools',
      'jobs',
    ];
    // Map stripe indices to permission keys for each accordion
    const stripeToPermissionMap = [
      ['view', 'edit', 'archive'], // roles
      ['view', 'create', 'customize', 'archive'], // users
      ['view', 'assign_user', 'archive'], // companies
      ['view', 'edit', 'archive'], // categories
      ['view', 'edit', 'archive'], // trades
      ['view', 'edit', 'archive'], // services
      ['view', 'edit', 'archive'], // materials
      ['view', 'edit', 'archive', 'history'], // tools
      ['view', 'edit', 'archive'], // jobs
    ];

    // Helper: Convert permissions object to accordions state
    const permissionsToAccordions = (permissions?: UserPermissions) => {
      return ACCESS_CONTROL_ACCORDIONS_DATA.map((acc, accordionIdx) => {
        const permissionKey = accordionToPermissionMap[accordionIdx];
        const perms = permissions?.[permissionKey as keyof UserPermissions] as
          | Record<string, boolean>
          | undefined;
        const updatedStripes = acc.stripes.map((_, stripeIdx) => {
          const permName = stripeToPermissionMap[accordionIdx]?.[stripeIdx];
          return perms && permName ? perms[permName] === true : false;
        });
        return {
          title: acc.title,
          stripes: updatedStripes,
        };
      });
    };

    // Helper: Convert accordions state to permissions object
    const accordionsToPermissions = (
      accordions: { stripes: boolean[] }[]
    ): UserPermissions => {
      const permissionsMap: UserPermissions = {
        roles: { view: false, edit: false, archive: false },
        users: { view: false, create: false, customize: false, archive: false },
        companies: { view: false, assign_user: false, archive: false },
        categories: { view: false, edit: false, archive: false },
        trades: { view: false, edit: false, archive: false },
        services: { view: false, edit: false, archive: false },
        materials: { view: false, edit: false, archive: false },
        tools: { view: false, edit: false, archive: false, history: false },
        jobs: { view: false, edit: false, archive: false },
      };
      accordions.forEach((accordion, accordionIdx) => {
        const permissionKey = accordionToPermissionMap[accordionIdx];
        if (
          permissionKey &&
          permissionsMap[permissionKey as keyof UserPermissions]
        ) {
          accordion.stripes.forEach((isChecked: boolean, stripeIdx: number) => {
            const permissionName =
              stripeToPermissionMap[accordionIdx]?.[stripeIdx];
            if (
              permissionName &&
              permissionsMap[permissionKey as keyof UserPermissions]
            ) {
              (permissionsMap[permissionKey as keyof UserPermissions] as any)[
                permissionName
              ] = isChecked;
            }
          });
        }
      });
      return permissionsMap;
    };

    // Accordions state
    const [accordions, setAccordions] = React.useState(() =>
      mode === 'edit' && initialValues && initialValues.permissions
        ? permissionsToAccordions(initialValues.permissions)
        : ACCESS_CONTROL_ACCORDIONS_DATA.map(acc => ({
            title: acc.title,
            stripes: acc.stripes.map(() => false),
          }))
    );
    // Open accordion index
    const [openAccordionIdx, setOpenAccordionIdx] = React.useState(0);

    // If initialValues.permissions changes (edit mode), update accordions
    React.useEffect(() => {
      if (mode === 'edit' && initialValues && initialValues.permissions) {
        setAccordions(permissionsToAccordions(initialValues.permissions));
      }
    }, [mode, initialValues?.permissions]);

    // Handler to toggle a switch
    const handleToggle = (accordionIdx: number, stripeIdx: number) => {
      setAccordions(prev =>
        prev.map((acc, aIdx) => {
          if (aIdx !== accordionIdx) return acc;
          const newStripes = [...acc.stripes];
          const isParent = stripeIdx === 0;
          const toggledValue = !newStripes[stripeIdx];

          if (isParent) {
            // If parent is toggled off, disable all children
            if (!toggledValue) {
              return {
                ...acc,
                stripes: newStripes.map(() => false),
              };
            } else {
              // If parent is toggled on, only enable parent (children stay as is)
              newStripes[0] = true;
              return {
                ...acc,
                stripes: newStripes,
              };
            }
          } else {
            // If child is toggled on, enable parent
            newStripes[stripeIdx] = toggledValue;
            if (toggledValue) {
              newStripes[0] = true;
            }
            return {
              ...acc,
              stripes: newStripes,
            };
          }
        })
      );
    };

    // Calculate access level for badge
    const calculateAccessLevel = (
      stripes: boolean[]
    ): 'Full Access' | 'Limited Access' | 'Restricted' => {
      if (stripes.length === 0) return 'Restricted';
      const enabledCount = stripes.filter(Boolean).length;
      if (enabledCount === 0) return 'Restricted';
      if (enabledCount === stripes.length) return 'Full Access';
      return 'Limited Access';
    };

    return (
      <Card className='flex flex-col gap-8 p-4 md:p-6 flex-1 w-full border-1 border-[var(--border-dark)] rounded-[20px] bg-[var(--card-background)]'>
        <form
          onSubmit={handleSubmit(data => {
            // Attach permissions to form data
            const permissions = accordionsToPermissions(accordions);
            onSubmit({ ...data, permissions });
          })}
          className='flex flex-col gap-8'
        >
          {/* Top row with input fields */}
          <div className='flex flex-col md:flex-row items-start gap-4 md:gap-6 w-full'>
            {/* Icon selector */}
            <Controller
              name='icon'
              control={control}
              render={({ field }) => (
                <IconFieldWrapper
                  label={ROLE_MESSAGES.ICON_LABEL}
                  value={field.value}
                  onChange={field.onChange}
                  iconOptions={safeIconOptions}
                  error={errors.icon?.message || ''}
                />
              )}
            />
            {/* Role Name input */}
            <div className='flex flex-col w-full md:w-[300px] items-start gap-2'>
              <Label className='field-label'>
                {ROLE_MESSAGES.ROLE_NAME_LABEL}
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={cn(
                      'h-12 border-2',
                      errors.name
                        ? 'border-[var(--warning)]'
                        : 'border-[var(--border-dark)]',
                      'focus:border-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                    )}
                    placeholder={ROLE_MESSAGES.ROLE_NAME_PLACEHOLDER}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.name && (
                <FormErrorMessage message={errors.name.message || ''} />
              )}
            </div>
            {/* Description input */}
            <div className='flex flex-col items-start gap-2 flex-1 w-full'>
              <Label className='field-label'>
                {ROLE_MESSAGES.DESCRIPTION_LABEL}
              </Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className={cn(
                      errors.description
                        ? '!border-[var(--warning)]'
                        : '!border-[var(--border-dark)]',
                      'input-field'
                    )}
                    placeholder={ROLE_MESSAGES.DESCRIPTION_PLACEHOLDER}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.description && (
                <FormErrorMessage message={errors.description.message || ''} />
              )}
            </div>
          </div>

          {/* Permissions Accordions */}
          <div className='flex flex-col gap-4 mt-2 md:mt-4'>
            {accordions.map((accordion, idx) => {
              const { title, stripes } = accordion;
              const accessLevel = calculateAccessLevel(stripes);
              return (
                <AccessControlAccordion
                  key={title + idx}
                  title={title}
                  badgeLabel={accessLevel}
                  stripes={
                    Array.isArray(stripes) &&
                    Array.isArray(ACCESS_CONTROL_ACCORDIONS_DATA[idx]?.stripes)
                      ? ACCESS_CONTROL_ACCORDIONS_DATA[idx]?.stripes.map(
                          (stripe, sIdx) => ({
                            title: stripe.title,
                            description: stripe.description,
                            checked:
                              typeof stripes?.[sIdx] === 'boolean'
                                ? stripes[sIdx]
                                : false,
                            onToggle: () => handleToggle(idx, sIdx),
                          })
                        )
                      : []
                  }
                  open={openAccordionIdx === idx}
                  onOpenChange={open => setOpenAccordionIdx(open ? idx : -1)}
                />
              );
            })}
          </div>

          {/* Footer with action buttons */}
          <div className='pt-4 flex items-center justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCancel}
              className='btn-secondary flex-1 sm:flex-none !px-4 md:!px-8 shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='btn-primary !px-4 md:!px-8 flex-1 sm:flex-none shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 rounded-full'
            >
              {submitButtonContent}
            </Button>
          </div>
        </form>
      </Card>
    );
  }
);

RoleForm.displayName = 'RoleForm';
