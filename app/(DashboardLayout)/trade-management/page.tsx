'use client';
import { InfoCard } from '@/components/shared/cards/InfoCard';
import { ConfirmDeleteModal } from '@/components/shared/common/ConfirmDeleteModal';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import TradeForm from '@/components/shared/forms/TradeForm';
import TradeCardSkeleton from '@/components/shared/skeleton/TradeCardSkeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';

import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Trash } from 'iconsax-react';
import React, { useCallback, useEffect, useState } from 'react';
import { TRADE_MESSAGES } from './trade-messages';
import { Trade } from './trade-types';

const menuOptions: {
  label: string;
  action: string;
  icon: React.ElementType;
  variant?: 'default' | 'destructive';
}[] = [
  {
    label: TRADE_MESSAGES.EDIT_MENU,
    action: ACTIONS.EDIT,
    icon: Edit2,
    variant: 'default',
  },
  {
    label: TRADE_MESSAGES.DELETE_MENU,
    action: ACTIONS.DELETE,
    icon: Trash,
    variant: 'destructive',
  },
];

export default function TradeManagementPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGINATION.TRADES_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [deleteTradeName, setDeleteTradeName] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingTradeUuid, setEditingTradeUuid] = useState<string | undefined>(
    undefined
  );
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for trades
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.trades?.edit;

  const fetchTrades = useCallback(
    async (targetPage = 1, append = false) => {
      setLoading(true);
      try {
        const response = await apiService.fetchTrades({
          page: targetPage,
          limit,
          name: search,
        });

        // Handle different possible response structures
        let newTrades: Trade[] = [];
        let total = 0;
        const { data } = response;

        if (data) {
          // If data is directly an array
          if (Array.isArray(data)) {
            newTrades = data;
            total = data.length; // Fallback if no total provided
          }
          // If data is nested under data.data
          else if (data.data && Array.isArray(data.data)) {
            const { data: nestedData, total: totalCount } = data;
            newTrades = nestedData;
            total = totalCount || nestedData.length;
          }
          // If data is just the response itself (fallback)
          else if (Array.isArray(data)) {
            newTrades = data;
            total = data.length;
          }
        }

        setTrades(prev => {
          if (append) {
            // Filter out duplicates when appending to prevent duplicate keys
            const existingUuids = new Set(prev.map(trade => trade.uuid));
            const uniqueNewTrades = newTrades.filter(
              trade => !existingUuids.has(trade.uuid)
            );
            return [...prev, ...uniqueNewTrades];
          } else {
            return newTrades;
          }
        });

        setPage(targetPage);
        setHasMore(targetPage * limit < total);
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(err, TRADE_MESSAGES.FETCH_ERROR);
        showErrorToast(message);
        if (!append) setTrades([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [limit, search, handleAuthError, showErrorToast]
  );

  // Fetch first page of trades
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTrades([]);
    fetchTrades(1, false);
  }, [fetchTrades]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTrades(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, fetchTrades, page]);

  const handleMenuAction = (action: string, idx: number) => {
    const trade = trades[idx];
    if (!trade) return;

    if (action === ACTIONS.EDIT) {
      setEditingTradeUuid(trade.uuid);
      setSideSheetOpen(true);
    }
    if (action === ACTIONS.DELETE) {
      setDeleteIdx(idx);
      setDeleteTradeName(trade.name || '');
      setModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (deleteIdx !== null) {
      const trade = trades[deleteIdx];
      if (trade) {
        try {
          const response = await apiService.deleteTrade(trade.uuid);
          const { message } = response;
          showSuccessToast(message || TRADE_MESSAGES.DELETE_SUCCESS);
          // Remove the trade from local state instead of fetching again
          setTrades(prevTrades =>
            prevTrades.filter((_, index) => index !== deleteIdx)
          );
        } catch (err: unknown) {
          // Handle auth errors first (will redirect to login if 401)
          if (handleAuthError(err)) {
            return; // Don't show toast if it's an auth error
          }

          const message = extractApiErrorMessage(
            err,
            TRADE_MESSAGES.DELETE_ERROR
          );
          showErrorToast(message);
        }
      }
      setDeleteIdx(null);
      setModalOpen(false);
    }
  };

  const handleCreateTrade = async (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => {
    const { tradeName, category, tradeData } = data;

    // Use the actual trade data from API response if available
    if (tradeData) {
      // Add the new trade to the beginning of the trades list
      setTrades(prevTrades => [tradeData, ...prevTrades]);
    } else {
      // Fallback: Create a new trade object to add to local state
      const newTrade: Trade = {
        id: Date.now(), // Temporary ID for local state
        uuid: `temp-${Date.now()}`, // Temporary UUID
        name: tradeName,
        description: '',
        is_default: false,
        is_active: true,
        status: CommonStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: category.split(', ').map(cat => ({
          id: Date.now(),
          name: cat.trim(),
          status: CommonStatus.ACTIVE,
        })),
      };

      // Add the new trade to the beginning of the trades list
      setTrades(prevTrades => [newTrade, ...prevTrades]);
    }
  };

  const handleUpdateTrade = async (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => {
    const { tradeName, category, tradeData } = data;

    // Use the actual trade data from API response if available
    if (tradeData) {
      // Update the trade in local state with the actual API response data
      setTrades(prevTrades =>
        prevTrades.map(trade =>
          trade.uuid === editingTradeUuid ? tradeData : trade
        )
      );
    } else {
      // Fallback: Update the trade in local state manually
      setTrades(prevTrades =>
        prevTrades.map(trade =>
          trade.uuid === editingTradeUuid
            ? {
                ...trade,
                name: tradeName,
                categories: category.split(', ').map(cat => ({
                  id: Date.now(),
                  name: cat.trim(),
                  status: CommonStatus.ACTIVE,
                })),
                updated_at: new Date().toISOString(),
              }
            : trade
        )
      );
    }
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 xl:mb-8'>
        <div className='flex items-center justify-between w-full'>
          <h2 className='page-title'>
            {TRADE_MESSAGES.TRADE_MANAGEMENT_TITLE}
          </h2>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                onClick={() => setSideSheetOpen(true)}
              >
                <Add size='24' color='#fff' className='sm:hidden' />
                <span className='hidden sm:inline'>
                  {TRADE_MESSAGES.ADD_TRADE_BUTTON}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Trade Grid */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 xl:gap-6'>
        {trades.length === 0 && loading ? (
          // Initial loading state with skeleton cards
          Array.from({ length: 10 }).map((_, idx) => (
            <TradeCardSkeleton key={idx} />
          ))
        ) : trades.length === 0 && !loading ? (
          <div className='col-span-full text-center h-full md:h-[calc(100vh_-_220px)]'>
            <NoDataFound
              buttonText={TRADE_MESSAGES.ADD_TRADE_BUTTON}
              onButtonClick={() => setSideSheetOpen(true)}
              description={TRADE_MESSAGES.NO_TRADES_FOUND_DESCRIPTION}
              showButton={canEdit ?? false}
            />
          </div>
        ) : (
          trades.map((trade, idx) => {
            const { uuid, name, categories } = trade;
            return (
              <InfoCard
                key={uuid}
                tradeName={name || ''}
                category={`${categories?.length || 0} Category${(categories?.length || 0) !== 1 ? 's' : ''}`}
                menuOptions={menuOptions}
                onMenuAction={action => handleMenuAction(action, idx)}
                module='trades'
              />
            );
          })
        )}
      </div>

      {/* Loading more trades */}
      {loading && trades.length > 0 && (
        <div className='w-full text-center py-4'>
          <LoadingComponent variant='inline' size='md' text={''} />
        </div>
      )}

      <ConfirmDeleteModal
        open={modalOpen}
        title={TRADE_MESSAGES.DELETE_CONFIRM_TITLE}
        subtitle={TRADE_MESSAGES.DELETE_CONFIRM_SUBTITLE.replace(
          '{name}',
          deleteTradeName || ''
        )}
        onCancel={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
      <SideSheet
        title={
          editingTradeUuid
            ? TRADE_MESSAGES.EDIT_TRADE_TITLE
            : TRADE_MESSAGES.ADD_TRADE_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={open => {
          setSideSheetOpen(open);
          if (!open) {
            setEditingTradeUuid(undefined);
          }
        }}
        size='600px'
      >
        <TradeForm
          onSubmit={editingTradeUuid ? handleUpdateTrade : handleCreateTrade}
          loading={loading}
          onCancel={() => {
            setSideSheetOpen(false);
            setEditingTradeUuid(undefined);
          }}
          initialTradeUuid={editingTradeUuid}
        />
      </SideSheet>
    </div>
  );
}
