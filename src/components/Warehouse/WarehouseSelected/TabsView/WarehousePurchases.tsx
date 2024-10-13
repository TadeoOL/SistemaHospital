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
  Button,
  Modal,
  FormControlLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../../../Inputs/SearchBar';
import { Info } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useEffect, useState } from 'react';
import { merchandiseEntryPagination } from '../../../../store/warehouseStore/merchandiseEntry';
import { AddMerchandisePetitionModal } from './Modal/AddMerchandisePetition';
import { SortComponent } from '../../../Commons/SortComponent';
import { MerchandiseEntry } from '../../../../types/types';
import withReactContent from 'sweetalert2-react-content';
import { articlesOutputToWarehouse } from '../../../../api/api.routes';
import { AceptWareHouseRequestModalRework } from './Modal/AcceptWarehouseRequest';

export const WarehousePurchases = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
  const [openAceptModal, setOAceptpenModal] = useState(false);
  const {
    data,
    fetchMerchandiseEntries,
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
    setStatus,
    status,
    sort,
  } = merchandiseEntryPagination((state) => ({
    data: state.data,
    fetchMerchandiseEntries: state.fetchMerchandiseEntries,
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
    setStatus: state.setStatus,
    status: state.status,
    sort: state.sort,
  }));
  const [request, setRequest] = useState<MerchandiseEntry>();

  const getStatus = (petition: MerchandiseEntry) => {
    switch (petition.estatus) {
      case 0:
        return <>{'Cancelado'}</>;
      case 1:
        return <>
          
          <Box
            sx={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            {'Pendiente'}
            <Tooltip title="Armar solicitud">
            <IconButton>
              <SettingsIcon
                onClick={() => {
                  console.log('peticion', petition);
                  setRequest(petition);
                  setOAceptpenModal(true);
                }}
              />
            </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar solicitud">
            <IconButton
              size="small"
              onClick={() => {
                rejectRequest(petition.id_SolicitudAlmacen);
              }}
            >
              <CloseIcon sx={{ color: 'red' }} />
            </IconButton>
            </Tooltip>
          </Box>
        </>;
      case 2:
        return <>
        {'En espera'}
        <Tooltip title="Marcar como Entregado">
              <IconButton
                onClick={() => {
                  markAsDelivered(petition.id_SolicitudAlmacen);
                }}
              >
                <MarkunreadMailboxIcon sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
        </>;
      case 3:
        return <>{'Entregado/Aceptado'}</>;
    }
  }
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
                Id_SolicitudAlmacen: idRequest,
                Motivo: inputReason as string,
              });
            },
            allowOutsideClick: () => !Swal.isLoading(),
          });
          if (reason) {
            fetchMerchandiseEntries();
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

  const markAsDelivered = (idRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Confirmación',
        text: `¿Seguro que deseas marcar como entregada esta solicitud?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'green',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return articlesOutputToWarehouse({
            Estatus: 3,
            Id_SolicitudAlmacen: idRequest,
            Motivo: '',
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          //fetchData(false, warehouseSL?.id_Almacen ?? warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Solicitud entregada',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se cambio la solicitud',
            icon: 'info',
          });
        }
      });
  };

  useEffect(() => {
    //setStatus(null)
    fetchMerchandiseEntries();
  }, [pageCount, pageSize, pageIndex, search, sort, status]);

  return (
    <React.Fragment>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar petición de almacén..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={status === 1}
                  onChange={(val) => {
                    if (val.target.checked) {
                      setStatus(1);
                    } else {
                      setStatus(null);
                    }
                  }}
                />
              }
              label="Pendientes"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Nueva petición
              </Button>
            </Box>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortComponent tableCellLabel="Folio de Solicitud" headerName="folio" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Almacen Solicitante"
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((petition, i) => (
                      <React.Fragment key={i}>
                        <TableRow>
                          <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {!viewArticles[petition.id_SolicitudAlmacen] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [petition.id_SolicitudAlmacen]: !viewArticles[petition.id_SolicitudAlmacen],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [petition.id_SolicitudAlmacen]: !viewArticles[petition.id_SolicitudAlmacen],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography>{petition.folio}</Typography>
                          </TableCell>
                          <TableCell >{petition.almacenDestino}</TableCell>
                          <TableCell >{petition.usuarioSolicito}</TableCell>
                          <TableCell >{petition.fechaSolicitud}</TableCell>
                          <TableCell >
                            {getStatus(petition)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[petition.id_SolicitudAlmacen]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {petition?.articulos &&
                                    petition?.articulos?.length > 0 &&
                                    petition.articulos.map((movimientoArticuclo) => (
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
                      <TableCell align="center" colSpan={5}>
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
                                No hay peticiones
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
          <AddMerchandisePetitionModal setOpen={setOpenModal} refetch={fetchMerchandiseEntries} />
        </React.Fragment>
      </Modal>
      <Modal
        open={openAceptModal}
        onClose={() => {
          setOAceptpenModal(false);
        }}
      >
        <React.Fragment>
          <AceptWareHouseRequestModalRework
            setOpen={setOAceptpenModal}
            refetch={fetchMerchandiseEntries}
            request={request as MerchandiseEntry}
          />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};
