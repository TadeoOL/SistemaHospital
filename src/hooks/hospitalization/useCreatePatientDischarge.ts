import { useMutation } from '@tanstack/react-query';
import { registerPatientDischarge } from '../../services/hospitalization/hospitalRoomsService';
import { toast } from 'react-toastify';

export const useCreatePatientDischarge = () => {
  return useMutation({
    mutationFn: (data: {
      Id_IngresoPaciente: string;
      DiagnosticoEgreso: string;
      MotivoEgreso: string;
    }) => registerPatientDischarge(data),
    onSuccess: () => {
      toast.success('Alta médica registrada correctamente');
    },
    onError: () => {
      toast.error('Error al registrar la alta médica');
    },
  });
};
