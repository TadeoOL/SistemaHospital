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
  IconButton,
  TablePagination,
  Modal,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../../../Inputs/SearchBar';
import { Info } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { merchandiseEntryRequestPagination } from '../../../../store/warehouseStore/merchandiseEntryRequest';
import { AceptWareHouseRequestModalRework } from './Modal/AcceptWarehouseRequest';
import CloseIcon from '@mui/icons-material/Close';
import { MerchandiseEntry } from '../../../../types/types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { articlesOutputToWarehouse } from '../../../../api/api.routes';
import { SortComponent } from '../../../Commons/SortComponent';

export const WarehouseRequest = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
  const [request, setRequest] = useState<MerchandiseEntry>();
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
    setSearch,
    search,
    setSort,
    sort,
  } = merchandiseEntryRequestPagination((state) => ({
    data: state.data,
    fetchEntryRequest: state.fetchEntryRequest,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
    setSearch: state.setSearch,
    search: state.search,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
    setSort: state.setSort,
    sort: state.sort,
  }));

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
          const { value: reason } = await withReactContent(Swal).fire({
            title: 'Ingresa un motivo de cancelación:',
            input: 'textarea',
            inputPlaceholder: 'Escribe aquí...',
            inputAttributes: {
              'aria-label': 'Ingresa un motivo de cancelación',
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: (inputReason) => {
              return articlesOutputToWarehouse({
                Estatus: 0,
                Id_HistorialMovimiento: idRequest,
                Mensaje: inputReason as string,
              });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          });
          if (reason) {
            fetchEntryRequest();
            withReactContent(Swal).fire({
              title: 'Éxito!',
              text: 'Solicitud Cancelada',
              icon: 'success',
            });
          } else {
            withReactContent(Swal).fire({
              title: 'Operación Cancelada',
              text: 'No se proporcionó un motivo de cancelación.',
              icon: 'info',
            });
          }
        }
      });
  };

  useEffect(() => {
    fetchEntryRequest();
  }, [pageCount, pageSize, pageIndex, search, sort]);
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
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortComponent tableCellLabel="Folio de Petición" headerName="folio" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Peticion de Almacen"
                        headerName="almacenProveniente"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Solicitado Por"
                        headerName="solicitadoPor"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Fecha de Solicitud"
                        headerName="fechaSolicitud"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Estatus" headerName="estatus" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell align="center" sx={{ textAlign: 'center' }}>
                      Acción
                    </TableCell>
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
                            <Typography>{petition.folio}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.almacenDestino}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.solicitadoPor}</TableCell>
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
                                    console.log('peticion', petition);
                                    setRequest(petition);
                                    setOpenModal(true);
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  rejectRequest(petition.id);
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
                      <TableCell align="center" colSpan={6}>
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
                labelRowsPerPage="Filas por página"
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
          <AceptWareHouseRequestModalRework
            setOpen={setOpenModal}
            refetch={fetchEntryRequest}
            request={request as MerchandiseEntry}
          />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};
