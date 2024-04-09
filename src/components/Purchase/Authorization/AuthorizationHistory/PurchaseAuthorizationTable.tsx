import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
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
import { usePurchaseAuthorizationHistoryPagination } from '../../../../store/purchaseStore/purchaseAuthorizationHistoryPagination';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getProviderQuotePdf } from '../../../../api/api.routes';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast } from 'react-toastify';

const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    fetchPurchaseAuthorization,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    status,
    handleChangePurchaseAuthorization,
  } = usePurchaseAuthorizationHistoryPagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchPurchaseAuthorization: state.fetchPurchaseAuthorization,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangePurchaseAuthorization: state.handleChangePurchaseAuthorization,
      startDate: state.startDate,
      endDate: state.endDate,
      status: state.status,
    }),
    shallow
  );

  useEffect(() => {
    fetchPurchaseAuthorization();
  }, [pageIndex, pageSize, search, enabled, handleChangePurchaseAuthorization, startDate, endDate, status]);

  return {
    isLoading,
    data,
    enabled,
    count,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  };
};

const handleOpenPdf = async (quoteId: string) => {
  try {
    const pdfRes = await getProviderQuotePdf(quoteId);
    if (pdfRes === '') return toast.warning('Esta orden no cuenta con cotización');
    const pdfWindow = window.open('', '_blank');
    pdfWindow?.document.write("<embed width='100%' height='100%' src='" + encodeURI(pdfRes) + "'/>");
  } catch (error) {
    console.log(error);
  }
};

export const PurchaseAuthorizationTable = () => {
  const { data, count, isLoading, pageIndex, pageSize, setPageSize } = useGetAllData();
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Solicitud de Compra</TableCell>
              <TableCell>Creado por</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha de Solicitud</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha de Autorización</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
                ? null
                : data.map((auth) => (
                    <React.Fragment key={auth.id_SolicitudCompra}>
                      <TableRow>
                        <TableCell>
                          {!viewArticles[auth.id_SolicitudCompra] ? (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewArticles({
                                  [auth.id_SolicitudCompra]: !viewArticles[auth.id_SolicitudCompra],
                                });
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewArticles({
                                  [auth.id_SolicitudCompra]: !viewArticles[auth.id_SolicitudCompra],
                                });
                              }}
                            >
                              <ExpandLessIcon />
                            </IconButton>
                          )}
                          {auth.folio}
                        </TableCell>
                        <TableCell>{auth.usuarioSolicitado}</TableCell>
                        <TableCell>
                          {auth.solicitudProveedor.map((i) => (
                            <Chip key={i.proveedor.id_Proveedor} label={i.proveedor.nombre} />
                          ))}
                        </TableCell>
                        <TableCell>{auth.fechaSolicitud.split('T')[0]}</TableCell>
                        <TableCell>${auth.precioSolicitud}</TableCell>
                        <TableCell>
                          {auth.fechaAutorizacion == null ? null : auth.fechaAutorizacion.split('T')[0]}
                        </TableCell>
                        <TableCell>
                          {auth.habilitado == true ? 'Solicitud Autorizada' : 'Solicitud Rechazada'}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Ver Cotización">
                            <IconButton
                              size="small"
                              sx={{ color: 'neutral.700' }}
                              onClick={() => {
                                handleOpenPdf(auth.solicitudProveedor[0].id);
                              }}
                            >
                              <RemoveRedEyeIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableCell colSpan={7} sx={{ p: 0 }}>
                        <Collapse in={viewArticles[auth.id_SolicitudCompra]}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Articulo</TableCell>
                                <TableCell align="center">Cantidad</TableCell>
                                <TableCell align="center">P. Unitario</TableCell>
                                <TableCell align="center">P. Total</TableCell>
                              </TableRow>
                            </TableHead>
                            {auth.solicitudProveedor[0].solicitudCompraArticulos.map((request) => (
                              <TableBody key={request.id}>
                                <TableRow>
                                  <TableCell align="center">{request.articulo.nombre}</TableCell>
                                  <TableCell align="center">{request.cantidadCompra}</TableCell>
                                  <TableCell align="center"> {request.precioProveedor} </TableCell>
                                  <TableCell align="center">
                                    {' '}
                                    {request.cantidadCompra * request.precioProveedor}{' '}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            ))}
                          </Table>
                        </Collapse>
                      </TableCell>
                    </React.Fragment>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isLoading && (
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {data.length === 0 && !isLoading && (
        <Card
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            columnGap: 1,
          }}
        >
          <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
            No existen registros
          </Typography>
        </Card>
      )}
      <TablePagination
        component="div"
        count={count}
        onPageChange={() => {}}
        onRowsPerPageChange={(e: any) => {
          setPageSize(e.target.value);
        }}
        page={pageIndex}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
      />
    </>
  );
};
