import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { disableExistingArticle } from '../../../../api/api.routes';
import { TableComponent } from '../../../TableComponent';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { ModifyExistingArticleModal } from './Modal/ModifyExistingArticleModal';

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchExistingArticles,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeExistingArticle,
  } = useExistingArticlePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchExistingArticles: state.fetchExistingArticles,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeExistingArticle: state.handleChangeExistingArticle,
    }),
    shallow
  );

  useEffect(() => {
    fetchExistingArticles();
  }, [pageIndex, pageSize, search, enabled, handleChangeExistingArticle]);

  return {
    isLoading,
    data,
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  };
};

const useDisableExistingArticle = () => {
  const { setHandleChangeExistingArticle, enabled, handleChangeExistingArticle } = useExistingArticlePagination(
    (state) => ({
      setHandleChangeExistingArticle: state.setHandleChangeExistingArticle,
      enabled: state.enabled,
      handleChangeExistingArticle: state.handleChangeExistingArticle,
    }),
    shallow
  );

  const disableProviderModal = (articleId: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} un articulo existente`,
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
            await disableExistingArticle(articleId);
            setHandleChangeExistingArticle(!handleChangeExistingArticle);
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El articulo existente se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} El articulo existente`,
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

export const ExistingArticleTable = () => {
  const disableArticle = useDisableExistingArticle();

  return (
    <>
      <TableComponent
        disableHook={disableArticle}
        fetchDataHook={useGetAllData}
        hasPrices={[3, 2]}
        modifyModalComponent={(props) => (
          <ModifyExistingArticleModal existingArticleId={props.data} open={props.open} />
        )}
        headers={[
          'Cantidad',
          'Fecha de compra',
          'Precio de compra',
          'Precio de venta',
          'Factor',
          'Fecha de caducidad',
          'Nombre',
          'Almacén',
        ]}
      />
    </>
  );
};
