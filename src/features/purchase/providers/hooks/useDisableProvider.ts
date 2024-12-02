import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useProviderPagination } from '@/store/purchaseStore/providerPagination';
import { disableProvider } from '../services/providers';

export const useDisableProvider = (callback?: () => void) => {
  const { enabled } = useProviderPagination(
    (state) => ({
      enabled: state.enabled,
    }),
    shallow
  );

  const disableProviderModal = (id: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} un proveedor, ¿Estás seguro?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${enabled ? 'Deshabilitar' : 'Habilitar'}`,
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableProvider(id);
            callback && callback();
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El proveedor se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} el proveedor`,
              icon: 'error',
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          withReactContent(Swal).fire({
            title: 'Cancelado',
            icon: 'error',
          });
        }
      });
  };

  return disableProviderModal;
};