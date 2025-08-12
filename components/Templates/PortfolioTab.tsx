'use client';

import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import { PortfolioBox } from '@/components/shared/common/PortfolioBox';
import { portfolioProjects } from '@/constants/dummy-data';
import { useState } from 'react';

export const PortfolioTab = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    console.log('Edit portfolio project:', id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      console.log('Deleting portfolio project:', projectToDelete);
      // Add your delete logic here
      // You can filter out the project from the list or make an API call
    }
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
        {portfolioProjects.map(project => (
          <PortfolioBox
            key={project.id}
            id={project.id}
            title={project.title}
            type={project.type}
            year={project.year}
            {...(project.image && { image: project.image })}
            imageCount={project.imageCount}
            videoCount={project.videoCount}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={cancelDelete}
        onDelete={confirmDelete}
        title='Delete Portfolio Project'
        subtitle='Are you sure you want to delete this portfolio project? This action cannot be undone.'
        archiveButtonText='Delete'
      />
    </div>
  );
};
