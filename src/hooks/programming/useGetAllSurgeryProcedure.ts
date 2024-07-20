import { useQuery } from '@tanstack/react-query';
import { getAllSurgeryProcedures } from '../../services/programming/surgeryProcedureService';

export const useGetAllSurgeryProcedures = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allSurgeryProcedures'],
    queryFn: async () => getAllSurgeryProcedures(),
  });

  return {
    isLoadingProcedures: isLoading,
    data: data as { id: string; nombre: string; precio: number; }[],
    isError,
  };
};
