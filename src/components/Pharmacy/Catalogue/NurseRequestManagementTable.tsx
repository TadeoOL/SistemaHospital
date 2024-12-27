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
import { Cancel, ExpandLess, ExpandMore, FilterListOff, Info, LocalPrintshopOutlined, Undo } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useNurseRequestPaginationStore } from '../../../store/pharmacy/nurseRequest/nurseRequestPagination';
import {
  IArticleInRequest,
  IarticlesPrebuildedRequest,
  InurseRequest,
  IWarehouseData,
  NurseRequestType,
} from '../../../types/types';
import { SearchBar } from '../../Inputs/SearchBar';
import { RequestBuildingModal } from '../UserRequest/Modal/RequestBuildingModal';
import { buildPackage, getPackagePreBuilded } from '../../../api/api.routes';
import { getStatus } from '../../../utils/NurseRequestUtils';
import { SortComponent } from '../../Commons/SortComponent';
import { HeaderModal } from '../../Account/Modals/SubComponents/HeaderModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { NurseRequestReport } from '../../Export/Pharmacy/NurseRequestReport';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { generateNurseRequestPDF } from './pdfs/generateNurseRequestPDF';

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
  const [openModalBuildDevolution, setOpenModalBuildDevolution] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const [nurseRequest, setNurseRequest] = useState<InurseRequest | null>(null);
  const [prebuildedArticles, setPrebuildedArticles] = useState<IarticlesPrebuildedRequest[] | null>(null);
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  //setWarehouseId
  useEffect(() => {
    fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
  }, [status]);

  const rejectRequest = (id_SolicitudAlmacen: string, id_CuentaEspacioHospitalario: string) => {
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

  const markAsDelivered = (id_SolicitudAlmacen: string, id_CuentaEspacioHospitalario: string) => {
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
          return buildPackage({
            estatus: 3,
            id_SolicitudAlmacen: id_SolicitudAlmacen,
            id_CuentaEspacioHospitalario: id_CuentaEspacioHospitalario,
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

  const acceptReturn = (id_SolicitudAlmacen: string, id_CuentaEspacioHospitalario: string) => {
    withReactContent(Swal)
      .fire({
        title: 'Confirmación',
        text: `¿Seguro que deseas aceptar la devolución de articulos?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        confirmButtonColor: 'green',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return buildPackage({
            estatus: 4,
            id_SolicitudAlmacen: id_SolicitudAlmacen,
            id_CuentaEspacioHospitalario: id_CuentaEspacioHospitalario,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
          withReactContent(Swal).fire({
            title: 'Éxito!',
            text: 'Devolución aceptada',
            icon: 'success',
          });
        } else {
          withReactContent(Swal).fire({
            title: 'No se acepto la devolución',
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
                        <SortComponent
                          tableCellLabel={status == 1 ? 'Armado Por' : 'Entregado/Cancelado Por'}
                          headerName="entregadoPor"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>Tipo Solicitud</TableCell>
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
                          setOpenModalBuildDevolution={setOpenModalBuildDevolution}
                          setOpenPrint={setOpenPrint}
                          setNurseRequest={setNurseRequest}
                          setPrebuildedArticles={setPrebuildedArticles}
                          markAsDelivered={
                            request.tipoSolicitud == NurseRequestType[2] ? markAsDelivered : acceptReturn
                          }
                          key={request.id_SolicitudAlmacen}
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
            preLoadedArticles={prebuildedArticles ?? ([] as IarticlesPrebuildedRequest[])}
            id_SolicitudAlmacen={nurseRequest?.id_SolicitudAlmacen ?? ''}
            id_CuentaEspacioHospitalario={nurseRequest?.id_CuentaEspacioHospitalario ?? ''}
            devolutionFlag={false}
          />
        </>
      </Modal>
      <Modal open={openModalBuildDevolution} onClose={() => setOpenModalBuildDevolution(!openModalBuildDevolution)}>
        <>
          <RequestBuildingModal
            setOpen={setOpenModalBuildDevolution}
            refetch={() => {
              fetchData(warehouseSL?.id_Almacen ?? warehouseIdSeted);
            }}
            request={nurseRequest as InurseRequest}
            preLoadedArticles={prebuildedArticles ?? ([] as IarticlesPrebuildedRequest[])}
            id_SolicitudAlmacen={nurseRequest?.id_SolicitudAlmacen ?? ''}
            id_CuentaEspacioHospitalario={nurseRequest?.id_CuentaEspacioHospitalario ?? ''}
            devolutionFlag
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
  setOpenModalBuildDevolution: Function;
  setOpenPrint: Function;
  setNurseRequest: Function;
  setPrebuildedArticles: Function;
  rejectRequest: Function;
  markAsDelivered: Function;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({
  nurseRequest,
  setOpenModalBuild,
  setOpenModalBuildDevolution,
  setNurseRequest,
  setPrebuildedArticles,
  rejectRequest,
  markAsDelivered,
}) => {
  const [open, setOpen] = useState(false);

  const createPackage = (request: IarticlesPrebuildedRequest[]) => {
    setPrebuildedArticles(request);
    setNurseRequest(nurseRequest);
    setOpenModalBuild(true);
  };

  const createPackageDevolution = (request: IarticlesPrebuildedRequest[]) => {
    const dataFormated: IarticlesPrebuildedRequest[] = request.map((art) => ({
      ...art,
      cantidadSeleccionada: art.cantidadSolicitada * -1,
      cantidadSolicitada: art.cantidadSolicitada * -1,
    }));
    setPrebuildedArticles(dataFormated);
    setNurseRequest(nurseRequest);
    setOpenModalBuildDevolution(true);
  };

  //setOpenModalBuildDevolution

  const handlePrintNurseRequest = (row: any) => {
    return () => generateNurseRequestPDF(row);
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
        <TableCell>{nurseRequest.paciente}</TableCell>
        <TableCell>{nurseRequest.espacioHospitalario}</TableCell>
        <TableCell>{nurseRequest.usuarioSolicitante}</TableCell>
        <TableCell>{nurseRequest.usuarioAutorizo}</TableCell>
        <TableCell>{nurseRequest.tipoSolicitud}</TableCell>
        <TableCell>{getStatus(nurseRequest.estatus)}</TableCell>
        <TableCell>
          {nurseRequest.estatus === 1 && nurseRequest.tipoSolicitud == NurseRequestType[2] && (
            <Tooltip title={'Armar solicitud'}>
              <IconButton
                onClick={async () => {
                  try {
                    //Agregar Loader
                    const packRes = await getPackagePreBuilded(nurseRequest.id_SolicitudAlmacen);
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
          {nurseRequest.estatus === 1 && nurseRequest.tipoSolicitud == NurseRequestType[6] && (
            <Tooltip title="Aceptar devolución">
              <IconButton
                onClick={async () => {
                  try {
                    //Agregar Loader
                    const packRes = await getPackagePreBuilded(nurseRequest.id_SolicitudAlmacen);
                    createPackageDevolution(packRes);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Undo sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
          )}
          {nurseRequest.estatus === 1 && nurseRequest.tipoSolicitud == NurseRequestType[8] && (
            <Tooltip title="Aceptar devolución">
              <IconButton
                onClick={() => {
                  markAsDelivered(nurseRequest.id_SolicitudAlmacen, nurseRequest.id_CuentaEspacioHospitalario);
                }}
              >
                <Undo sx={{ color: 'green' }} />
              </IconButton>
            </Tooltip>
          )}
          {nurseRequest.estatus === 2 && (
            <Tooltip title="Marcar como Entregado">
              <IconButton
                onClick={() => {
                  markAsDelivered(nurseRequest.id_SolicitudAlmacen, nurseRequest.id_CuentaEspacioHospitalario);
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
                  rejectRequest(nurseRequest.id_SolicitudAlmacen, nurseRequest.id_CuentaEspacioHospitalario);
                }}
              >
                <Cancel sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          )}
          {nurseRequest.estatus !== 0 && nurseRequest.estatus !== 1 && (
            <Tooltip title="Imprimir solicitud">
              <IconButton onClick={handlePrintNurseRequest(nurseRequest)}>
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
