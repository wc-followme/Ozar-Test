'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface Material {
  id: string;
  name: string;
  category: string;
  dimensions: string;
  required: number;
  available: number;
  checked: boolean;
}

interface Service {
  id: string;
  name: string;
  materials: Material[];
}

interface Job {
  id: string;
  dateRange: string;
  jobName: string;
  services: Service[];
}

interface MaterialChecklistComponentProps {
  className?: string;
}

export const MaterialChecklistComponent: React.FC<
  MaterialChecklistComponentProps
> = ({ className }) => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job-1',
      dateRange: '1/12/2024 - 2/12/2024',
      jobName: 'Job Name Here',
      services: [
        {
          id: 'service-1',
          name: 'Service Name',
          materials: [
            {
              id: 'material-1',
              name: 'Stylish Tile for Bathroom',
              category: 'Ceramics',
              dimensions: '60W x 30H cm',
              required: 5,
              available: 4,
              checked: true,
            },
            {
              id: 'material-2',
              name: 'Nail Box',
              category: 'Nailery',
              dimensions: 'Standard Size',
              required: 5,
              available: 100,
              checked: false,
            },
            {
              id: 'material-3',
              name: 'Paint Can',
              category: 'Paints',
              dimensions: '5L Container',
              required: 3,
              available: 2,
              checked: false,
            },
          ],
        },
      ],
    },
    {
      id: 'job-2',
      dateRange: '3/12/2024 - 4/12/2024',
      jobName: 'Job Name Here',
      services: [
        {
          id: 'service-2',
          name: 'Service Name',
          materials: [
            {
              id: 'material-4',
              name: 'Wooden Planks',
              category: 'Lumber',
              dimensions: '2m x 20cm x 5cm',
              required: 10,
              available: 8,
              checked: false,
            },
            {
              id: 'material-5',
              name: 'Screw Pack',
              category: 'Hardware',
              dimensions: 'M6 x 50mm',
              required: 50,
              available: 75,
              checked: false,
            },
          ],
        },
      ],
    },
    {
      id: 'job-3',
      dateRange: '5/12/2024 - 6/12/2024',
      jobName: 'Job Name Here',
      services: [
        {
          id: 'service-3',
          name: 'Service Name',
          materials: [
            {
              id: 'material-6',
              name: 'Electrical Wire',
              category: 'Electrical',
              dimensions: '2.5mm²',
              required: 100,
              available: 120,
              checked: false,
            },
          ],
        },
        {
          id: 'service-4',
          name: 'Service Name',
          materials: [
            {
              id: 'material-7',
              name: 'Concrete Mix',
              category: 'Construction',
              dimensions: '25kg Bag',
              required: 8,
              available: 6,
              checked: false,
            },
          ],
        },
      ],
    },
  ]);

  const handleMaterialToggle = (
    jobId: string,
    serviceId: string,
    materialId: string
  ) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId
          ? {
              ...job,
              services: job.services.map(service =>
                service.id === serviceId
                  ? {
                      ...service,
                      materials: service.materials.map(material =>
                        material.id === materialId
                          ? { ...material, checked: !material.checked }
                          : material
                      ),
                    }
                  : service
              ),
            }
          : job
      )
    );
  };

  const isQuantityInsufficient = (required: number, available: number) => {
    return required > available;
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {jobs.map(({ id: jobId, dateRange, jobName, services }) => (
        <div key={jobId} className='bg-[var(--background)] p-3 rounded-[10px]'>
          {/* Job Header */}
          <div className='space-y-1 mb-1'>
            <h4 className='text-[var(--text-secondary)] uppercase font-normal text-[12px] leading-[100%] tracking-[0%] mb-2'>
              {dateRange}
            </h4>
            <div className='flex items-center gap-2 w-full'>
              <div className='flex-1 mr-auto'>
                <p className='text-[var(--text-dark)] font-medium text-[14px] leading-[22px] tracking-[0px]'>
                  {jobName}
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          {services.map(
            ({ id: serviceId, name: serviceName, materials }, serviceIndex) => (
              <div
                key={serviceId}
                className={`space-y-4 ${serviceIndex > 0 ? 'mt-4' : ''}`}
              >
                <h3 className='text-[var(--text-dark)] font-medium text-[16px] leading-[100%] tracking-[0%]'>
                  {serviceName}
                </h3>

                {/* Materials */}
                <div className='flex flex-col gap-3'>
                  {materials.map(
                    ({
                      id: materialId,
                      name: materialName,
                      category,
                      dimensions,
                      required,
                      available,
                      checked,
                    }) => (
                      <div
                        key={materialId}
                        className={`bg-[var(--white-background)] rounded-lg p-3 border ${
                          isQuantityInsufficient(required, available)
                            ? 'border-[#D4323226]'
                            : 'border-transparent'
                        }`}
                      >
                        <Label className='flex flex-col items-start gap-3 cursor-pointer'>
                          <div className='flex items-start gap-3'>
                            <Checkbox
                              id={materialId}
                              className={`
                          rounded-[6px]
                          border-2
                          border-[#BFBFBF]
                          data-[state=checked]:bg-[--primary]
                          data-[state=checked]:border-[var(--primary)]
                          data-[state=checked]:text-white
                          text-[var(--text-dark)]
                          w-6 h-6
                          flex items-center justify-center -mt-0.4
                          ${checked ? 'bg-blue-600 border-blue-600' : ''}
                        `}
                              checked={checked}
                              onCheckedChange={() =>
                                handleMaterialToggle(
                                  jobId,
                                  serviceId,
                                  materialId
                                )
                              }
                            />
                            <div className='flex-1 space-y-1'>
                              <p
                                className={`text-[14px] font-normal mb-2 text-[var(--text-dark)] ${
                                  checked ? ' line-through' : ''
                                }`}
                              >
                                {materialName}
                              </p>
                              <p
                                className={`text-xs font-normal text-[var(--text-secondary)] ${
                                  checked ? 'line-through' : ''
                                }`}
                              >
                                {category} • {dimensions}
                              </p>
                            </div>
                          </div>

                          <p
                            className={`text-[14px] font-normal w-full text-right border-t border-[var(--border-dark)] pt-2 ${
                              isQuantityInsufficient(required, available)
                                ? 'text-[var(--warning)]'
                                : 'text-[var(--text-dark)]'
                            } ${checked ? 'line-through' : ''}`}
                          >
                            {required.toString().padStart(2, '0')} Required /{' '}
                            {available.toString().padStart(2, '0')} Available
                          </p>
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};
