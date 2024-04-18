import { useCallback, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useCategoryPagination } from '../../../../store/purchaseStore/categoryPagination';
import { ModifyCategoryModal } from './Modal/ModifyCategoryModal';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { disableCategory } from '../../../../api/api.routes';
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
import { sortComponent } from '../../../Commons/sortComponent';
import { CategoryInfoModal } from './Modal/CategoryInfoModal';

const useDisableCategory = () => {
  const { setHandleChangeCategory, enabled, handleChangeCategory } = useCategoryPagination(
    (state) => ({
      setHandleChangeCategory: state.setHandleChangeCategory,
      enabled: state.enabled,
      handleChangeCategory: state.handleChangeCategory,
    }),
    shallow
  );

  const disableProviderModal = (categoryId: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} una categoría`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Si, ${enabled ? 'deshabilitala!' : 'habilitala!'}`,
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableCategory(categoryId);
            setHandleChangeCategory(!handleChangeCategory);
            withReactContent(Swal).fire({
              title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `La categoría se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} la categoría`,
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

export const CategoryTable = () => {
  const disableCategory = useDisableCategory();
  const [categoryId, setCategoryId] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchCategories,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    setSort,
    sort,
    handleChangeCategory,
  } = useCategoryPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchCategories: state.fetchCategories,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangeCategory: state.handleChangeCategory,
      setSort: state.setSort,
      sort: state.sort,
    }),
    shallow
  );

  const handlePageChange = useCallback((event: any, value: any) => {
    event.stopPropagation();
    setPageIndex(value);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [pageIndex, pageSize, search, enabled, handleChangeCategory, sort]);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{sortComponent('Nombre', 'nombre', setSort)}</TableCell>
              <TableCell>{sortComponent('Descripcion', 'descripcion', setSort)}</TableCell>
              <TableCell>{sortComponent('Almacén', 'almacen', setSort)}</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((category) => {
                    const { id, nombre, descripcion, almacen } = category;

                    return (
                      <TableRow
                        key={id}
                        onClick={() => {
                          setOpenInfoModal(true);
                          setCategoryId(category.id);
                        }}
                        sx={{
                          '&:hover': {
                            cursor: 'pointer',
                            bgcolor: 'whitesmoke',
                          },
                        }}
                      >
                        <TableCell>{nombre}</TableCell>
                        <TableCell>{descripcion}</TableCell>
                        <TableCell>{almacen}</TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={(e) => {
                                setCategoryId(category.id);
                                setOpenEditModal(true);
                                e.stopPropagation();
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                disableCategory(category.id);
                                e.stopPropagation();
                              }}
                            >
                              {enabled ? (
                                <RemoveCircleIcon sx={{ color: 'red' }} />
                              ) : (
                                <CheckIcon sx={{ color: 'green' }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
        {
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
            labelRowsPerPage="Filas por página"
          />
        }
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          <ModifyCategoryModal data={categoryId} open={setOpenEditModal} />
        </div>
      </Modal>
      <Modal open={openInfoModal} onClose={() => setOpenInfoModal(false)}>
        <div>
          <CategoryInfoModal setOpen={setOpenInfoModal} id={categoryId} />
        </div>
      </Modal>
    </>
  );
};
