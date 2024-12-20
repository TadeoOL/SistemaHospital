import { useMutation } from '@tanstack/react-query';
import { eliminarCajaRevolvente } from '../services/cashflow';

export const useDeleteBox = () => {
  return useMutation({
    mutationFn: eliminarCajaRevolvente,
  });
};
