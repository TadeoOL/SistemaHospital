import { IConcept } from '../interfaces/concept.interface';
import { getConceptById } from '../services/concepts';
import { useQuery } from '@tanstack/react-query';

export const useFetchConcept = (id?: string) => {
  return useQuery<IConcept>({
    queryKey: ['concept', id],
    queryFn: () => getConceptById(id as string),
    enabled: !!id,
  });
};
