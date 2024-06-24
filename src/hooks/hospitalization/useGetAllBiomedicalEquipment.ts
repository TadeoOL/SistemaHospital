import { useQuery } from '@tanstack/react-query';
import { getAllBiomedicalEquipment } from '../../services/hospitalization/biomedicalEquipmentService';
import { IBiomedicalEquipment } from '../../types/hospitalizationTypes';

export const useGetAllBiomedicalEquipment = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['allBiomedicalEquipment'],
    queryFn: async () => getAllBiomedicalEquipment(),
  });

  return {
    isLoadingBiomedicalEquipment: isLoading,
    biomedicalEquipmentData: data as IBiomedicalEquipment[],
    isError,
  };
};
