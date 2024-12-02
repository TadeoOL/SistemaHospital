import { useQuery } from '@tanstack/react-query';
import { getSurgicalPackagesPagination } from '@/services/operatingRoom/surgicalPackage';
import { IPaginationResponse, IPaginationParams } from '@/types/paginationType';
import { ISurgicalPackage } from '@/types/operatingRoom/surgicalPackageTypes';

export const useGetSurgicalPackages = (params?: IPaginationParams) => {
  return useQuery<IPaginationResponse<ISurgicalPackage>>({
    queryKey: ['surgicalPackages', params],
    queryFn: () => getSurgicalPackagesPagination(params),
    staleTime: 1000 * 60 * 5,
  });
};
