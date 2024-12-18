import { useQuery } from '@tanstack/react-query';
import { getConcepts } from '../services/treasury';
import { IConcept } from '../types/types.common';

export const useGetConcepts = () => {
  return useQuery<IConcept[]>({
    queryKey: ['concepts'],
    queryFn: getConcepts,
  });
};
