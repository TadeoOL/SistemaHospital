import { useQuery } from '@tanstack/react-query';
import { IAcountFullInformation } from '../../types/hospitalizationTypes';
import { getAccountFullInformation } from '../../services/programming/admissionRegisterService';
import { getAccountBillInformation } from '@/services/invoice/invoicePatientBill';

export const useGetAccountFullInformation = (patientAccountId: string) => {
  //const paramURL = `Id_Paciente=${patientId}&Id_CuentaPaciente=${patientAccountId}`;
  const cmamut = {
    id_CuentaPaciente: patientAccountId,
    opcionFacturacion: {
      articulos: true,
      servicios: true,
      cuartos: true,
      quirofanos: true,
      equipoHonorario: true,
      cirugias: true,
    }
  }
  const { data, isError, isLoading } = useQuery({
    queryKey: ['accountFullInformation', patientAccountId],
    queryFn: async () => getAccountBillInformation(cmamut),
  });

  return {
    isLoading: isLoading,
    data: data as IAcountFullInformation,
    isError,
  };
};
