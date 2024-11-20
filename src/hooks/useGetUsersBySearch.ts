import { useEffect, useState } from 'react';
import { getUsersBySearch } from '../api/api.routes';
import { useShallow } from 'zustand/react/shallow';
import { useSubWarehousePaginationStore } from '../store/warehouseStore/subWarehousePagination';

export type User = {
  id: string;
  nombre: string;
};

export const useGetUsersBySearch = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersRes, setUsersRes] = useState<User[]>([]);
  const searchUser = useSubWarehousePaginationStore(useShallow((state) => state.searchUser));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await getUsersBySearch(searchUser);
        setUsersRes(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchData();
  }, [searchUser]);
  return { isLoadingUsers, usersRes };
};
