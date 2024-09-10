import { useQuery } from '@tanstack/react-query';
import { getDocumentConcepts } from '../../services/contpaqi/documents';
import { DocumentConcept } from '../../types/contpaqiTypes';

export const useGetAllDocumentConcepts = () => {
  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['documentConcepts'],
    queryFn: async () => getDocumentConcepts(),
  });

  return {
    isLoadingConcepts: isLoading,
    documentConcepts: data as DocumentConcept[],
    isError,
  };
};
