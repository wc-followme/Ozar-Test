'use client';

export const PortfolioTab = () => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
        Our Portfolio
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[
          {
            title: 'Modern Kitchen Renovation',
            type: 'Interior',
            year: '2024',
          },
          { title: 'Luxury Bathroom Design', type: 'Interior', year: '2023' },
          { title: 'Custom Home Build', type: 'Full Home', year: '2023' },
          { title: 'Outdoor Kitchen Project', type: 'Exterior', year: '2023' },
          { title: 'Office Renovation', type: 'Commercial', year: '2022' },
          { title: 'Basement Finishing', type: 'Interior', year: '2022' },
          { title: 'Deck Construction', type: 'Exterior', year: '2022' },
          { title: 'Garage Addition', type: 'Addition', year: '2021' },
        ].map((project, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-[var(--border-dark)] overflow-hidden'
          >
            <div className='h-48 bg-gray-200 flex items-center justify-center'>
              <span className='text-[var(--text-secondary)]'>
                Project Image
              </span>
            </div>
            <div className='p-4'>
              <h4 className='font-semibold text-[var(--text-dark)] mb-2'>
                {project.title}
              </h4>
              <div className='flex justify-between text-sm text-[var(--text-secondary)]'>
                <span>{project.type}</span>
                <span>{project.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
