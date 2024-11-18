import { useMutation } from '@tanstack/react-query';
import { VitalSignsFormData } from '../../schema/nursing/vitalSignsSchema';
import { createPatientVitalSigns } from '../../services/nursing/nursingService';
import { useQueryClient } from '@tanstack/react-query';

export const useCreatePatientVitalSigns = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VitalSignsFormData) => createPatientVitalSigns(data),
    onSuccess: (_, res) => {
      queryClient.invalidateQueries({
        queryKey: ['patient-vital-signs', res.id_IngresoPaciente]
      });
    },
  });
};
