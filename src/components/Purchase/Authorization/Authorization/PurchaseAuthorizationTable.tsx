import React, { useCallback, useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  ClickAwayListener,
  Stack,
  Modal,
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
import { usePurchaseAuthorizationPagination } from '../../../../store/purchaseStore/purchaseAuthorizationPagination';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Swal from 'sweetalert2';
import { changePurchaseStatus } from '../../../../api/api.routes';
import { StatusPurchaseRequest } from '../../../../types/types';
import { Checklist, Info } from '@mui/icons-material';
import { MatchProvidersAndArticles } from './Modal/MatchProvidersAndArticles';
import { useMatchProvidersAndArticles } from '../../../../store/purchaseStore/matchProvidersAndArticles';
import { primary, error, warning } from '../../../../theme/colors';
import { getProviderQuotePdf } from '../../../../api/api.routes';
import { ProviderNameChip } from '../../PurchaseRequest/ProviderNameChip';
import { Mensaje } from './Modal/Mensaje';
import { SortComponent } from '../../../Commons/SortComponent';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';

const acceptPurchaseAuthorization = (Id_SolicitudCompra: string, Mensaje: string = 'Aceptada') => {
  const { fetchPurchaseAuthorization } = usePurchaseAuthorizationPagination.getState();
  Swal.fire({
    icon: 'warning',
    title: 'Advertencia',
    text: 'Seleccione una de las siguientes opciones para la solicitud de compra.',
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: 'Salir',
    denyButtonText: 'Autorizar compra',
    confirmButtonText: 'Solicitar licitación',
    confirmButtonColor: warning.main,
    denyButtonColor: primary.main,
    cancelButtonColor: error.main,
    reverseButtons: true,
    customClass: {
      container: 'swal-container',
    },
  }).then(async (result) => {
    try {
      if (result.isConfirmed) {
        await changePurchaseStatus(Id_SolicitudCompra, 3, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire('Compra enviada a licitación!', '', 'success');
      } else if (result.isDenied) {
        await changePurchaseStatus(Id_SolicitudCompra, 6, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire('Compra aprobada correctamente!', '', 'success');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error al autorizar la compra!', '', 'error');
    }
  });
};

export const declinePurchaseAuthorization = async (Id_SolicitudCompra: string, Mensaje: string = 'Rechazada') => {
  try {
    await changePurchaseStatus(Id_SolicitudCompra, 0, Mensaje);
    const { fetchPurchaseAuthorization } = usePurchaseAuthorizationPagination.getState();
    await fetchPurchaseAuthorization();
  } catch (error) {
    console.error('Error al rechazar la orden:', error);
  }
};

export const PurchaseAuthorizationTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [folio, setFolio] = useState('');
  const [viewPdf, setViewPdf] = useState(false);
  const [pdfOpen, setPdfOpen] = useState('');
  const [openMensajeModal, setOpenMensajeModal] = useState(false);
  const [purchaseRequestId, setPurchaseRequestId] = useState('');
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
    handleChangePurchaseAuthorization,
    setSort,
    sort,
  } = usePurchaseAuthorizationPagination(
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
      setSort: state.setSort,
      sort: state.sort,
    }),
    shallow
  );

  useEffect(() => {
    fetchPurchaseAuthorization();
  }, [pageIndex, pageSize, search, enabled, handleChangePurchaseAuthorization, sort]);

  const handlePageChange = useCallback((event: any, value: any) => {
    event.stopPropagation();
    setPageIndex(value);
  }, []);

  useEffect(() => {
    if (openModal) return;
    useMatchProvidersAndArticles.setState({
      formattedData: null,
      purchaseOrderMatched: null,
    });
  }, [openModal]);

  const handleOpenPdf = async (quoteId: string) => {
    try {
      const pdfRes = await getProviderQuotePdf(quoteId);
      if (pdfRes === '') return toast.warning('Esta orden no cuenta con cotización');
      setPdfOpen(pdfRes as string);
      setViewPdf(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card sx={{ m: 2 }}>
        <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <SortComponent tableCellLabel="Folio de Solicitud" headerName="folio" setSortFunction={setSort} />
                </TableCell>
                <TableCell>
                  <SortComponent tableCellLabel="Solicitado Por" headerName="nombreUsuario" setSortFunction={setSort} />
                </TableCell>
                <TableCell>
                  <SortComponent tableCellLabel="Proveedor" headerName="proveedor" setSortFunction={setSort} />
                </TableCell>
                <TableCell>
                  <SortComponent
                    tableCellLabel="Fecha de Solicitud"
                    headerName="fechaSolicitud"
                    setSortFunction={setSort}
                  />
                </TableCell>
                <TableCell>
                  <SortComponent tableCellLabel="Total" headerName="total" setSortFunction={setSort} />
                </TableCell>
                <TableCell>
                  <SortComponent tableCellLabel="Estatus" headerName="estatus" setSortFunction={setSort} />
                </TableCell>
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
                            <ProviderNameChip
                              provider={auth.solicitudProveedor?.map((p) => {
                                return {
                                  id: p.proveedor.id_Proveedor,
                                  name: p.proveedor.nombre,
                                };
                              })}
                            />
                          </TableCell>
                          <TableCell>{auth.fechaSolicitud.split('T')[0]}</TableCell>
                          <TableCell>${auth.precioSolicitud}</TableCell>
                          <TableCell>{StatusPurchaseRequest[auth.estatus]}</TableCell>
                          <TableCell>
                            {StatusPurchaseRequest[auth.estatus] === 'Cancelado' ? (
                              <Tooltip title={<Typography variant="body1">{auth.notas}</Typography>}>
                                <Info sx={{ color: 'gray' }} />
                              </Tooltip>
                            ) : StatusPurchaseRequest[auth.estatus] === 'Selección de productos por proveedor' ? (
                              <Tooltip title="Seleccionar los productos con el proveedor">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    useMatchProvidersAndArticles.setState({
                                      purchaseRequestData: auth,
                                    });
                                    setFolio(auth.folio);
                                    setOpenModal(true);
                                  }}
                                >
                                  <Checklist />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <>
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
                                <Tooltip title="Aceptar">
                                  <IconButton
                                    size="small"
                                    sx={{ color: 'neutral.700' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptPurchaseAuthorization(auth.id_SolicitudCompra);
                                    }}
                                  >
                                    <CheckIcon sx={{ color: 'green' }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Rechazar">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPurchaseRequestId(auth.id_SolicitudCompra);
                                      setOpenMensajeModal(true);
                                    }}
                                  >
                                    <CloseIcon sx={{ color: 'red' }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={(viewArticles && viewArticles[auth.id_SolicitudCompra]) || false}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Articulo</TableCell>
                                  <TableCell align="center">Cantidad</TableCell>
                                  <TableCell align="center">P. Unitario</TableCell>
                                  <TableCell align="center">P. Total</TableCell>
                                </TableRow>
                              </TableHead>
                              {(auth?.solicitudProveedor
                                ? auth?.solicitudProveedor[0]?.solicitudCompraArticulos
                                : []
                              ).map((request) => (
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
            <ErrorOutlineIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
            <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
              No existen registros
            </Typography>
          </Card>
        )}
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          onRowsPerPageChange={(e: any) => {
            setPageSize(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página"
        />
      </Card>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <MatchProvidersAndArticles setOpen={setOpenModal} folio={folio} />
        </div>
      </Modal>
      <Modal open={openMensajeModal} onClose={() => setOpenMensajeModal(false)}>
        <>
          <Mensaje
            moduleApi="Compras_AutorizacionCancelada"
            open={() => setOpenMensajeModal(false)}
            idSolicitudCompra={purchaseRequestId}
          />
        </>
      </Modal>
      <Modal open={viewPdf} onClose={() => setViewPdf(false)}>
        <Stack
          sx={{
            display: 'flex',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setViewPdf(false)}>
              <Close />
            </IconButton>
          </Box>
          <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={() => setViewPdf(false)}>
            <Box
              sx={{
                display: 'flex',
                flex: 10,
                mx: 7,
                mb: 3,
              }}
            >
              <embed
                src={pdfOpen}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </Box>
          </ClickAwayListener>
        </Stack>
      </Modal>
    </>
  );
};
