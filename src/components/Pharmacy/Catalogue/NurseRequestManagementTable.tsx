import {
  Box,
  Card,
  CircularProgress,
  Collapse,
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
  TextField,
  Tooltip,
  Typography,
  alpha,
  styled,
  tableCellClasses,
  FormControlLabel,
  Switch,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { ExpandLess, ExpandMore, FilterListOff, Info, Cancel } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNurseRequestPaginationStore } from '../../../store/pharmacy/nurseRequest/nurseRequestPagination';
import { IArticleInRequest, InurseRequest } from '../../../types/types';
import { SearchBar } from '../../Inputs/SearchBar';
import { RequestBuildingModal } from '../UserRequest/Modal/RequestBuildingModal';
import { updateStatusNurseRequest } from '../../../api/api.routes';
import { getStatus } from '../../../utils/NurseRequestUtils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '20%',
  },
}));

export const useGetNursesRequest = () => {
  const {
    data,
    setSearch,
    search,
    status,
    setStatus,
    fetchData,
    setStartDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    clearFilters,
    pageSize,
    startDate,
    endDate,
    isLoading,
    pageIndex,
    count,
  } = useNurseRequestPaginationStore(
    (state) => ({
      pageIndex: state.pageIndex,
      count: state.count,
      data: state.data,
      setStatus: state.setStatus,
      status: state.status,
      setSearch: state.setSearch,
      search: state.search,
      fetchData: state.fetchData,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
      pageSize: state.pageSize,
      startDate: state.startDate,
      endDate: state.endDate,
      //clearAllData: state.clearAllData,
      isLoading: state.loading,
      //sort: state.sort,
      //setSort: state.setSort,
    }),
    shallow
  );

  /*useEffect(() => {
    //clearAllData();
    //setWarehouseId(warehouseData.id);
    setPrincipalWarehouseId(warehouseData.id_AlmacenPrincipal || '');
  }, []);*/

  useEffect(() => {
    console.log("entra el efects");
    fetchData(false);
  }, [search, startDate, endDate, clearFilters, /* sort,*/ pageSize, pageIndex]);
  return {
    data,
    setSearch,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    //setSort,
    pageSize,
    pageIndex,
    count,
    fetchData,
    setStatus,
    status,
  };
};
export const NurseRequestManagementTable = () => {
  const {
    data,
    setSearch,
    setEndDate,
    setStartDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    //setSort,
    pageSize,
    pageIndex,
    count,
    fetchData,
    setStatus,
    status
  } = useGetNursesRequest();
  const [openModalBuild, setOpenModalBuild] = useState(false);
  const [nurseRequest, setNurseRequest] = useState<InurseRequest | null>(null);
  //setWarehouseId
  useEffect(() => {
    fetchData(false);
  }, [ status]);

  const rejectRequest = (idRequest: string, Id_warehouseRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar esta solicitud de enfermero?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'red',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return updateStatusNurseRequest({
            Id_AlmacenOrigen: Id_warehouseRequest,
            EstadoSolicitud: 0,
            Id: idRequest,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchData(false);
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

  const markAsDelivered = (idRequest: string, Id_warehouseRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Confirmación',
        text: `¿Seguro que deseas marcar esta solicitud como entregada?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'green',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return updateStatusNurseRequest({
            Id_AlmacenOrigen: Id_warehouseRequest,
            EstadoSolicitud: 3,
            Id: idRequest,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchData(false);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Salida marcada como entregada',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se marcó la salida como entregada',
            icon: 'info',
          });
        }
      });
  };

  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar solicitud..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  defaultChecked
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
                value={endDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => clearFilters()}>
                <FilterListOff />
              </IconButton>
            </Box>
          </Box>
          <Card>
            {isLoading && data.length === 0 ? (
              <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/*
                        <TableCell>
                        <SortComponent
                          tableCellLabel="Nombre del Articulo"
                          headerName="articulo"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Stock Minimo"
                          headerName="stockMinimo"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Stock Actual"
                          headerName="stockActual"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Precio de compra"
                          headerName="precioCompra"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Código de Barras"
                          headerName="codigoBarras"
                          setSortFunction={setSort}
                        />
                      </TableCell>*/}
                      <TableCell>Folio</TableCell>
                      <TableCell>Paciente</TableCell>
                      <TableCell>Cuarto</TableCell>
                      <TableCell>Enfermero que solicitó</TableCell>
                      <TableCell>Solicitado</TableCell>
                      <TableCell>Almacén Solicitado</TableCell>
                      <TableCell>Entregado Por</TableCell>
                      <TableCell>Estatus</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.map((request) => (
                        <TableRowComponent
                          nurseRequest={request}
                          setOpenModalBuild={setOpenModalBuild}
                          setNurseRequest={setNurseRequest}
                          markAsDelivered={markAsDelivered}
                          key={request.id_SolicitudEnfermero}
                          rejectRequest={rejectRequest}
                        />
                      ))}
                  </TableBody>
                </Table>
                {!data ||
                  (data.length === 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 5,
                        columnGap: 1,
                      }}
                    >
                      <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                      <Typography variant="h2" color="gray">
                        No hay artículos existentes
                      </Typography>
                    </Box>
                  ))}
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
            )}
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModalBuild} onClose={() => setOpenModalBuild(!openModalBuild)}>
        <>
          <RequestBuildingModal
            setOpen={setOpenModalBuild}
            refetch={fetchData}
            request={nurseRequest as InurseRequest}
          />
        </>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  nurseRequest: InurseRequest;
  setOpenModalBuild: Function;
  setNurseRequest: Function;
  rejectRequest: Function;
  markAsDelivered: Function;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({
  nurseRequest,
  setOpenModalBuild,
  setNurseRequest,
  rejectRequest,
  markAsDelivered,
}) => {
  const [open, setOpen] = useState(false);
  //const nursesRequestData = useNurseRequestPaginationStore(useShallow((state) => state.data));

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>{!open ? <ExpandMore /> : <ExpandLess />}</IconButton>
            {nurseRequest.folio}
          </Box>
        </TableCell>
        <TableCell>{nurseRequest.pacienteNombre}</TableCell>
        <TableCell>{nurseRequest.cuarto}</TableCell>
        <TableCell>{nurseRequest.usuarioEmisorNombre}</TableCell>
        <TableCell>{nurseRequest.solicitadoEn}</TableCell>
        <TableCell>{nurseRequest.almacenNombre}</TableCell>
        <TableCell>{nurseRequest.usuarioEntregoNombre}</TableCell>
        <TableCell>{getStatus(nurseRequest.estatus)}</TableCell>
        <TableCell>
          {nurseRequest.estatus === 1 && (
            <Tooltip title={'Armar solicitud'}>
              <IconButton
                onClick={() => {
                  setOpenModalBuild(true);
                  setNurseRequest(nurseRequest);
                }}
              >
                <AddCircleIcon sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
          )}
          {
            nurseRequest.estatus === 2 && (
              <Tooltip title="Marcar como Entregado">
                <IconButton
                  onClick={() => {
                    markAsDelivered(nurseRequest.id_SolicitudEnfermero, nurseRequest.id_AlmacenSolicitado);
                  }}
                >
                  <MarkunreadMailboxIcon sx={{ color: 'green' }} />
                </IconButton>
              </Tooltip>
            )
          }
          {nurseRequest.estatus !== 0 && nurseRequest.estatus !== 3 && (
            <Tooltip title="Cancelar solicitud">
              <IconButton
                onClick={() => {
                  rejectRequest(nurseRequest.id_SolicitudEnfermero, nurseRequest.id_AlmacenSolicitado);
                }}
              >
                <Cancel sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          )}
          
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ padding: 0 }}>
          <Collapse in={open} unmountOnExit>
            <SubItemsTable articles={nurseRequest.articulos} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

interface SubItemsTableProps {
  articles: IArticleInRequest[];
}
const SubItemsTable: React.FC<SubItemsTableProps> = ({ articles }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Nombre Articulo</StyledTableCell>
            <StyledTableCell align="center">Cantidad</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((a, i) => (
            <SubItemsTableRow articleR={a} key={`${a.id_Articulo}|${i}`} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
interface SubItemsTableRowProps {
  articleR: IArticleInRequest;
}
const SubItemsTableRow: React.FC<SubItemsTableRowProps> = ({ articleR }) => {
  return (
    <TableRow key={articleR.id_Articulo}>
      <TableCell align="center">{articleR.nombre}</TableCell>
      <TableCell align="center">{articleR.cantidad}</TableCell>
    </TableRow>
  );
};
