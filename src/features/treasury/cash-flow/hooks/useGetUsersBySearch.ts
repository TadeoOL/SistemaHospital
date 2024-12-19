import { useEffect, useState } from 'react';
import { getUsersBySearch } from '@/api/api.routes';

export type User = {
  id: string;
  nombre: string;
};

export const useGetUsersBySearch = (search: string) => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await getUsersBySearch(search);
        setUsers(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchData();
  }, [search]);

  return { isLoadingUsers, users };
};
