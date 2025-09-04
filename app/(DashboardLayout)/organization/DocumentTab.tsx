import { PortfolioBox } from '@/components/shared/common/PortfolioBox';
import SideSheet from '@/components/shared/common/SideSheet';
import { DocumentUploadForm } from '@/components/shared/forms/DocumentUploadForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const DocumentTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const documents = [
    {
      id: '1',
      title: 'Employee Handbook',
      type: 'PDF',
      size: '2.4 MB',
      lastModified: '2024-01-15',
      status: 'Active',
    },
    {
      id: '2',
      title: 'Safety Guidelines',
      type: 'DOCX',
      size: '1.8 MB',
      lastModified: '2024-01-10',
      status: 'Active',
    },
    {
      id: '3',
      title: 'Training Manual',
      type: 'PDF',
      size: '3.2 MB',
      lastModified: '2024-01-08',
      status: 'Active',
    },
    {
      id: '4',
      title: 'Company Policies',
      type: 'PDF',
      size: '1.5 MB',
      lastModified: '2024-01-05',
      status: 'Active',
    },
    {
      id: '5',
      title: 'Work Procedures',
      type: 'DOCX',
      size: '2.1 MB',
      lastModified: '2024-01-03',
      status: 'Active',
    },
    {
      id: '6',
      title: 'Quality Standards',
      type: 'PDF',
      size: '2.8 MB',
      lastModified: '2024-01-01',
      status: 'Active',
    },
  ];

  const handleView = () => {
    // Handle view action
  };

  const handleEdit = (id: string) => {
    // Handle edit action
  };

  const handleDelete = (id: string) => {
    // Handle delete action
  };

  const handleUploadDocument = async (data: {
    name: string;
    file: File | null;
  }) => {
    if (!data.file) return;

    setIsUploading(true);
    try {
      // TODO: Implement file upload logic here
      console.log('Uploading document:', data.name, data.file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close sheet after successful upload
      setIsUploadSheetOpen(false);
      // TODO: Refresh documents list or add new document to the list
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setIsUploadSheetOpen(false);
  };

  return (
    <div className='space-y-6'>
      <div className='flex md:flex-row flex-col items-center gap-4'>
        <div className='relative w-full sm:max-w-[360px]'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]' />
          <Input
            placeholder='Search here...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 w-full h-[42px] border-2 border-[var(--border-dark)] rounded-[30px]'
          />
        </div>
        <Button
          className='btn-primary ml-auto'
          onClick={() => setIsUploadSheetOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {documents.map(doc => (
          <PortfolioBox
            key={doc.id}
            id={doc.id}
            title={doc.title}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEditMenu={true}
            showDeleteOnly={true}
          />
        ))}
      </div>

      {/* Document Upload Side Sheet */}
      <SideSheet
        open={isUploadSheetOpen}
        onOpenChange={setIsUploadSheetOpen}
        title='Add Documents'
        size='600px'
      >
        <DocumentUploadForm
          onSubmit={handleUploadDocument}
          onCancel={handleCancelUpload}
          isSubmitting={isUploading}
        />
      </SideSheet>
    </div>
  );
};
