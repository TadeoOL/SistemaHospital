import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Info } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useWarehouseMovementPackagesPaginationStore } from '../../../store/warehouseStore/movimientoAlmacenPaquetesPaginacion';
import { SearchBar } from '../../Inputs/SearchBar';
import withReactContent from 'sweetalert2-react-content';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { articlesOutputToWarehouse, waitingpackageChangeStatus } from '../../../api/api.routes';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

const useGetMovements = () => {
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);
  const {
    data,
    fetchWareHouseMovements,
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
  } = useWarehouseMovementPackagesPaginationStore((state) => ({
    data: state.data,
    fetchWareHouseMovements: state.fetchWarehouseMovements,
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
    fetchWareHouseMovements(warehouseIdSeted);
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
    startDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    fetchWareHouseMovements,
  };
};

export const WaitingPackages = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const {
    data,
    count,
    pageIndex,
    pageSize,
    isLoading,
    setSearch,
    setStartDate,
    setEndDate,
    startDate,
    setPageIndex,
    setPageSize,
    fetchWareHouseMovements,
  } = useGetMovements();
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);

  const rejectRequest = (idRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar esta salida de articulos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return waitingpackageChangeStatus({
            Estatus: 0,
            Id_HistorialMovimiento: idRequest,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchWareHouseMovements(warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Salida cancelada',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se cancelo la salida',
            icon: 'info',
          });
        }
      });
  };

  const acceptRequest = (idRequest: string, lotes: any) => {
    withReactContent(Swal)
      .fire({
        title: 'Confirmación',
        text: `¿Estás seguro de aceptar esta salida de artículos?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return articlesOutputToWarehouse({
            Estatus: 2,
            Id_HistorialMovimiento: idRequest,
            Lotes: lotes,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchWareHouseMovements(warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Salida Aceptada',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'Operación Cancelada',
            text: 'La salida no fue aceptada.',
            icon: 'info',
          });
        }
      });
  };
  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
                <SearchBar
                  title="Buscar paquete en espera..."
                  searchState={setSearch}
                  sx={{ display: 'flex', flex: 1 }}
                  size="small"
                />
                <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
                  <TextField
                    label="Fecha inicio"
                    size="small"
                    type="date"
                    value={startDate}
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
                  <IconButton onClick={() => useWarehouseMovementPackagesPaginationStore.getState().clearFilters()}>
                    <FilterListOffIcon />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Folio</TableCell>
                    <TableCell>Solicitado por</TableCell>
                    <TableCell>Fecha Solicitud</TableCell>
                    <TableCell>Estatus</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((movimiento) => (
                      <React.Fragment key={movimiento.id}>
                        <TableRow>
                          <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {!viewArticles[movimiento.id] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [movimiento.id]: !viewArticles[movimiento.id],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [movimiento.id]: !viewArticles[movimiento.id],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography> {movimiento.folio} </Typography>
                          </TableCell>
                          <TableCell> {movimiento.solicitadoPor} </TableCell>
                          {
                            //<TableCell> {movimiento.autorizadoPor} </TableCell>
                          }
                          <TableCell>{movimiento.fechaSolicitud}</TableCell>
                          <TableCell>
                            {movimiento.estatus === 0
                              ? 'Cancelada'
                              : movimiento.estatus === 2
                                ? 'Aceptada'
                                : 'En espera'}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <IconButton>
                                <DoneIcon
                                  onClick={() => {
                                    acceptRequest(movimiento.id, movimiento.historialArticulos);
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  rejectRequest(movimiento.id);
                                }}
                              >
                                <CloseIcon sx={{ color: 'red' }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[movimiento.id]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="center">Fecha Caducidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {movimiento?.historialArticulos &&
                                    movimiento?.historialArticulos?.length > 0 &&
                                    movimiento.historialArticulos.map((movimientoArticuclo, i) => (
                                      <TableRow key={(movimientoArticuclo.nombre, i)}>
                                        <TableCell align="center">{movimientoArticuclo.nombre}</TableCell>
                                        <TableCell align="center">{movimientoArticuclo.cantidad}</TableCell>
                                        <TableCell align="center">{movimientoArticuclo.fechaCaducidad}</TableCell>
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
                      <TableCell align="center" colSpan={7}>
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
                                No hay movimientos
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
                labelRowsPerPage="Filas por página"
              />
            </TableContainer>
          </Card>
        </Stack>
      </Stack>
    </>
  );
};
