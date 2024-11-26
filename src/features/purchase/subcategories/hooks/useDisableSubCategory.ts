import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import { disableCategory } from '@/api/api.routes';
import Swal from 'sweetalert2';
import { useSubCategoryPagination } from '../stores/subCategoryPagination';

export const useDisableSubCategory = (callback?: () => void) => {
  const { enabled } = useSubCategoryPagination(
    (state) => ({
      enabled: state.enabled,
    }),
    shallow
  );

  const disableProviderModal = (id: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} una subcategoria`,
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
            await disableCategory(id);
            callback && callback();
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `La subcategoria se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} la subcategoria`,
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
