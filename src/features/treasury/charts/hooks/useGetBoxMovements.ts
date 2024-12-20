import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChartsService } from '../services/services.charts';
import { IMovements } from '../types/types.charts';
import { useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

const MINUTE = 1000 * 60;
export const useGetBoxMovements = (params: {
  fechaInicio: string;
  fechaFin: string;
  id_CajaRevolvente: string;
  esSemanal: boolean;
}) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => {
    return ['box-movements', params.fechaInicio, params.fechaFin, params.id_CajaRevolvente, params.esSemanal];
  }, [params.fechaInicio, params.fechaFin, params.id_CajaRevolvente, params.esSemanal]);

  const query = useQuery<IMovements>({
    queryKey,
    queryFn: () => ChartsService.getBoxMovements(params),
    enabled: !!params.id_CajaRevolvente,
    staleTime: MINUTE * 5,
    gcTime: MINUTE * 10,
    placeholderData: keepPreviousData,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return { query, invalidate };
};
