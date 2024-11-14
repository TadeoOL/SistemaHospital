import { useQuery } from '@tanstack/react-query';
import { getPatientKardex } from '../../services/nursing/nursingService';

export const useGetPatientKardex = (id: string) => {
  return useQuery({
    queryKey: ['patient-kardex', id],
    queryFn: () => getPatientKardex(id),
    enabled: !!id,
  });
};
