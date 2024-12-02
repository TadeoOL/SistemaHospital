import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNormalRoomPaginationStore } from '../stores/useNormalRoomPagination';
import { deleteRoom } from '../services/normal-rooms';

export const useDisableNormalRoom = (callback?: () => void) => {
  const { enabled } = useNormalRoomPaginationStore(
    (state) => ({
      enabled: state.enabled,
    }),
    shallow
  );

  const disableProviderModal = (id: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} un articulo`,
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
            await deleteRoom(id);
            callback && callback();
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El articulo se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} el articulo`,
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