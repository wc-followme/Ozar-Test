'use client';

import { Button } from '@/components/ui/button';
import { IconMapPin } from '@tabler/icons-react';
import { ArrowDown, ArrowUp } from 'iconsax-react';
import { useEffect, useState } from 'react';
import SelectField from '../common/SelectField';

interface PunchInFormProps {
  onCancel: () => void;
  onSubmit: (data: PunchInData) => void;
}

interface PunchInData {
  jobId: string;
  latitude: number;
  longitude: number;
  address: string;
  punchInTime: string;
  punchOutTime: string;
}

export const PunchInForm = ({ onCancel, onSubmit }: PunchInFormProps) => {
  const [formData, setFormData] = useState<PunchInData>({
    jobId: '',
    latitude: 0,
    longitude: 0,
    address: '1234 Maple Street, Springfield, IL 62704',
    punchInTime: '10:39:28 AM',
    punchOutTime: '10:40:13 AM',
  });

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [mapUrl, setMapUrl] = useState<string>('');

  // Sample job options
  const jobOptions = [
    { value: '1', label: 'General Shift' },
    { value: '2', label: 'Night Shift' },
    { value: '3', label: 'Weekend Shift' },
    { value: '4', label: 'Overtime Shift' },
  ];

  // Get current location and update map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setFormData(prev => ({ ...prev, latitude, longitude }));

          // Google Maps embed URL (no API key needed for simple embedding)
          const url = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=16&output=embed`;
          setMapUrl(url);

          // Get full address from coordinates using reverse geocoding
          // Using OpenStreetMap Nominatim API (free, no API key required)
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
            .then(response => response.json())
            .then(data => {
              if (data.display_name) {
                const fullAddress = data.display_name;
                setFormData(prev => ({ ...prev, address: fullAddress }));
                console.log('Full address obtained:', fullAddress);
              }
            })
            .catch(error => {
              console.log('Could not get address from coordinates:', error);
              // Keep default address if reverse geocoding fails
            });
        },
        error => {
          console.error('Error getting location:', error);
          // Fallback to default location
          const defaultLat = 37.7749;
          const defaultLng = -122.4194;
          setCurrentLocation({ latitude: defaultLat, longitude: defaultLng });
          setFormData(prev => ({
            ...prev,
            latitude: defaultLat,
            longitude: defaultLng,
          }));

          // Generate fallback map URL
          const url = `https://www.google.com/maps?q=${defaultLat},${defaultLng}&hl=en&z=15&output=embed`;
          setMapUrl(url);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    }
  }, []);

  const handleJobChange = (jobId: string) => {
    setFormData(prev => ({ ...prev, jobId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='space-y-6'>
      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Job Selection */}
        <SelectField
          label='Job'
          value={formData.jobId}
          onValueChange={handleJobChange}
          options={jobOptions}
          placeholder='Select Job'
        />

        {/* Map Display */}
        <div className='space-y-2'>
          <label className='field-label'>Current Location</label>
          <div className='w-full h-[400px] bg-gray-100 rounded-lg border-2 border-[var(--border-light)] overflow-hidden relative'>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Current Location Map'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-gray-200'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center'>
                    <div className='w-4 h-4 bg-white rounded-full'></div>
                  </div>
                  <p className='text-sm text-gray-600'>
                    Getting your current location...
                  </p>
                  <p className='text-xs text-gray-500'>
                    Please allow location access
                  </p>
                </div>
              </div>
            )}

            {/* Location Status Overlay */}
            {currentLocation && formData.address && (
              <div className='absolute top-2 right-2 bg-[var(--white-background)] bg-opacity-90 rounded-lg px-3 py-2 shadow-md max-w-[240px]'>
                <div className='text-xs text-[var(--text-dark)] space-y-1'>
                  <div className='font-medium flex items-center gap-2'>
                    <IconMapPin size={16} /> Current Address
                  </div>
                  <div className='break-words'>{formData.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Display */}
        <div className='space-y-1'>
          <label className='field-label'>Address</label>
          <p className='text-[var(--text-secondary)] text-base'>
            {formData.address}
          </p>
        </div>

        {/* Time Records */}
        <div className='flex items-start gap-6'>
          <div className='space-y-1'>
            <label className='field-label'>In Time</label>
            <p className='text-[var(--text-dark)] text-sm flex items-center gap-2'>
              {' '}
              <ArrowDown size='20' color='#90C91D' className='rotate-45' />
              10:39:28 AM
            </p>
          </div>
          <div className='space-y-1'>
            <label className='field-label'>Out Time</label>
            <p className='text-[var(--text-dark)] text-sm flex items-center gap-1'>
              {' '}
              <ArrowUp size='20' color='var(--warning)' className='rotate-45' />
              10:40:13 AM
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='btn-secondary'
          >
            Cancel
          </Button>
          <Button type='submit' className='btn-primary'>
            Punch In
          </Button>
        </div>
      </form>
    </div>
  );
};
