import { useQuery } from '@tanstack/react-query';
import { getSurgicalPackagesPagination } from '@/services/operatingRoom/surgicalPackage';
import { IPagination, IParamsPagination } from '@/types/paginationType';
import { ISurgicalPackage } from '@/types/operatingRoom/surgicalPackageTypes';

export const useGetSurgicalPackages = (params?: IParamsPagination) => {
  return useQuery<IPagination<ISurgicalPackage>>({
    queryKey: ['surgicalPackages', params],
    queryFn: () => getSurgicalPackagesPagination(params),
    staleTime: 1000 * 60 * 5,
  });
};
