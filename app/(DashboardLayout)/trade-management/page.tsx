'use client';

import SideSheet from '@/components/shared/common/SideSheet';
import TradeForm from '@/components/shared/forms/TradeForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACTIONS, CommonStatus, PAGINATION } from '@/constants/common';
import { ACCESS_DENIED_MESSAGES } from '@/constants/messages';

import AccessDenied from '@/components/shared/common/AccessDenied';
import { useCompanyChange } from '@/hooks/use-company-change';
import { apiService } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getCompanyId,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { Add, Edit2, Refresh, Trash } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import ArchiveList from './ArchiveList';
import TradeList from './TradeList';
import { TRADE_MESSAGES } from './trade-messages';
import { MenuOption, Trade } from './trade-types';

export default function TradeManagementPage() {
  // Get menu options based on current tab
  const getMenuOptions = (isArchive: boolean): MenuOption[] => {
    if (isArchive) {
      // Archive tab - only show retrieve option
      return [
        {
          label: TRADE_MESSAGES.RETRIEVE_MENU,
          action: ACTIONS.RETRIEVE,
          icon: Refresh,
          variant: 'default' as const,
        },
      ];
    } else {
      // Active trades tab - show edit and delete options
      return [
        {
          label: TRADE_MESSAGES.EDIT_MENU,
          action: ACTIONS.EDIT,
          icon: Edit2,
          variant: 'default' as const,
        },
        {
          label: TRADE_MESSAGES.DELETE_MENU,
          action: ACTIONS.DELETE,
          icon: Trash,
          variant: 'destructive' as const,
        },
      ];
    }
  };
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGINATION.TRADES_LIMIT);
  const [search] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [editingTradeUuid, setEditingTradeUuid] = useState<string | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState('trade');
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for trades
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.trades?.edit;
  const canViewTrades = userPermissions?.trades?.view;

  const fetchTrades = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1) {
        setLoading(true);
      }
      try {
        // Get selected company ID using common function
        const companyId = getCompanyId();

        // Determine status based on selected tab
        const statusParam =
          selectedTab === 'archive'
            ? CommonStatus.INACTIVE
            : CommonStatus.ACTIVE;

        const response = await apiService.fetchTrades({
          page: targetPage,
          limit,
          name: search,
          status: statusParam,
          ...(companyId ? { company_id: companyId } : {}),
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
    [limit, search, handleAuthError, showErrorToast, selectedTab]
  );

  // Handle company changes
  const refetchTrades = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setTrades([]);
    fetchTrades(1, false);
  }, [fetchTrades]);

  useCompanyChange(refetchTrades);

  // Refetch when tab changes
  useEffect(() => {
    fetchTrades(1, false);
  }, [selectedTab]);

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

  const handleEditTrade = (uuid: string) => {
    setEditingTradeUuid(uuid);
    setSideSheetOpen(true);
  };

  // Archive handler (delete trade)
  const handleArchiveTrade = async (uuid: string) => {
    try {
      const trade = trades.find(t => t.uuid === uuid);

      // Prevent archiving of default trades
      if (trade?.is_default) {
        showErrorToast(TRADE_MESSAGES.DEFAULT_TRADE_DELETE_ERROR);
        return;
      }

      const response = await apiService.deleteTrade(uuid);
      showSuccessToast(
        extractApiSuccessMessage(response, TRADE_MESSAGES.DELETE_SUCCESS)
      );
      fetchTrades(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, TRADE_MESSAGES.DELETE_ERROR);
      showErrorToast(message);
    }
  };

  // Handler for retrieving a trade
  const handleRetrieveTrade = async (uuid: string) => {
    try {
      const response = await apiService.updateTradeStatus(uuid, 'ACTIVE');

      showSuccessToast(
        extractApiSuccessMessage(response, TRADE_MESSAGES.RETRIEVE_SUCCESS)
      );

      // Remove the retrieved trade from the current list immediately
      setTrades(prev => prev.filter(t => t.uuid !== uuid));

      // Refresh list to reflect latest server state based on current tab
      await fetchTrades(1, false);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        TRADE_MESSAGES.RETRIEVE_ERROR
      );
      showErrorToast(message);
    }
  };

  const handleCreateTrade = async (data: {
    tradeName: string;
    category: string;
    tradeData?: Trade;
  }) => {
    const { tradeName, category, tradeData } = data;

    // Get selected company ID using common function
    const companyId = getCompanyId();

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
        ...(companyId ? { company_id: companyId } : {}),
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

  // Check if user has permission to view trades
  if (userPermissions && !canViewTrades) {
    return (
      <AccessDenied
        title={ACCESS_DENIED_MESSAGES.TRADE_DETAILS_TITLE}
        message={ACCESS_DENIED_MESSAGES.TRADE_DETAILS_MESSAGE}
        redirectText={ACCESS_DENIED_MESSAGES.TRADE_DETAILS_REDIRECT_TEXT}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
          <h2 className='page-title'>
            {TRADE_MESSAGES.TRADE_MANAGEMENT_TITLE}
          </h2>
        </div>
      </div>

      {/* Tabs Row */}
      <div className='flex flex-col sm:flex-row gap-4 md:items-center justify-between sm:mb-6 mb-4 xl:mb-8'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex sm:flex-row flex-col-reverse items-center justify-between sm:gap-3'>
            <TabsList className='grid w-full sm:max-w-[328px] grid-cols-2 bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal shadow-lg sm:shadow-none'>
              <TabsTrigger
                value='trade'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Trade
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className='flex items-center gap-3 sm:gap-2 lg:gap-4 justify-end w-full sm:w-auto'>
              {canEdit && (
                <Button
                  className='btn-primary flex items-center shrink-0 justify-center !px-0 sm:!px-6 text-center !w-[42px] sm:!w-auto rounded-full shadow-lg sm:shadow-none hover:shadow-xl sm:hover:shadow-none transition-all duration-300 transform hover:scale-105 sm:hover:scale-100 active:scale-95 sm:active:scale-100 fixed sm:static bottom-6 right-6 z-50 sm:z-auto'
                  onClick={() => setSideSheetOpen(true)}
                >
                  <Add size='24' color='#fff' className='sm:hidden' />
                  <span className='hidden sm:inline'>
                    {TRADE_MESSAGES.ADD_TRADE_BUTTON}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Trade Tab Content */}
          <TabsContent value='trade' className='mt-6'>
            <TradeList
              trades={trades}
              loading={loading}
              noDataDescription={TRADE_MESSAGES.NO_TRADES_FOUND_DESCRIPTION}
              menuOptions={getMenuOptions(false)}
              onDelete={handleArchiveTrade}
              onEdit={handleEditTrade}
              onCreateTrade={() => setSideSheetOpen(true)}
              canEdit={canEdit ?? false}
            />
          </TabsContent>

          {/* Archive Tab Content */}
          <TabsContent value='archive' className='mt-6'>
            <ArchiveList
              trades={trades}
              loading={loading}
              noDataTitle={TRADE_MESSAGES.ARCHIVED_TRADES_TITLE}
              noDataDescription={TRADE_MESSAGES.NO_ARCHIVED_TRADES_FOUND}
              menuOptions={getMenuOptions(true)}
              onRetrieve={handleRetrieveTrade}
            />
          </TabsContent>
        </Tabs>
      </div>

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
