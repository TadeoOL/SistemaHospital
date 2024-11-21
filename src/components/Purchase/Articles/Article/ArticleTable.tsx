import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Card,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { IArticle } from '../../../../types/types';
import { Select } from '@mui/material';
import TableBasic from '../../../../common/components/TableBasic';

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
    sort,
    setSort,
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
      sort: state.sort,
      setSort: state.setSort,
    }),
    shallow
  );

  useEffect(() => {
    fetchArticles();
  }, [pageIndex, pageSize, search, sort, enabled, handleChangeArticle]);

  return {
    isLoading,
    data: data as IArticle[],
    enabled,
    count,
    pageIndex,
    pageSize,
    sort,
    setPageIndex,
    setPageSize,
    cleanArticles,
    setSort,
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
  const { data, isLoading, enabled, count, pageIndex, pageSize, setSort, setPageIndex, setPageSize, cleanArticles } =
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

  const [goto, setGoto] = useState<string | number>(1);

  const handleChangeGoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const totalPages = Math.ceil(count / pageSize);
    if (+event.target.value > 0 && +event.target.value <= totalPages) {
      setGoto(+event.target.value);
      handlePageChange(event as any, +event.target.value - 1);
    } else {
      setGoto('');
    }
  };

  const columns: any[] = useMemo(
    () => [
      {
        header: 'Nombre',
        value: 'nombre',
        sort: setSort,
      },
      {
        header: 'Presentacion',
        value: 'presentacion',
        sort: setSort,
      },
      {
        header: 'Precio Compra',
        value: 'precioCompra',
        sort: setSort,
      },
      {
        header: 'Precio Venta Externo',
        value: 'precioVentaExterno',
        sort: setSort,
      },
      {
        header: 'Precio Venta Externo',
        value: 'precioVentaInterno',
        sort: setSort,
      },
      {
        header: 'Sub categoria',
        value: 'subCategoria',
        sort: setSort,
      },
      {
        header: 'Acciones',
        value: (row: any) => (
          <>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                sx={{ color: 'neutral.700' }}
                onClick={() => {
                  setArticleId(row.id);
                  setOpenEditModal(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
              <IconButton size="small" onClick={() => disableArticle(row.id)}>
                {enabled ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
              </IconButton>
            </Tooltip>
          </>
        ),
      },
    ],
    []
  );

  //:´v
  return (
    <>
      <TableBasic rows={data} columns={columns} isLoading={isLoading} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 2, ml: 2, mr: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Página:</Typography>
          <TextField
            id="outlined-name"
            placeholder="Page"
            value={goto}
            onChange={handleChangeGoto}
            size="small"
            sx={{ '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 50 } }}
          />

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              id="demo-controlled-open-select"
              value={pageSize}
              onChange={(e: any) => {
                setPageSize(e.target.value);
              }}
              size="small"
              sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
            >
              <MenuItem value={5}>5 por página</MenuItem>
              <MenuItem value={10}>10 por página</MenuItem>
              <MenuItem value={25}>25 por página</MenuItem>
              <MenuItem value={50}>50 por página</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Pagination
          count={Math.ceil(count / pageSize)}
          page={pageIndex + 1}
          onChange={(e, v) => handlePageChange(e as any, v - 1)}
          variant="combined"
          color="primary"
        />
      </Stack>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyArticleModal articleId={articleId} open={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
