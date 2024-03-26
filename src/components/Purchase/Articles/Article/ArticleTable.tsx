import React, { useCallback, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { disableArticle } from '../../../../api/api.routes';
import { useArticlePagination } from '../../../../store/purchaseStore/articlePagination';
import { ModifyArticleModal } from './Modal/ModifyArticleModal';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { IArticle } from '../../../../types/types';

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchArticles,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    handleChangeArticle,
    cleanArticles,
  } = useArticlePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchArticles: state.fetchArticles,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeArticle: state.handleChangeArticle,
      cleanArticles: state.cleanArticles,
    }),
    shallow
  );

  useEffect(() => {
    fetchArticles();
  }, [pageIndex, pageSize, search, enabled, handleChangeArticle]);

  return {
    isLoading,
    data: data as IArticle[],
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    cleanArticles,
  };
};

const useDisableArticle = () => {
  const { setHandleChangeArticle, enabled, handleChangeArticle } = useArticlePagination(
    (state) => ({
      setHandleChangeArticle: state.setHandleChangeArticle,
      enabled: state.enabled,
      handleChangeArticle: state.handleChangeArticle,
    }),
    shallow
  );

  const disableProviderModal = (articleId: string) => {
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
            await disableArticle(articleId);
            setHandleChangeArticle(!handleChangeArticle);
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El articulo se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} El articulo`,
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

export const ArticleTable = () => {
  const disableArticle = useDisableArticle();
  const { data, isLoading, enabled, count, pageIndex, pageSize, setPageIndex, setPageSize, cleanArticles } =
    useGetAllData();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [articleId, setArticleId] = useState('');

  useEffect(() => {
    return () => {
      cleanArticles();
    };
  }, []);

  // const handleUserChecked = (e: any) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setIsChecked([...isChecked, value]);
  //   } else {
  //     setIsChecked(isChecked.filter((item) => item !== value));
  //   }
  // };

  // const handleIsUserChecked = (userId: string) => {
  //   if (isChecked.some((user) => user === userId)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, value: number) => {
    event?.stopPropagation();
    setPageIndex(value);
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Código barras</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Stock mínimo</TableCell>
              <TableCell>Stock alerta</TableCell>
              <TableCell>Precio Compra</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Presentación</TableCell>
              <TableCell>Sub categoría</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((article) => (
                    <React.Fragment key={article.id}>
                      <TableRow>
                        <TableCell>{article.codigoBarras}</TableCell>
                        <TableCell>{article.nombre}</TableCell>
                        <TableCell>{article.stockAlerta}</TableCell>
                        <TableCell>{article.stockMinimo}</TableCell>
                        <TableCell>{article.precioCompra}</TableCell>
                        <TableCell>{article.precioVenta}</TableCell>
                        <TableCell>{article.unidadMedida}</TableCell>
                        <TableCell>{article.subCategoria as string}</TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={() => {
                                setArticleId(article.id);
                                setOpenEditModal(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
                            <IconButton size="small" onClick={() => disableArticle(article.id)}>
                              {enabled ? (
                                <RemoveCircleIcon sx={{ color: 'red' }} />
                              ) : (
                                <CheckIcon sx={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
          </TableBody>
        </Table>
        {isLoading && (
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {data.length === 0 && !isLoading && (
          <Card
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              columnGap: 1,
            }}
          >
            <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
            <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
              No existen registros
            </Typography>
          </Card>
        )}
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(e: any) => {
            setPageSize(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyArticleModal articleId={articleId} open={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
