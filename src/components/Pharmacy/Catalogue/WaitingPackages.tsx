import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Info } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  Modal,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
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
import { buildPackage, getPackagePreBuilded } from '../../../api/api.routes';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { SortComponent } from '../../Commons/SortComponent';
import { LuPackagePlus } from 'react-icons/lu';
//import { CreatePackageModal } from './Modal/CreatePackageModal';
import { IArticleHistory, IarticlesPrebuildedRequest } from '../../../types/types';
import { RequestBuildingModalMutation } from './Modal/CreatePackageModalMutation';
import { toast } from 'react-toastify';

const STATUS: Record<number, string> = {
  0: 'Cancelada',
  1: 'Armar paquete',
  2: 'En espera',
  3: 'Aceptada',
};
enum STATUS_ENUM {
  Cancelada = 0,
  ArmarPaquete = 1,
  Esperando = 2,
  Aceptada = 3,
}

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
    sort,
    setSort,
    status,
    setStatus,
  } = useWarehouseMovementPackagesPaginationStore((state) => ({
    data: state.data,
    fetchWareHouseMovements: state.fetchWarehouseMovements,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
    status: state.status,
    setStatus: state.setStatus,
    startDate: state.startDate,
    setStartDate: state.setStartDate,
    endDate: state.endDate,
    setEndDate: state.setEndDate,
    setSearch: state.setSearch,
    search: state.search,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
    sort: state.sort,
    setSort: state.setSort,
  }));

  useEffect(() => {
    fetchWareHouseMovements(warehouseIdSeted);
  }, [pageCount, pageSize, pageIndex, startDate, status, sort, endDate, search]);
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
    status,
    setStatus,
    setPageIndex,
    setPageSize,
    setSort,
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
    status,
    setStatus,
    setPageIndex,
    setPageSize,
    fetchWareHouseMovements,
    setSort,
  } = useGetMovements();
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);
  const [openCreatePackageModal, setOpenCreatePackageModal] = useState(false);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [packageSelected, setPackageSelected] = useState<{ id_SolicitudAlmacen: string; id_CuentaEspacioHospitalario: string; } | null>(null);
  const [provisionalArticles, setProvisionalArticles] = useState<IArticleHistory[]>([]);
  const [prebuildedArticles, setPrebuildedArticles] = useState<IarticlesPrebuildedRequest[] | null>(null);
  const rejectRequest = (id_SolicitudAlmacen: string, id_CuentaEspacioHospitalario: string) => {
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
          return buildPackage({
            estatus: 0,
            id_SolicitudAlmacen: id_SolicitudAlmacen,
            id_CuentaEspacioHospitalario: id_CuentaEspacioHospitalario,
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

  const acceptRequest = (id_SolicitudAlmacen: string, id_CuentaEspacioHospitalario: string) => {
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
        preConfirm: async () => {
          try {
            await buildPackage({
              estatus: 3,
              id_SolicitudAlmacen,
              id_CuentaEspacioHospitalario,
            });
          } catch (error: any) {
            const errorMessage = error.response?.data?.message?.[0] || 'Error desconocido del servidor.';
            toast.error(`La salida no fue aceptada`);
            withReactContent(Swal).fire({
              title: 'Operación Cancelada',
              text: `Error: ${errorMessage}`,
              icon: 'info',
            });
            throw new Error(errorMessage); 
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetchWareHouseMovements(warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Salida Aceptada',
            icon: 'success',
          });
        }
      });
  };

  const createPackage = (id_request: string, id_account: string, request: IarticlesPrebuildedRequest[]) => {
    setPrebuildedArticles(request);
    setOpenCreatePackageModal(true);
    setPackageSelected({
      id_SolicitudAlmacen: id_request,
      id_CuentaEspacioHospitalario: id_account
    });
    setLoadingPackage(false);
  };

  useEffect(() => {
    setProvisionalArticles(data?.find((d) => d.id_SolicitudAlmacen === packageSelected?.id_SolicitudAlmacen)?.articulos ?? []);
  }, [packageSelected]);
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={status === 1}
                      onChange={(val) => {
                        if (val.target.checked) {
                          setStatus(1);
                        } else {
                          setStatus(2);
                        }
                      }}
                    />
                  }
                  label="Pendientes"
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
                    <TableCell>
                      <SortComponent tableCellLabel="Folio" headerName="folio" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Quirofano</TableCell>
                    <TableCell>Hora cirugía</TableCell>
                    <TableCell>Nombre Paciente</TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Solicitado por" headerName="enfermero" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Fecha Solicitud"
                        headerName="fechaSolicitud"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Estatus" headerName="estatus" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((movimiento) => (
                      <React.Fragment key={movimiento.id_SolicitudAlmacen}>
                        <TableRow>
                          <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {!viewArticles[movimiento.id_SolicitudAlmacen] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [movimiento.id_SolicitudAlmacen]: !viewArticles[movimiento.id_SolicitudAlmacen],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [movimiento.id_SolicitudAlmacen]: !viewArticles[movimiento.id_SolicitudAlmacen],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography> {movimiento.folio} </Typography>
                          </TableCell>
                          <TableCell>
                            {movimiento.medico}
                          </TableCell>
                          <TableCell>
                            {movimiento.quirofano}
                          </TableCell>
                          <TableCell>
                            {movimiento.horaCirugia}
                          </TableCell>
                          <TableCell>
                            {movimiento.paciente}
                          </TableCell>

                          <TableCell> {movimiento.usuarioSolicito} </TableCell>
                          <TableCell>{movimiento.fechaSolicitud}</TableCell>
                          <TableCell>{STATUS[movimiento.estatus]}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {(movimiento.estatus as number) === STATUS_ENUM.Esperando ? (
                                <>
                                  <Tooltip title="Aceptar paquete">
                                    <IconButton
                                      onClick={() => {
                                        acceptRequest(
                                          movimiento.id_SolicitudAlmacen,
                                          movimiento.id_CuentaEspacioHospitalario
                                        );
                                      }}
                                    >
                                      <DoneIcon />
                                    </IconButton>
                                  </Tooltip>

                                </>
                              ) : (movimiento.estatus as number) === STATUS_ENUM.ArmarPaquete ? (
                                <>
                                  <Tooltip title="Armar paquete">
                                    <IconButton
                                      onClick={async () => {
                                        try {
                                          //Agregar Loader
                                          setLoadingPackage(true);
                                          const packRes = await getPackagePreBuilded(movimiento.id_SolicitudAlmacen);
                                          createPackage(movimiento.id_SolicitudAlmacen, movimiento.id_CuentaEspacioHospitalario, packRes);
                                        } catch (error) {
                                          console.log(error);
                                        }
                                      }}
                                    >
                                      <LuPackagePlus
                                        style={{
                                          color: '#8F959E',
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>

                                </>
                              ) : (<></>)

                              }
                              {movimiento.estatus !== 0 && movimiento.estatus !== 3 && (<Tooltip title="Cancelar paquete">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    rejectRequest(movimiento.id_SolicitudAlmacen, movimiento.id_CuentaEspacioHospitalario);
                                  }}
                                >
                                  <CloseIcon sx={{ color: 'red' }} />
                                </IconButton>
                              </Tooltip>)}
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={9} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[movimiento.id_SolicitudAlmacen]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {movimiento?.articulos &&
                                    movimiento?.articulos?.length > 0 &&
                                    movimiento.articulos.map((movimientoArticuclo, i) => (
                                      <TableRow key={(movimientoArticuclo.nombre, i)}>
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
                                No hay paquetes en espera
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
      <Modal open={openCreatePackageModal}>
        <>
          {/*<CreatePackageModal
            setOpen={setOpenCreatePackageModal}
            articles={provisionalArticles}
            movementHistoryId={packageSelected}
            setArticles={setProvisionalArticles}
            preLoadedArticles={prebuildedArticles ?? []}
          />*/}
          <RequestBuildingModalMutation
            setOpen={setOpenCreatePackageModal}
            requestedItems={provisionalArticles}
            refetch={() => {
              fetchWareHouseMovements(warehouseIdSeted);
            }}
            preLoadedArticles={prebuildedArticles ?? ([] as IarticlesPrebuildedRequest[])}
            id_SolicitudAlmacen={packageSelected?.id_SolicitudAlmacen ?? ""}
            id_CuentaEspacioHospitalario={packageSelected?.id_CuentaEspacioHospitalario ?? ""}
          />
        </>
      </Modal>
      <CircularProgress
        size={100}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          flexDirection: 'column',
          display: loadingPackage ? 'flex' : 'none',
        }}
      />
    </>
  );
};
