import { useQuery } from '@tanstack/react-query';
import { getVitalSigns } from '../../services/nursing/nursingService';

export const useGetPatientVitalSigns = (id_IngresoPaciente: string) => {
  return useQuery({
    queryKey: ['patient-vital-signs', id_IngresoPaciente],
    queryFn: () => getVitalSigns(id_IngresoPaciente),
  });
};
