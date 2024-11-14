import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatientKardex } from '../../services/nursing/nursingService';
import { ICreateKardexCommand } from '../../types/nursing/nursingTypes';

export const useCreateKardex = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: ICreateKardexCommand) => 
        createPatientKardex(data),
      onSuccess: (_, res) => {
        queryClient.invalidateQueries({ 
          queryKey: ['patient-kardex', res.id_IngresoPaciente] 
        });
      },
    });
  };