import { Button } from '@/components/ui/button';
import { Download, Eye, FileText } from 'lucide-react';

export const DocumentTab = () => {
  const documents = [
    {
      id: 1,
      title: 'Employee Handbook',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2024-01-15',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Safety Guidelines',
      type: 'DOCX',
      size: '1.8 MB',
      lastModified: '2024-01-10',
      status: 'Active',
    },
    {
      id: 3,
      title: 'Training Manual',
      type: 'PDF',
      size: '3.2 MB',
      lastModified: '2024-01-08',
      status: 'Active',
    },
    {
      id: 4,
      title: 'Company Policies',
      type: 'PDF',
      size: '1.5 MB',
      lastModified: '2024-01-05',
      status: 'Active',
    },
    {
      id: 5,
      title: 'Work Procedures',
      type: 'DOCX',
      size: '2.1 MB',
      lastModified: '2024-01-03',
      status: 'Active',
    },
    {
      id: 6,
      title: 'Quality Standards',
      type: 'PDF',
      size: '2.8 MB',
      lastModified: '2024-01-01',
      status: 'Active',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold text-[var(--text-dark)]'>
          Documents
        </h2>
        <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
          Upload Document
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {documents.map(doc => (
          <div
            key={doc.id}
            className='bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <FileText className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-medium text-[var(--text-dark)] text-sm'>
                    {doc.title}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
            </div>

            <div className='space-y-2 mb-4'>
              <p className='text-xs text-gray-500'>
                Last modified: {doc.lastModified}
              </p>
              <span className='inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full'>
                {doc.status}
              </span>
            </div>

            <div className='flex gap-2'>
              <Button variant='outline' size='sm' className='flex-1'>
                <Eye className='w-4 h-4 mr-2' />
                View
              </Button>
              <Button variant='outline' size='sm' className='flex-1'>
                <Download className='w-4 h-4 mr-2' />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
