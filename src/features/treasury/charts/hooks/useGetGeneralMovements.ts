import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ChartsService } from '../services/services.charts';
import { IMovements } from '../types/types.charts';

const MINUTE = 1000 * 60;
export const useGetGeneralMovements = (params: {
  fechaInicio: string;
  fechaFin: string;
  id_Origen: number;
  id_Destino: number;
  esSemanal: boolean;
}) => {
  const queryKey = useMemo(() => {
    return [
      'general-movements',
      params.fechaInicio,
      params.fechaFin,
      params.id_Origen,
      params.id_Destino,
      params.esSemanal,
    ];
  }, [params.fechaInicio, params.fechaFin, params.id_Origen, params.id_Destino, params.esSemanal]);

  return useQuery<IMovements>({
    queryKey,
    queryFn: () => ChartsService.getGeneralMovements(params),
    staleTime: MINUTE * 5,
    gcTime: MINUTE * 10,
    placeholderData: keepPreviousData,
  });
};
