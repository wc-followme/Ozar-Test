'use client';

import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { APP_CONFIG } from '@/constants/common';
import { apiService, FetchUsersResponse, User } from '@/lib/api';
import { getCompanyId } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserCard } from '../shared/cards/UserCard';

interface TeamTabProps {
  companyId?: string | undefined;
}

export const TeamTab = ({ companyId }: TeamTabProps) => {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch team members with lazy loading
  const fetchTeamMembers = useCallback(
    async (targetPage = 1, append = false) => {
      try {
        if (targetPage === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        // Add loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        const currentCompanyId = companyId || getCompanyId();

        const response: FetchUsersResponse = await apiService.fetchUsers({
          page: targetPage,
          limit: 12, // Load 12 users per page for grid layout
          status: 'ACTIVE',
          ...(currentCompanyId ? { company_id: currentCompanyId } : {}),
        });

        const newUsers = response.data;

        setTeamMembers(prev => {
          if (append) {
            return [...prev, ...newUsers];
          }
          return newUsers;
        });

        // Check if there are more users to load
        setHasMore(newUsers.length === 12);
        setPage(targetPage);
      } catch (err) {
        setError('Failed to load team members');
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [companyId]
  );

  // Initial load
  useEffect(() => {
    fetchTeamMembers(1, false);
  }, [fetchTeamMembers]);

  // Load more function for lazy loading
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchTeamMembers(page + 1, true);
    }
  }, [fetchTeamMembers, page, hasMore, isLoadingMore]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  // Show loading state
  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-center min-h-[200px]'>
          <LoadingComponent variant='inline' size='md' text='' />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='space-y-6'>
        <div className='text-center text-red-500 p-4'>{error}</div>
      </div>
    );
  }

  // Show empty state
  if (teamMembers.length === 0) {
    return (
      <div className='space-y-6'>
        <NoDataFound
          title=''
          description='No team members found'
          buttonText=''
          showButton={false}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-4 sm:gap-3 xl:gap-6'>
        {teamMembers.map((member, index) => {
          const {
            uuid,
            name,
            role,
            phone_number,
            email,
            profile_picture_url,
            status,
          } = member;

          // Construct full image URL with CDN prefix
          const imageUrl = profile_picture_url
            ? `${APP_CONFIG.CDN_URL}${profile_picture_url}`
            : '';

          return (
            <UserCard
              key={uuid || index}
              name={name}
              role={role?.name || 'Employee'}
              phone={phone_number}
              email={email}
              image={imageUrl}
              status={status === 'ACTIVE'}
              onToggle={() => {}}
              menuOptions={[]}
              userUuid={uuid}
              hideMenu={true}
              hideToggle={true}
            />
          );
        })}
      </div>

      {/* Infinite scroll trigger element */}
      {hasMore && (
        <div ref={loadMoreRef} className='flex justify-center pt-4'>
          {isLoadingMore && (
            <div className='text-center py-4'>
              <LoadingComponent variant='inline' size='md' text='' />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
