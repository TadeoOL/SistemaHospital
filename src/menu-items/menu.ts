import { useMemo } from 'react';

// Project-imports

// types
import { MenuProps, NavItemType } from '@/types/menu';

const initialState: MenuProps = {
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true,
};

export const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard', // server URL
};

const staticMenuItem = {
  id: 'invoice1',
  title: 'invoice',
  type: 'item',
  url: '/dashboard/invoice',
  breadcrumbs: false,
};

export function useGetMenu() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.dashboard, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(() => {
    let updatedMenu = data?.dashboard;

    if (updatedMenu && Array.isArray(updatedMenu.children) && updatedMenu.children.length > 0) {
      updatedMenu = {
        ...updatedMenu,
        children: updatedMenu.children.map((group: NavItemType) => {
          if (Array.isArray(group.children)) {
            return {
              ...group,
              children: [...group.children, staticMenuItem],
            };
          }
          return group;
        }),
      };
    }

    return {
      menu: updatedMenu as NavItemType,
      menuLoading: isLoading,
      menuError: error,
      menuValidating: isValidating,
      menuEmpty: !isLoading && !data?.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetMenuMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data as MenuProps,
      menuMasterLoading: isLoading,
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerComponentDrawer(isComponentDrawerOpened: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: any) => {
      return { ...currentMenuMaster, isComponentDrawerOpened };
    },
    false
  );
}

export function handlerDrawerOpen(isDashboardDrawerOpened: boolean) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster: any) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}
