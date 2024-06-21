import { useQuery } from '@tanstack/react-query';
import { getAllBiomedicalEquipment } from '../../services/hospitalization/biomedicalEquipmentService';

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
    biomedicalEquipmentData: data as { id: string; nombre: string; descripcion: string; precio: number }[],
    isError,
  };
};
