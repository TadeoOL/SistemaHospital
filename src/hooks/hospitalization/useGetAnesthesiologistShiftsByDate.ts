import { useQuery } from '@tanstack/react-query';
import { getAnesthesiologistShiftsByDate } from '../../services/hospitalization/anesthesiologistShift';

export const useGetAnesthesiologistShiftsByDate = (date: Date) => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['anesthesiologistShiftsByDate', date],
    queryFn: async () => getAnesthesiologistShiftsByDate(date),
  });

  return {
    isLoadingAnesthesiologistShifts: isLoading,
    anesthesiologistShiftsData: data as { id: string; nombre: string; id_Anestesiologo: string }[],
    isError,
  };
};
