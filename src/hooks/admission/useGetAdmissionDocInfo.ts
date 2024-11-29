import { useQuery } from '@tanstack/react-query';
import { getAdmissionDoc } from '../../services/admission/admisionService';
import { IAdmissionDocInfo } from '@/types/admission/admissionTypes';

export const useGetAdmissionDocInfo = (id_IngresoPaciente: string) => {
  return useQuery<IAdmissionDocInfo>({
    queryKey: ['admission-doc-info', id_IngresoPaciente],
    queryFn: () => getAdmissionDoc(id_IngresoPaciente),
  });
};
