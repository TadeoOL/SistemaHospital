import { Delete, Edit, Info } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AddSubWarehouseModal } from './Modal/AddSubWarehouseModal';
import { useSubWarehousePaginationStore } from '../../../../store/warehouseStore/subWarehousePagination';
import { ISubWarehouse } from '../../../../types/types';
import Swal from 'sweetalert2';
import { disableWarehouseById } from '../../../../api/api.routes';
import { useNavigate } from 'react-router-dom';
import { useWarehouseTabsNavStore } from '../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';

const useGetWarehouses = () => {
  const { data, fetchSubWarehouse, isLoading, pageCount, pageIndex, pageSize, count, setPageIndex, setPageSize } =
    useSubWarehousePaginationStore((state) => ({
      data: state.data,
      fetchSubWarehouse: state.fetchSubWarehouse,
      isLoading: state.isLoading,
      pageCount: state.pageCount,
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
    }));

  useEffect(() => {
    fetchSubWarehouse();
  }, [pageCount, pageSize, pageIndex]);

  return {
    data,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
    setPageIndex,
    setPageSize,
  };
};

export const SubWarehouses = () => {
  const { data, count, pageIndex, pageSize, isLoading, setPageIndex, setPageSize } = useGetWarehouses();
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button variant="contained" onClick={() => setOpenModal(true)}>
              Nuevo Sub Almacén
            </Button>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Encargado de almacén</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((sw) => <TableRowComponent subWarehouse={sw} key={sw.id} />)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            p: 2,
                            columnGap: 1,
                          }}
                        >
                          {isLoading && !data ? (
                            <CircularProgress size={25} />
                          ) : (
                            <>
                              <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                              <Typography variant="h2" color="gray">
                                No existen registros de Sub Almacenes
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={count}
                onPageChange={(e, value) => {
                  e?.stopPropagation();
                  setPageIndex(value);
                }}
                onRowsPerPageChange={(e: any) => {
                  setPageSize(e.target.value);
                }}
                page={pageIndex}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableContainer>
          </Card>
        </Stack>
      </Stack>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <React.Fragment>
          <AddSubWarehouseModal setOpen={setOpenModal} />
        </React.Fragment>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  subWarehouse: ISubWarehouse;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({ subWarehouse }) => {
  const [editSubWarehouse, setEditSubWarehouse] = useState(false);
  const setTab = useWarehouseTabsNavStore(useShallow((state) => state.setTabValue));

  const handleDelete = () => {
    Swal.fire({
      title: 'Estas seguro que deseas eliminar el subalmacen?',
      text: 'Esta accion eliminara el subalmacen y todos sus registros dentro',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#046CBC',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await disableWarehouseById(subWarehouse.id);
        useSubWarehousePaginationStore.getState().fetchSubWarehouse();
        Swal.fire({
          title: 'Eliminado!',
          text: `El almacén se ha eliminado con éxito!`,
          icon: 'success',
        });
      }
    });
  };

  const navigate = useNavigate();
  return (
    <>
      <TableRow
        onClick={(e) => {
          e.stopPropagation();
          setTab(0);
          navigate(`/almacenes/${subWarehouse.id}`);
        }}
      >
        <TableCell>{subWarehouse.nombre}</TableCell>
        <TableCell>{subWarehouse.descripcion}</TableCell>
        <TableCell>{subWarehouse.usuarioEncargado}</TableCell>
        <TableCell>
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setEditSubWarehouse(true);
                }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        </TableCell>
      </TableRow>
      <Modal open={editSubWarehouse} onClose={() => setEditSubWarehouse(false)}>
        <>
          <AddSubWarehouseModal setOpen={setEditSubWarehouse} edit={true} warehouseData={subWarehouse} />
        </>
      </Modal>
    </>
  );
};
