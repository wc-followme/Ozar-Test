'use client';

import MultiSelect from '@/components/shared/common/MultiSelect';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SubContractor {
  id: string;
  name: string;
  companyName: string;
  image?: string;
}

interface OfferBidProps {
  onClose: () => void;
  onRequestBid: (selectedSubContractors: SubContractor[]) => void;
}

// Mock data for sub-contractors - replace with actual data source
const mockSubContractors: SubContractor[] = [
  {
    id: '1',
    name: 'Esther Howard',
    companyName: 'Howard Construction',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '2',
    name: 'Jenny Wilson',
    companyName: 'Wilson Builders',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '3',
    name: 'John Deo',
    companyName: 'Deo Contractors',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '4',
    name: 'Max Henry',
    companyName: 'Henry & Sons',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '5',
    name: 'Mark Morris',
    companyName: 'Morris Construction',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '6',
    name: 'Peter Mark',
    companyName: 'Mark Builders',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '7',
    name: 'Joy Stephan',
    companyName: 'Stephan Contractors',
    image: '/images/placeholder-user.jpg',
  },
  {
    id: '8',
    name: 'Ethane Hunt',
    companyName: 'Hunt Construction',
    image: '/images/placeholder-user.jpg',
  },
];

export default function OfferBid({ onClose, onRequestBid }: OfferBidProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleRequestBid = (selectedIds: string[]) => {
    const selectedSubContractors = mockSubContractors.filter(sub =>
      selectedIds.includes(sub.id)
    );
    onRequestBid(selectedSubContractors);
  };

  const handleMultiSelectChange = (selectedIds: string[]) => {
    // This function handles the MultiSelect onChange
    setSelectedIds(selectedIds);
    console.log('Selected IDs:', selectedIds);
  };

  return (
    <div className=''>
      {/* Content */}
      <div className='flex-1'>
        <div className='space-y-2'>
          <label className='field-label'>Sub-Contractor</label>

          <MultiSelect
            options={mockSubContractors.map(sub => ({
              value: sub.id,
              label: sub.name,
              subLabel: sub.companyName,
              image: sub.image,
            }))}
            value={selectedIds}
            placeholder='Select sub-contractors...'
            onChange={handleMultiSelectChange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className='flex items-center gap-4 mt-4'>
        <Button variant='outline' onClick={onClose} className='btn-secondary'>
          Cancel
        </Button>
        <Button
          className='btn-primary px-6 py-2'
          onClick={() => {
            if (selectedIds.length > 0) {
              const selectedSubContractors = mockSubContractors.filter(sub =>
                selectedIds.includes(sub.id)
              );
              onRequestBid(selectedSubContractors);
            }
            onClose();
          }}
          disabled={selectedIds.length === 0}
        >
          Request Bid
        </Button>
      </div>
    </div>
  );
}
