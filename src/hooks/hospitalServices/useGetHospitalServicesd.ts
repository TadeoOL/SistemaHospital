import { useQuery } from '@tanstack/react-query';
import { getHospitalServices } from '../../services/hospitalServices/hospitalServicesService';

export const useGetHospitalServices = ({ serviceType = 0 }: { serviceType: number }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['hospitalServices'],
    queryFn: () => getHospitalServices({ serviceType }),
  });

  return {
    data,
    isLoading,
  };
};
