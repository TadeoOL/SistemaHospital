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
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { ExpandLess, ExpandMore, FilterListOff, Info, Cancel, LocalPrintshopOutlined } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNurseRequestPaginationStore } from '../../../store/pharmacy/nurseRequest/nurseRequestPagination';
import {
  IArticleInRequest,
  InurseRequest,
  IPrebuildedArticleFromArticleRequest,
  IWarehouseData,
} from '../../../types/types';
import { SearchBar } from '../../Inputs/SearchBar';
import { RequestBuildingModal } from '../UserRequest/Modal/RequestBuildingModal';
import { getNurseRequestPreBuilded, updateStatusNurseRequest } from '../../../api/api.routes';
import { getStatus } from '../../../utils/NurseRequestUtils';
import { SortComponent } from '../../Commons/SortComponent';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { NurseRequestReport } from '../../Export/Pharmacy/NurseRequestReport';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

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
    sort,
    setSort,
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
      sort: state.sort,
      setSort: state.setSort,
    }),
    shallow
  );
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  /*useEffect(() => {
    //clearAllData();
    //setWarehouseId(warehouseData.id);
    setPrincipalWarehouseId(warehouseData.id_AlmacenPrincipal || '');
  }, []);*/

  useEffect(() => {
    fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
  }, [search, startDate, endDate, clearFilters, sort, pageSize, pageIndex]);
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
    setSort,
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
    setSort,
    pageSize,
    pageIndex,
    count,
    fetchData,
    setStatus,
    status,
  } = useGetNursesRequest();
  const [openModalBuild, setOpenModalBuild] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [nurseRequest, setNurseRequest] = useState<InurseRequest | null>(null);
  const [prebuildedArticles, setPrebuildedArticles] = useState<IPrebuildedArticleFromArticleRequest[] | null>(null);
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  //setWarehouseId
  useEffect(() => {
    fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
  }, [status]);

  const rejectRequest = (idRequest: string, Id_warehouseRequest: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Advertencia',
        text: `¿Seguro que deseas cancelar esta solicitud de solicitud?`,
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
          fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Solicitud cancelada',
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

  const markAsDelivered = (idRequest: string, Id_warehouseRequest: string, Id_PacientAccount: string) => {
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
          return updateStatusNurseRequest({
            Id_AlmacenOrigen: Id_warehouseRequest,
            EstadoSolicitud: 3,
            Id: idRequest,
            Id_CuentaPaciente: Id_PacientAccount,
            //Id_Enfermero : '',
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
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
                      <TableCell>
                        <SortComponent tableCellLabel="Folio" headerName="folio" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>
                        <SortComponent tableCellLabel="Paciente" headerName="paciente" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>
                        <SortComponent tableCellLabel="Cuarto" headerName="cuarto" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Enfermero que solicitó"
                          headerName="enfermero"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent tableCellLabel="Solicitado" headerName="solicitado" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>Almacén Solicitado</TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Entregado Por"
                          headerName="entregadoPor"
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
                    {data &&
                      data.map((request) => (
                        <TableRowComponent
                          nurseRequest={request}
                          setOpenModalBuild={setOpenModalBuild}
                          setOpenPrint={setOpenPrint}
                          setNurseRequest={setNurseRequest}
                          setPrebuildedArticles={setPrebuildedArticles}
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
                        {status === 1
                          ? `No hay solicitudes Pendientes`
                          : `No hay solicitudes armadas, entregadas o canceladas`}
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
            refetch={() => {
              fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
            }}
            request={nurseRequest as InurseRequest}
            preLoadedArticles={prebuildedArticles ?? ([] as IPrebuildedArticleFromArticleRequest[])}
          />
        </>
      </Modal>
      <Modal
        open={openPrint}
        onClose={() => {
          setOpenPrint(false);
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 380, sm: 550 },
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: { xs: 650 },
          }}
        >
          <HeaderModal setOpen={setOpenPrint} title="PDF cuenta de paciente" />
          <Box sx={{ overflowY: 'auto', bgcolor: 'background.paper', p: 2 }}>
            {nurseRequest !== null && !isLoading ? (
              <PDFDownloadLink
                document={<NurseRequestReport request={nurseRequest} />}
                fileName={`${Date.now()}.pdf`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {({ loading }) => <Button variant="contained">{loading ? 'Generando PDF...' : 'Descargar PDF'}</Button>}
              </PDFDownloadLink>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={35} />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  nurseRequest: InurseRequest;
  setOpenModalBuild: Function;
  setOpenPrint: Function;
  setNurseRequest: Function;
  setPrebuildedArticles: Function;
  rejectRequest: Function;
  markAsDelivered: Function;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({
  nurseRequest,
  setOpenModalBuild,
  setOpenPrint,
  setNurseRequest,
  setPrebuildedArticles,
  rejectRequest,
  markAsDelivered,
}) => {
  const [open, setOpen] = useState(false);

  //const nursesRequestData = useNurseRequestPaginationStore(useShallow((state) => state.data));
  const createPackage = (request: IPrebuildedArticleFromArticleRequest[]) => {
    setPrebuildedArticles(request);
    setNurseRequest(nurseRequest);
    setOpenModalBuild(true);
  };

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
                onClick={async () => {
                  try {
                    //Agregar Loader
                    const packRes = await getNurseRequestPreBuilded(
                      nurseRequest.id_SolicitudEnfermero,
                      nurseRequest.id_AlmacenSolicitado
                    );
                    createPackage(packRes);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <AddCircleIcon sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
          )}
          {nurseRequest.estatus === 2 && (
            <Tooltip title="Marcar como Entregado">
              <IconButton
                onClick={() => {
                  markAsDelivered(
                    nurseRequest.id_SolicitudEnfermero,
                    nurseRequest.id_AlmacenSolicitado,
                    nurseRequest.id_CuentaPaciente
                  );
                }}
              >
                <MarkunreadMailboxIcon sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
          )}
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
          {nurseRequest.estatus !== 0 && nurseRequest.estatus !== 1 && (
            <Tooltip title="Imprimir solicitud">
              <IconButton
                onClick={() => {
                  setNurseRequest(nurseRequest);
                  setOpenPrint(true);
                }}
              >
                <LocalPrintshopOutlined />
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
