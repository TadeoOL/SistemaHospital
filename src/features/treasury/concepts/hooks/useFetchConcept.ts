import { useEffect, useState } from 'react';
import { IConcept } from '../interfaces/concept.interface';
import { getConceptById } from '../services/concepts';

export const useFetchConcept = (id?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IConcept | null>(null);

  const fetchData = async () => {
    setIsLoading(true);

    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await getConceptById(id);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { isLoading, data };
};
