import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BankService } from '../services/services.bank';
import { IBankMovements } from '../types/types.bank';
import { useMemo } from 'react';

const MINUTE = 1000 * 60;
export const useGetBankMovements = (params: {
  fechaInicio: string;
  fechaFin: string;
  id_Origen: number;
  id_Destino: number;
  esSemanal: boolean;
}) => {
  const queryKey = useMemo(() => {
    return [
      'bank-movements',
      params.fechaInicio,
      params.fechaFin,
      params.id_Origen,
      params.id_Destino,
      params.esSemanal,
    ];
  }, [params.fechaInicio, params.fechaFin, params.id_Origen, params.id_Destino, params.esSemanal]);

  return useQuery<IBankMovements>({
    queryKey,
    queryFn: () => BankService.getBankMovements(params),
    staleTime: MINUTE * 5,
    gcTime: MINUTE * 10,
    placeholderData: keepPreviousData,
  });
};
