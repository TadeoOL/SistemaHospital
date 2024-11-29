import { useMutation } from '@tanstack/react-query';
import { createPatientReentry } from '@/services/admission/admisionService';
import { toast } from 'react-toastify';

export const useCreatePatientReentry = () => {
  return useMutation({
    mutationFn: createPatientReentry,
    onSuccess: () => {
      toast.success('Paciente reingresado correctamente');
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error al reingresar paciente');
    },
  });
};
