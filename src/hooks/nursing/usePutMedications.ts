import { 
  IPatientKardex,
} from '../../types/nursing/nursingTypes';
import { putMedications } from '../../services/nursing/nursingService';
import { AddMedicationsFormData } from '../../components/Nursing/PatientKardex/AddMedicationsModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePutMedications = (id_IngresoPaciente: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kardexId, data }: { kardexId: string; data:AddMedicationsFormData }) => 
      putMedications(kardexId, data),
    onSuccess: (response: IPatientKardex, variables) => {
      queryClient.setQueryData(
        ['patient-kardex', id_IngresoPaciente],
        (oldData: IPatientKardex[] | undefined) => {
          console.log({response});
          console.log({variables});
          console.log({oldData});
          if (!oldData) return [];
          
          return oldData.map(kardex => 
            kardex.id === variables.kardexId 
              ? { 
                  ...kardex, 
                  medicamentos: response.medicamentos?.map(med => ({
                    id_Articulo: med.id_Articulo,
                    frecuencia: med.frecuencia,
                    dosis: med.dosis,
                    via: med.via,
                    horario: med.horario,
                    nombreMedicamento: med.nombreMedicamento,
                  })) || []
                }
              : kardex
          );
        }
      );
    },
  });
};
