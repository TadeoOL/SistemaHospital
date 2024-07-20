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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Cancel, Info } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
//import { useNurseRequestPaginationStore } from '../../../store/pharmacy/nurseRequest/nurseRequestPagination';
//import { SearchBar } from '../../Inputs/SearchBar';
//import { NurseRequestModal } from './Modal/NurseRequestModal';
//import { InurseRequest, IArticleInRequest } from '../../../types/types';
//import { SearchBar } from '../../../Inputs/SearchBar';
import { IXRayRequest, REQUEST_TYPES } from '../../../../types/hospitalizationTypes';
import { useXRayRequestPaginationStore } from '../../../../store/hospitalization/xrayRequestPagination';
import { getStatus } from '../../../../utils/XRayRequestUtils';
import { SearchBar } from '../../../Inputs/SearchBar';
import { AddXRayRequestModal } from './Modal/AddXRayRequest';
import { formatDate } from '../../../../utils/pointOfSaleUtils';
import Swal from 'sweetalert2';
import { modifyXRayRequest } from '../../../../services/hospitalization/xrayService';

export const useGetNursesRequest = () => {
  const {
    data,
    setSearch,
    search,
    fetchData,
    //setStartDate,
    //setEndDate,
    setPageIndex,
    setPageSize,
    //clearFilters,
    pageSize,
    //startDate,
    //endDate,
    isLoading,
    pageIndex,
    count,
  } = useXRayRequestPaginationStore(
    (state) => ({
      pageIndex: state.pageIndex,
      count: state.count,
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchData: state.fetchData,
      //setStartDate: state.setStartDate,
      //setEndDate: state.setEndDate,
      //clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
      pageSize: state.pageSize,
      //startDate: state.startDate,
      //endDate: state.endDate,
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
    fetchData(true);
  }, [search, /*startDate, endDate, clearFilters, /* sort,*/ pageSize, pageIndex]);
  return {
    data,
    setSearch,
    //setStartDate,
    //setEndDate,
    //clearFilters,
    setPageIndex,
    setPageSize,
    //startDate,
    //endDate,
    isLoading,
    //setSort,
    pageSize,
    pageIndex,
    count,
    fetchData,
  };
};
export const XRayRequestTable = () => {
  // const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const {
    data,
    setSearch,
    //setEndDate,
    //setStartDate,
    //clearFilters,
    setPageIndex,
    setPageSize,
    //startDate,
    //endDate,
    isLoading,
    //setSort,
    pageSize,
    pageIndex,
    count,
    fetchData,
  } = useGetNursesRequest();
  const [openModal, setOpenModal] = useState(false);

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
              {/*<TextField
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
              </IconButton>*/}
              <Button
                sx={{ minWidth: 220 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenModal(!openModal)}
              >
                Solicitar Electrocardiograma
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
                      <TableCell>Enfermero</TableCell>
                      <TableCell>Tipo Radiografía</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Fecha Solicitud</TableCell>
                      <TableCell>Estatus</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data &&
                      data.map((request: IXRayRequest) => (
                        <TableRowComponent nurseRequest={request} key={request.id} />
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
                        No hay solicitudes
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
          <AddXRayRequestModal setOpen={setOpenModal} refetch={fetchData} />
        </>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  nurseRequest: IXRayRequest;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ nurseRequest }) => {
  const fetch = useXRayRequestPaginationStore((state) => state.fetchData);

  const rejectRequest = (Id_Request: string) => {
    Swal.fire({
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
        return modifyXRayRequest({
          Id_SolicitudRadiografia: Id_Request,
          Estatus: 0,
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        fetch(true);
        Swal.fire({
          title: 'Éxito!',
          text: 'Salida cancelada',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'No se cancelo la salida',
          icon: 'info',
        });
      }
    });
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{nurseRequest.folio}</TableCell>
        <TableCell>{nurseRequest.nombrePaciente}</TableCell>
        <TableCell>{nurseRequest.nombreSolicitante}</TableCell>
        <TableCell>{nurseRequest.nombre}</TableCell>
        <TableCell>{nurseRequest.precio}</TableCell>
        <TableCell>{formatDate(nurseRequest.fechaSolicitud)}</TableCell>
        <TableCell>{getStatus(nurseRequest.estatus)}</TableCell>
        <TableCell>{REQUEST_TYPES[nurseRequest.tipo]}</TableCell>
        <TableCell>
          {
            <Tooltip title="Cancelar solicitud">
              <IconButton
                onClick={() => {
                  rejectRequest(nurseRequest.id);
                }}
              >
                <Cancel sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          }
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
