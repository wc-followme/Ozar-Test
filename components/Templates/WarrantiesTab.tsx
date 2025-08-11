'use client';

export const WarrantiesTab = () => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-[var(--text-dark)]'>
        Warranties & Guarantees
      </h3>
      <div className='space-y-4'>
        {[
          {
            title: 'Workmanship Warranty',
            duration: '2 Years',
            description: 'Covers all workmanship and installation quality.',
          },
          {
            title: 'Materials Warranty',
            duration: '5 Years',
            description: 'Covers defects in materials used in construction.',
          },
          {
            title: 'Structural Warranty',
            duration: '10 Years',
            description: 'Covers structural integrity of the building.',
          },
        ].map((warranty, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-[var(--border-dark)] p-4'
          >
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-semibold text-[var(--text-dark)]'>
                {warranty.title}
              </h4>
              <span className='bg-[var(--primary)] text-white px-3 py-1 rounded-full text-sm font-medium'>
                {warranty.duration}
              </span>
            </div>
            <p className='text-[var(--text-secondary)] text-sm'>
              {warranty.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
