import { useQuery } from '@tanstack/react-query';
import { getPatientDiet } from '../../services/nursing/nursingService';

export const useGetPatientDiets = (id_IngresoPaciente: string) => {
  return useQuery({
    queryKey: ['patient-diets', id_IngresoPaciente],
    queryFn: () => getPatientDiet(id_IngresoPaciente),
  });
};
