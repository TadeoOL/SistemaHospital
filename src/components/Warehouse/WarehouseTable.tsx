import { useCallback, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useWarehousePagination } from '../../store/purchaseStore/warehousePagination';
import { sortComponent } from '../Commons/sortComponent';
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
import { ModifyWarehouseModal } from './Modal/ModifyWarehouseModal';
import { useNavigate } from 'react-router-dom';
import { useWarehouseTabsNavStore } from '../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';

// const useDisableExistingArticle = () => {
//   const { setHandleChangeWarehouse, enabled, handleChangeWarehouse } = useWarehousePagination(
//     (state) => ({
//       setHandleChangeWarehouse: state.setHandleChangeWarehouse,
//       enabled: state.enabled,
//       handleChangeWarehouse: state.handleChangeWarehouse,
//     }),
//     shallow
//   );

//   const disableProviderModal = (articleId: string) => {
//     withReactContent(Swal)
//       .fire({
//         title: 'Advertencia',
//         text: `Estas a punto de ${enabled ? 'deshabilitar' : 'habilitar'} un almacén existente`,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: `${enabled ? 'Deshabilitar' : 'Habilitar'}`,
//         confirmButtonColor: 'red',
//         cancelButtonText: 'No, cancelar!',
//         reverseButtons: true,
//       })
//       .then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             await disableWarehouseById(articleId);
//             setHandleChangeWarehouse(!handleChangeWarehouse);
//             withReactContent(Swal).fire({
//               title: `${enabled ? 'Deshabilitado!' : 'Habilitado!'}`,
//               text: `El almacén existente se ha ${enabled ? 'deshabilitado' : 'habilitado'}`,
//               icon: 'success',
//             });
//           } catch (error) {
//             console.log(error);
//             withReactContent(Swal).fire({
//               title: 'Error!',
//               text: `No se pudo ${enabled ? 'deshabilitar' : 'habilitar'} El almacén existente`,
//               icon: 'error',
//             });
//           }
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           withReactContent(Swal).fire({
//             title: 'Cancelado',
//             icon: 'error',
//           });
//         }
//       });
//   };

//   return disableProviderModal;
// };

export const WarehouseTable = () => {
  const navigate = useNavigate();
  const clearState = useWarehouseTabsNavStore(useShallow((state) => state.clearWarehouseData));
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [openEditModal, setOpenEditModal] = useState(false);
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
    setSort,
    sort,
    handleChangeWarehouse,
  } = useWarehousePagination(
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
      handleChangeWarehouse: state.handleChangeWarehouse,
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
    fetchExistingArticles();
  }, [pageIndex, pageSize, search, enabled, handleChangeWarehouse, sort]);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{sortComponent('Nombre', 'nombre', setSort)}</TableCell>
              <TableCell>{sortComponent('Descripcion', 'descripcion', setSort)}</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((warehouse) => {
                    const { id, nombre, descripcion } = warehouse;
                    return (
                      <TableRow
                        key={id}
                        onClick={() => {
                          clearState();
                          navigate(`/almacenes/${id}`);
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
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={(e) => {
                                setWarehouseId(warehouse.id);
                                setOpenEditModal(true);
                                e.stopPropagation();
                              }}
                            >
                              <EditIcon />
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
          <ModifyWarehouseModal warehouseId={warehouseId} open={setOpenEditModal} />
        </div>
      </Modal>
    </>
  );
};
