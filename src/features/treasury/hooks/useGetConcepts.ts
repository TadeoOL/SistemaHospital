import { useQuery } from '@tanstack/react-query';
import { IConcept } from '../types/types.common';
import { getAllConceptosSalida } from '../concepts/services/concepts';

export const useGetConcepts = () => {
  return useQuery<IConcept[]>({
    queryKey: ['concepts'],
    queryFn: getAllConceptosSalida,
  });
};
