import { useQuery } from '@tanstack/react-query';
import { getAllAnesthesiologists } from '../../services/operatingRoom/anesthesiologistService';

export const useGetAnesthesiologists = () => {
  const { data = [], isError, isLoading } = useQuery({
    queryKey: ['allAnesthesiologists'],
    queryFn: async () => {
      const anesthesiologists = await getAllAnesthesiologists();
      return anesthesiologists.map((anesthesiologist: any) => ({
        id_Anestesiologo: anesthesiologist.id_Anestesiologo,
        nombre: `${anesthesiologist.nombre} ${anesthesiologist.apellidoPaterno} ${anesthesiologist.apellidoMaterno}`,
      }));
    },
  });

  return {
    isLoadingAnesthesiologists: isLoading,
    anesthesiologistsData: data as { id_Anestesiologo: string; nombre: string }[],
    isError,
  };
};