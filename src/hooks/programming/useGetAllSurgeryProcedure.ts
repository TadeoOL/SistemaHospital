import { useQuery } from '@tanstack/react-query';
import { getAllSurgeryProcedures } from '../../services/operatingRoom/surgeryProcedureService';

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
    data,
    isError,
  };
};
