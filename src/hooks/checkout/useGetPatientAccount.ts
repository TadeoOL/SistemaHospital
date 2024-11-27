import { useEffect, useState } from 'react';
import { getPatientAccount } from '../../services/checkout/patientAccount';

export const useGetPatientAccount = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    console.log('id:', id);
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await getPatientAccount(id);
      setData(res);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [id]);

  return { data, isLoading, refetch, error };
};
