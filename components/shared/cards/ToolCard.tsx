import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { ACTIONS, ROUTES } from '@/constants/common';
import { getUserPermissionsFromStorage } from '@/lib/utils';
import { IconDotsVertical } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import Dropdown from '../common/Dropdown';

interface ToolCardProps {
  image: string;
  name: string;
  brand: string;
  quantity: number;
  videoCount: number;
  menuOptions: {
    label: string;
    action: string;
    variant?: 'default' | 'destructive';
    icon: React.ComponentType<{
      size?: string | number;
      color?: string;
      variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
      className?: string;
    }>;
  }[];
  onDelete: () => void;
  onEdit?: () => void;
  onRetrieve?: () => void;
  uuid?: string; // Add uuid prop for navigation
}

export default function ToolCard({
  image,
  name,
  brand,
  quantity,
  videoCount,
  menuOptions,
  onDelete,
  onEdit,
  onRetrieve,
  uuid,
}: ToolCardProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;
  const canArchive = userPermissions?.tools?.archive;

  // Filter menu options based on permissions
  const filteredMenuOptions = menuOptions.filter(option => {
    if (option.action === ACTIONS.EDIT) {
      return canEdit;
    }
    if (option.action === ACTIONS.DELETE || option.action === ACTIONS.ARCHIVE) {
      return canArchive;
    }
    return true; // Show other actions by default
  });

  // Only show menu if there are any visible options
  const showMenu = filteredMenuOptions.length > 0;

  // Handle card click to navigate to tool detail
  const handleCardClick = () => {
    if (uuid) {
      router.push(`${ROUTES.TOOL_DETAIL}/${uuid}`);
    }
  };

  return (
    <div
      className='bg-[var(--card-background)] hover:shadow-card-hover rounded-2xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] relative transition-all duration-300 shadow-lg sm:shadow-none transform hover:scale-[1.02] sm:hover:scale-100 active:scale-[0.98] sm:active:scale-100 cursor-pointer'
      onClick={handleCardClick}
    >
      <div className='flex gap-3'>
        {/* Image */}
        <div className='w-[80px] h-[80px] rounded-[12px] overflow-hidden bg-[var(--border-light)] flex items-center justify-center flex-shrink-0'>
          <Image
            src={
              imgError
                ? '/images/tools-management/tools-img-1.png'
                : image || '/images/tools-management/tools-img-1.png'
            }
            alt={name}
            width={80}
            height={80}
            className='w-full h-full object-cover'
            onError={() => setImgError(true)}
          />
        </div>

        {/* Tool Info */}
        <div className='flex-1 min-w-0'>
          <h3 className='font-bold text-[var(--text)] truncate text-base leading-tight mb-1'>
            {name}
          </h3>
          <p className='text-xs text-[var(--text-secondary)] mb-1 font-medium'>
            {brand}
          </p>
          <div className='flex items-center gap-2'>
            <div className='flex flex-col'>
              <Label className='text-sm text-[var(--text-secondary)]'>
                Quantity
              </Label>
              <span className='text-sm text-[var(--text)] font-bold'>
                {quantity}
              </span>
            </div>
            <Badge className='bg-[var(--border-light)] text-[var(--text)] text-xs px-2 py-1 ml-auto'>
              {videoCount} Video{videoCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Menu */}
        {showMenu && (
          <div
            className='absolute top-2.5 right-2'
            onClick={e => e.stopPropagation()}
          >
            <Dropdown
              menuOptions={filteredMenuOptions}
              onAction={action => {
                if (action === ACTIONS.EDIT) {
                  if (onEdit) onEdit();
                }
                if (action === ACTIONS.DELETE || action === ACTIONS.ARCHIVE)
                  setShowDelete(true);
                if (action === ACTIONS.RETRIEVE) {
                  if (onRetrieve) onRetrieve();
                }
              }}
              trigger={
                <button className='h-8 w-8 p-0 flex items-center justify-center rounded-full'>
                  <IconDotsVertical
                    className='!w-6 !h-6'
                    strokeWidth={2}
                    color='var(--text-dark)'
                  />
                </button>
              }
              align='end'
            />
            <ConfirmDeleteModal
              open={showDelete}
              title={`Are you sure you want to archive "${name}"?`}
              subtitle={`This action cannot be undone.`}
              onCancel={() => setShowDelete(false)}
              onDelete={() => {
                setShowDelete(false);
                onDelete();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
