import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  Collapse,
  CircularProgress,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  IconButton,
  TablePagination,
  Modal,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../../../Inputs/SearchBar';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Info } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useWarehouseMovementPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaginacion';
import { merchandiseEntryRequestPagination } from '../../../../store/warehouseStore/merchandiseEntryRequest';
import { AceptWareHouseRequestModal } from './Modal/AcceptWarehouseRequest';
import CloseIcon from '@mui/icons-material/Close';
import { MerchandiseEntry } from '../../../../types/types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { articlesOutputToWarehouse } from '../../../../api/api.routes';

const useGetEntries = () => {
  const {
    data,
    fetchEntryRequest,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
    setPageIndex,
    setPageSize,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setSearch,
    search,
  } = merchandiseEntryRequestPagination((state) => ({
    data: state.data,
    fetchEntryRequest: state.fetchEntryRequest,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
    startDate: state.startDate,
    setStartDate: state.setStartDate,
    endDate: state.endDate,
    setEndDate: state.setEndDate,
    setSearch: state.setSearch,
    search: state.search,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
  }));

  useEffect(() => {
    fetchEntryRequest();
  }, [pageCount, pageSize, pageIndex, startDate, endDate, search]);
  return {
    data,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
    setSearch,
    setStartDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    fetchEntryRequest,
  };
};

export const WarehouseRequest = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
  const [request, setRequest] = useState<MerchandiseEntry>();
  const {
    data,
    count,
    pageIndex,
    pageSize,
    isLoading,
    setSearch,
    setStartDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    fetchEntryRequest,
  } = useGetEntries();
  const rejectRequest = (idRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar esta solicitud de articulos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const object = {
            Estatus: 0,
            Id_HistorialMovimiento: idRequest,
          };
          console.log(object);
          try {
            await articlesOutputToWarehouse(object);
            fetchEntryRequest();
            withReactContent(Swal).fire({
              title: 'Exito!',
              text: 'Solicitud Cancelada',
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: 'Ocurrio un erro en la cancelación',
              icon: 'error',
            });
          }
        }
      });
  };
  console.log('checar estatus', data);
  /* const disableUserModal = (userId: string, stateEnabled: boolean, userDisabled: boolean) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `Estas a punto de ${stateEnabled ? 'deshabilitar' : 'habilitar'} un usuario.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${stateEnabled ? 'Deshabilitar' : 'Habilitar'}`,
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await disableUser(userId);
            setUserDisabled(!userDisabled);
            withReactContent(Swal).fire({
              title: `${stateEnabled ? 'Deshabilitado!' : 'Habilitado!'}`,
              text: `El usuario se ha ${stateEnabled ? 'deshabilitado' : 'habilitado'}`,
              icon: 'success',
            });
          } catch (error) {
            console.log(error);
            withReactContent(Swal).fire({
              title: 'Error!',
              text: `No se pudo ${stateEnabled ? 'deshabilitar' : 'habilitar'} el usuario`,
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

  return disableUserModal;
};*/
  return (
    <React.Fragment>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar solicitud de mercancia..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <TextField
                label="Fecha inicio"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
              <TextField
                label=" Fecha final"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => useWarehouseMovementPaginationStore.getState().clearFilters()}>
                <FilterListOffIcon />
              </IconButton>
            </Box>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Petición de Almacén</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Fecha de solicitud</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Estatus</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((petition, i) => (
                      <React.Fragment key={i}>
                        <TableRow>
                          <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {!viewArticles[petition.id] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [petition.id]: !viewArticles[petition.id],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [petition.id]: !viewArticles[petition.id],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography>{petition.almacenDestino}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.fechaSolicitud}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {petition.estatus === 0 ? 'Cancelada' : 'Pendiente'}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <IconButton>
                                <SettingsIcon
                                  onClick={() => {
                                    setRequest(petition);
                                    setOpenModal(true);
                                    //e.stopPropagation();
                                    //setPurchaseRequestId(auth.id_SolicitudCompra);
                                    //setOpenMensajeModal(true);
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  rejectRequest(petition.id);
                                  //e.stopPropagation();
                                  //setPurchaseRequestId(auth.id_SolicitudCompra);
                                  //setOpenMensajeModal(true);
                                }}
                              >
                                <CloseIcon sx={{ color: 'red' }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[petition.id]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {petition?.historialArticulos &&
                                    petition?.historialArticulos?.length > 0 &&
                                    petition.historialArticulos.map((movimientoArticuclo) => (
                                      <TableRow key={movimientoArticuclo.nombre}>
                                        <TableCell align="center">{movimientoArticuclo.nombre}</TableCell>
                                        <TableCell align="center">{movimientoArticuclo.cantidad}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
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
                                No hay solicitudes
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
          <AceptWareHouseRequestModal
            setOpen={setOpenModal}
            refetch={fetchEntryRequest}
            request={request as MerchandiseEntry}
          />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};
