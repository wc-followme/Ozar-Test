'use client';

import { UserCard } from '../shared/cards/UserCard';

interface TeamMember {
  name: string;
  role: string;
  phone: string;
  email: string;
  image?: string;
}

export const TeamTab = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Alex Johnson',
      role: 'Contractor',
      phone: '(555) 123-4567',
      email: 'alex.johnson@example.com',
    },
    {
      name: 'Maria Smith',
      role: 'Project Manager',
      phone: '(555) 123-4567',
      email: 'maria.smith@example.com',
    },
    {
      name: 'David Brown',
      role: 'Estimator',
      phone: '(555) 123-4567',
      email: 'david.brown@example.com',
    },
    {
      name: 'Sophia Davis',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'sophia.davis@example.com',
    },
    {
      name: 'James Wilson',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'james.wilson@example.com',
    },
    {
      name: 'Olivia Garcia',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'olivia.garcia@example.com',
    },
    {
      name: 'Liam Martinez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'liam.martinez@example.com',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'emma.rodriguez@example.com',
    },
    {
      name: 'Noah Hernandez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'noah.hernandez@example.com',
    },
    {
      name: 'Ava Lopez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'ava.lopez@example.com',
    },
    {
      name: 'Ethan Gonzalez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'ethan.gonzalez@example.com',
    },
    {
      name: 'Isabella Perez',
      role: 'Employee',
      phone: '(555) 123-4567',
      email: 'isabella.perez@example.com',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-4 sm:gap-3 xl:gap-6'>
        {teamMembers.map((member, index) => (
          <UserCard
            key={index}
            name={member.name}
            role={member.role}
            phone={member.phone}
            email={member.email}
            image={member.image || ''}
            status={true}
            onToggle={() => {}}
            menuOptions={[]}
            userUuid={`team-${index}`}
            hideMenu={true}
            hideToggle={true}
          />
        ))}
      </div>
    </div>
  );
};
