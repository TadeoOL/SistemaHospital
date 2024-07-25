import { useQuery } from '@tanstack/react-query';
import { getDocumentData } from '../../services/programming/admissionRegisterService';
import { IDocumentsInfo } from '../../types/admissionTypes';

export const useGetDocumentData = (registerId: string) => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['documentData', registerId],
    queryFn: () => getDocumentData(registerId),
  });

  return {
    isLoading,
    data: data as IDocumentsInfo,
    isError,
  };
};
