'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  checked: boolean;
}

interface Service {
  id: string;
  name: string;
  tools: Tool[];
}

interface Job {
  id: string;
  dateRange: string;
  jobName: string;
  services: Service[];
}

interface TodoChecklistComponentProps {
  className?: string;
}

export const TodoChecklistComponent: React.FC<TodoChecklistComponentProps> = ({
  className,
}) => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job-1',
      dateRange: '1/12/2024 - 2/12/2024',
      jobName: 'Sunnyvale Cottage',
      services: [
        {
          id: 'service-1',
          name: 'Install Shower',
          tools: [
            { id: 'tool-1', name: 'Tools Name', checked: true },
            { id: 'tool-2', name: 'Tools Name', checked: true },
            { id: 'tool-3', name: 'Tools Name', checked: true },
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
          tools: [
            { id: 'tool-4', name: 'Tools Name', checked: false },
            { id: 'tool-5', name: 'Tools Name', checked: false },
            { id: 'tool-6', name: 'Tools Name', checked: false },
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
          tools: [
            { id: 'tool-7', name: 'Tools Name', checked: false },
            { id: 'tool-8', name: 'Tools Name', checked: false },
            { id: 'tool-9', name: 'Tools Name', checked: false },
          ],
        },
        {
          id: 'service-4',
          name: 'Service Name',
          tools: [
            { id: 'tool-10', name: 'Tools Name', checked: false },
            { id: 'tool-11', name: 'Tools Name', checked: false },
            { id: 'tool-12', name: 'Tools Name', checked: false },
          ],
        },
      ],
    },
  ]);

  const handleToolToggle = (
    jobId: string,
    serviceId: string,
    toolId: string
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
                      tools: service.tools.map(tool =>
                        tool.id === toolId
                          ? { ...tool, checked: !tool.checked }
                          : tool
                      ),
                    }
                  : service
              ),
            }
          : job
      )
    );
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {jobs.map(job => (
        <div key={job.id} className='bg-[var(--background)] p-3 rounded-[10px]'>
          {/* Job Header */}
          <div className='space-y-2'>
            <h4 className='text-[var(--text-secondary)] uppercase font-medium text-[12px] leading-[100%] tracking-[0%]'>
              {job.dateRange}
            </h4>
            <div className='flex items-center gap-2 w-full'>
              <div className='flex-1 mr-auto'>
                <p className='text-[var(--text-dark)] font-medium text-[14px] leading-[22px] tracking-[0px] mb-1'>
                  {job.jobName}
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          {job.services.map((service, serviceIndex) => (
            <div
              key={service.id}
              className={`space-y-4 ${
                job.services.length === 1 ? 'mt-1' : 'mt-4'
              }`}
            >
              <h3 className='text-[var(--text-dark)] font-medium text-base leading-[100%] tracking-[0%]'>
                {service.name}
              </h3>

              {/* Tools */}
              <div className='flex flex-col gap-4'>
                {service.tools.map((tool, index) => (
                  <Label
                    key={tool.id}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <Checkbox
                      id={tool.id}
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
                        ${tool.checked ? 'bg-blue-600 border-blue-600' : ''}
                      `}
                      checked={tool.checked}
                      onCheckedChange={() =>
                        handleToolToggle(job.id, service.id, tool.id)
                      }
                    />
                    <div className='flex-1'>
                      <p
                        className={`text-sm font-semibold ${
                          tool.checked
                            ? 'text-[var(--text-dark)] line-through'
                            : 'text-[var(--text-dark)]'
                        }`}
                      >
                        {tool.name}
                      </p>
                    </div>
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
