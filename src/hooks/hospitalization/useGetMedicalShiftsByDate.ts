import { useQuery } from '@tanstack/react-query';
import { getMedicalShiftsByDate } from '../../services/hospitalization/medicalShift';

export const useGetMedicalShiftsByDate = (date: Date) => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['medicalShiftsByDate', date],
    queryFn: async () => getMedicalShiftsByDate(date),
  });

  return {
    isLoadingMedicalShifts: isLoading,
    medicalShiftsData: data as { id: string; nombre: string; id_Medico: string }[],
    isError,
  };
};
