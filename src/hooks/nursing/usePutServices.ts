import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putServices } from '../../services/nursing/nursingService';
import { IPatientKardex } from '../../types/nursing/nursingTypes';
import { AddServicesFormData } from '../../components/Nursing/PatientKardex/AddServicesModal';

export const usePutServices = (id_IngresoPaciente: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, data }: { kardexId: string; data: AddServicesFormData }) =>
      putServices(kardexId, data),
    onSuccess: (response: IPatientKardex, variables) => {
      queryClient.setQueryData(
        ['patient-kardex', id_IngresoPaciente],
        (oldData: IPatientKardex[] | undefined) => {
          if (!oldData) return [];

          return oldData.map(kardex =>
            kardex.id === variables.kardexId 
              ? { 
                  ...kardex, 
                  servicios: response.servicios?.map(service => ({
                    id_Servicio: service.id_Servicio,
                    indicaciones: service.indicaciones,
                    nombreServicio: service.nombreServicio,
                  })) || []
                }
              : kardex
          );
        }
      );
    },
  });
};
