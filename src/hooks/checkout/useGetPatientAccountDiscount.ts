import { getPatientBillById } from '../../services/checkout/patientAccount';
import { useEffect, useState } from 'react';

export const useGetPatientAccountDiscount = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await getPatientBillById(id);
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
