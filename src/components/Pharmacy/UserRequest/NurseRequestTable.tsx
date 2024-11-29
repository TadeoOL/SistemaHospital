import {
  Box,
  Button,
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ExpandLess, ExpandMore, FilterListOff, Info, KeyboardReturn } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import { useNurseRequestPaginationStore } from '../../../store/pharmacy/nurseRequest/nurseRequestPagination';
import { SearchBar } from '../../Inputs/SearchBar';
import { NurseRequestModal } from './Modal/NurseRequestModal';
import { InurseRequest, IArticleInRequest } from '../../../types/types';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { getStatus } from '../../../utils/NurseRequestUtils';
import { useGetPharmacyConfig } from '../../../hooks/useGetPharmacyConfig';
import { NurseRequestReturnModal } from './Modal/NurseRequestReturnModal ';

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
  const { data: warehousePharmacyData, isLoading: isLoadingWarehouse } = useGetPharmacyConfig();

  /*useEffect(() => {
    //clearAllData();
    //setWarehouseId(warehouseData.id);
    setPrincipalWarehouseId(warehouseData.id_AlmacenPrincipal || '');
  }, []);*/

  useEffect(() => {
    if(warehousePharmacyData.id_Almacen){
      fetchData(warehousePharmacyData.id_Almacen);
    }
  }, [search, startDate, endDate, clearFilters, isLoadingWarehouse,/* sort,*/ pageSize, pageIndex]);
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
  };
};
export const NurseRequestTable = () => {
  // const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
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
  } = useGetNursesRequest();
  const [openModal, setOpenModal] = useState(false);
  const [openModalReturn, setOpenModalReturn] = useState(false);
  const { data: warehousePharmacyData } = useGetPharmacyConfig();
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
              <Button
                sx={{ minWidth: 220 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenModal(!openModal)}
              >
                Solicitud de Articulos
              </Button>
              <Button
                sx={{ minWidth: 220 }}
                variant="contained"
                startIcon={<KeyboardReturn />}
                onClick={() => setOpenModalReturn(!openModalReturn)}
              >
                Devolución de Articulos
              </Button>
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
                      <TableCell>Almacén Solicitado</TableCell>
                      <TableCell>Entregado Por</TableCell>
                      <TableCell>Estatus</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.map((request) => (
                        <TableRowComponent nurseRequest={request} key={request.id_CuentaEspacioHospitalario} />
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
                        No hay solicitudes existentes
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
      <Modal open={openModal} onClose={() => setOpenModal(!openModal)}>
        <>
          <NurseRequestModal
            setOpen={setOpenModal}
            refetch={fetchData}
            warehouseId={warehousePharmacyData.id_Almacen}
          />
        </>
      </Modal>
      <Modal open={openModalReturn} onClose={() => setOpenModalReturn(!openModalReturn)}>
        <>
          <NurseRequestReturnModal
            setOpen={setOpenModalReturn}
            refetch={fetchData}
            warehouseId={warehousePharmacyData.id_Almacen}
          />
        </>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  nurseRequest: InurseRequest;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ nurseRequest }) => {
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
        <TableCell>{nurseRequest.paciente}</TableCell>
        <TableCell>{nurseRequest.espacioHospitalario}</TableCell>
        <TableCell>{nurseRequest.usuarioSolicitante}</TableCell>
        <TableCell>{nurseRequest.almacen}</TableCell>
        <TableCell>{nurseRequest.usuarioAutorizo ? nurseRequest.usuarioAutorizo : ''}</TableCell>
        <TableCell>{getStatus(nurseRequest.estatus)}</TableCell>
        <TableCell>
          {/*<Tooltip title={'Editar stock mínimo'}>
            <IconButton
              onClick={() => {
                setOpenModalBuild(true);
                setNurseRequest(nurseRequest);
                if (isEditing) {
                  handleSaveValue();
                }
                setIsEditing(!isEditing);
                setIsEditingSubRow(!isEditingSubRow);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          */}

          <Tooltip title="Imprimir">
            <IconButton
              onClick={() => {
                /*setOpen(true);
                setOpenNewLote(true);
                setIsEditingSubRow(true);
                */
              }}
            >
              <LocalPrintshopOutlinedIcon />
            </IconButton>
          </Tooltip>
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
