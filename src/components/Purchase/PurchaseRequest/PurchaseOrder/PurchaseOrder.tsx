import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
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
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import React, { useEffect, useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { SearchBar } from '../../../Inputs/SearchBar';
import { StatusPurchaseOrder } from '../../../../types/types';
import { changeOrderStatus } from '../../../../api/api.routes';
import { usePurchaseOrderPagination } from '../../../../store/purchaseStore/purchaseOrderPagination';
import { useArticlesAlertPagination } from '../../../../store/purchaseStore/articlesAlertPagination';
import { QuoteModal } from './Modal/QuoteModal';
import { OrderModal } from './Modal/OrderModal';
import Swal from 'sweetalert2';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Assignment, CheckCircle, Info } from '@mui/icons-material';
// import { useAuthStore } from '../../../../store/auth';
// import { useShallow } from 'zustand/react/shallow';
import { useDirectlyPurchaseRequestOrderStore } from '../../../../store/purchaseStore/directlyPurchaseRequestOrder';
import { ProviderNameChip } from '../ProviderNameChip';
import { ArticlesEntry } from './Modal/ArticlesEntry';
import { SortComponent } from '../../../Commons/SortComponent';
import { UpdateDirectlyPurchaseOrder } from '../Modal/DirectlyPurchaseOrderPackage';
import { useGetAllProviders } from '../../../../hooks/useGetAllProviders';

const handleRemoveOrder = async (Id_OrdenCompra: string) => {
  Swal.fire({
    title: 'Advertencia',
    text: '¿Desea cancelar la orden de compra?, este cambio no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Salir',
    confirmButtonText: 'Aceptar',
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await changeOrderStatus(Id_OrdenCompra, 0, 'Cancelada');
        usePurchaseOrderPagination.getState().fetch();
        Swal.fire({
          title: 'Cancelada!',
          text: 'Tu orden de compra ha sido cancelada!',
          icon: 'success',
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al cancelar la orden!',
          icon: 'error',
        });
      }
    }
  });
};

export const PurchaseOrder = () => {
  // const isAdminPurchase = useAuthStore(useShallow((state) => state.isAdminPurchase));
  const [openQuoteModal, setOpenQuoteModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openUpdateOrderModal, setOpenUpdateOrderModal] = useState(false);
  const [openArticlesEntry, setOpenArticlesEntry] = useState(false);
  const [orderSelectedId, setOrderSelectedId] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [orderSelected, setOrderSelected] = useState<{
    folio: string;
    OrderId: string;
  }>({ folio: '', OrderId: '' });
  const [providersForEdition, setProvidersForEdition] = useState<string[]>([]);
  const [articlesForEdition, setArticlesForEdition] = useState<any>([]);
  const { openPurchaseRequestOrder } = useDirectlyPurchaseRequestOrderStore((state) => ({
    openPurchaseRequestOrder: state.openPurchaseRequestOrder,
  }));

  const {
    isLoading,
    data,
    count,
    setPageIndex,
    setPageSize,
    search,
    pageIndex,
    pageSize,
    setSearch,
    fetch,
    handleChange,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setSort,
    sort,
  } = usePurchaseOrderPagination((state) => ({
    isLoading: state.isLoading,
    data: state.data,
    count: state.count,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
    search: state.search,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    setSearch: state.setSearch,
    fetch: state.fetch,
    handleChange: state.handleChange,
    status: state.status,
    setStatus: state.setStatus,
    startDate: state.startDate,
    setStartDate: state.setStartDate,
    endDate: state.endDate,
    setEndDate: state.setEndDate,
    sort: state.sort,
    setSort: state.setSort,
  }));

  useEffect(() => {
    if (openPurchaseRequestOrder) return;
    useArticlesAlertPagination.setState({
      step: 0,
      checkedArticles: [],
    });
  }, [openPurchaseRequestOrder]);
  useEffect(() => {}, []);
  useGetAllProviders();

  const values = useMemo(() => {
    const statusPurchaseOrderValues: string[] = [];

    for (const value in StatusPurchaseOrder) {
      if (!isNaN(Number(StatusPurchaseOrder[value]))) {
        statusPurchaseOrderValues.push(StatusPurchaseOrder[value]);
      }
    }
    return statusPurchaseOrderValues;
  }, []);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, handleChange, startDate, status, endDate, sort]);

  return (
    <>
      <Stack spacing={2} sx={{ p: 2, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
          <SearchBar
            title="Buscar orden de compra..."
            searchState={setSearch}
            sx={{ display: 'flex', flex: 2 }}
            size="small"
          />
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <TextField
              label="Fecha inicio"
              size="small"
              type="date"
              value={startDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                console.log(e.target.value);
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
          </Box>
          <Box sx={{ display: 'flex', flex: 1 }}>
            <TextField
              select
              label="Estatus"
              size="small"
              fullWidth
              value={status}
              onChange={(e) => {
                const { value } = e.target;
                setStatus(value);
              }}
            >
              {values.map((v: any) => (
                <MenuItem key={v} value={v}>
                  {StatusPurchaseOrder[v]}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <IconButton onClick={() => usePurchaseOrderPagination.getState().clearFilters()}>
              <FilterListOffIcon />
            </IconButton>
          </Box>
        </Box>
        <Card sx={{ minWidth: { xs: 950, xl: 0 } }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <SortComponent tableCellLabel="Orden de Compra" headerName="folio" setSortFunction={setSort} />
                  </TableCell>
                  <TableCell>
                    <SortComponent tableCellLabel="Creado por" headerName="creadoPor" setSortFunction={setSort} />
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
                {data && data.length === 0
                  ? null
                  : isLoading
                    ? null
                    : data.map((order) => (
                        <React.Fragment key={order.id_OrdenCompra}>
                          <TableRow>
                            <TableCell>
                              {!viewArticles[order.id_OrdenCompra] ? (
                                <IconButton
                                  onClick={() =>
                                    setViewArticles({
                                      [order.id_OrdenCompra]: !viewArticles[order.id_OrdenCompra],
                                    })
                                  }
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() =>
                                    setViewArticles({
                                      [order.id_OrdenCompra]: !viewArticles[order.id_OrdenCompra],
                                    })
                                  }
                                >
                                  <ExpandLessIcon />
                                </IconButton>
                              )}
                              {order.folio_Extension}
                            </TableCell>
                            <TableCell>{order.usuarioSolicitado}</TableCell>
                            <TableCell>
                              <ProviderNameChip
                                provider={[
                                  {
                                    id: order.proveedor.id_Proveedor,
                                    name: order.proveedor.nombre,
                                  },
                                ]}
                              />
                            </TableCell>
                            <TableCell>{order.fechaSolicitud.split('T')[0]}</TableCell>
                            <TableCell>${order.precioTotalOrden}</TableCell>
                            <TableCell>{StatusPurchaseOrder[order.estatus]}</TableCell>
                            <TableCell>
                              {order.estatus === 0 ? (
                                <Tooltip title="Cancelado">
                                  <IconButton>
                                    <Info />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <>
                                  {order.precioTotalOrden < 5000 && (
                                    <Tooltip title="Editar">
                                      <IconButton
                                        onClick={() => {
                                          setOrderSelected({
                                            folio: order.folio_Extension,
                                            OrderId: order.id_OrdenCompra,
                                          });
                                          console.log(order);
                                          console.log(providers);
                                          setOpenUpdateOrderModal(true);
                                          order.proveedor.estatus = order.estatus;
                                          setProviders([order.proveedor]);
                                          setProvidersForEdition([order.proveedor.id_Proveedor]);
                                          setArticlesForEdition(
                                            order.ordenCompraArticulo.map((art) => ({
                                              id: art.id_Articulo,
                                              name: art.nombre,
                                              amount: art.cantidad,
                                              price: art.precioProveedor,
                                              stock: undefined,
                                            }))
                                          );
                                        }}
                                      >
                                        <UploadFileIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {order.estatus === 1 && (
                                    <>
                                      <Tooltip title="Ver orden de compra">
                                        <IconButton
                                          onClick={() => {
                                            setOrderSelected({
                                              folio: order.folio_Extension,
                                              OrderId: order.id_OrdenCompra,
                                            });
                                            setOpenOrderModal(true);
                                          }}
                                        >
                                          <DownloadIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Subir Factura">
                                        <IconButton
                                          onClick={() => {
                                            setOrderSelected({
                                              folio: order.folio_Extension,
                                              OrderId: order.id_OrdenCompra,
                                            });
                                            setOpenQuoteModal(true);
                                            order.proveedor.estatus = order.estatus;
                                            setProviders([order.proveedor]);
                                          }}
                                        >
                                          <UploadFileIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  )}
                                </>
                              )}
                              {order.estatus === 1 && (
                                <Tooltip title="Cancelar">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleRemoveOrder(order.id_OrdenCompra);
                                    }}
                                  >
                                    <CloseIcon sx={{ color: 'red' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {order.estatus === 2 && (
                                <>
                                  <Tooltip title="Ver Factura">
                                    <IconButton
                                      onClick={() => {
                                        setOrderSelected({
                                          folio: order.folio_Extension,
                                          OrderId: order.id_OrdenCompra,
                                        });
                                        setOpenQuoteModal(true);
                                        order.proveedor.estatus = order.estatus;
                                        setProviders([order.proveedor]);
                                      }}
                                    >
                                      <UploadFileIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Entrada de artículos">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setOrderSelectedId(order.id_OrdenCompra);
                                        setOpenArticlesEntry(true);
                                      }}
                                    >
                                      <Assignment />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              {order.estatus === 3 && (
                                <Tooltip title="Artículos dados de alta en almacen">
                                  <CheckCircle sx={{ color: 'green' }} />
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={7} sx={{ p: 0 }}>
                              <Collapse in={viewArticles[order.id_OrdenCompra]}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell align="center">Articulo</TableCell>
                                      <TableCell align="center">Cantidad</TableCell>
                                      <TableCell align="center">Precio</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.ordenCompraArticulo.map((orderArticle) => (
                                      <TableRow key={orderArticle.id_OrdenCompraArticulo}>
                                        <TableCell align="center">{orderArticle.nombre}</TableCell>
                                        <TableCell align="center">{orderArticle.cantidad}</TableCell>
                                        <TableCell align="center">{orderArticle.precioProveedor}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
              </TableBody>
            </Table>
            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  p: 4,
                }}
              >
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
                <RemoveCircleIcon sx={{ color: 'neutral.400', width: '40px', height: '40px' }} />
                <Typography sx={{ color: 'neutral.400' }} fontSize={24} fontWeight={500}>
                  No existen registros
                </Typography>
              </Card>
            )}
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
      <Modal open={openOrderModal} onClose={() => setOpenOrderModal(false)}>
        <>
          <OrderModal purchaseData={orderSelected} open={setOpenOrderModal} />
        </>
      </Modal>

      <Modal open={openQuoteModal} onClose={() => setOpenQuoteModal(false)}>
        <>
          <QuoteModal idFolio={orderSelected} open={setOpenQuoteModal} providers={providers} />
        </>
      </Modal>
      <Modal
        open={openArticlesEntry}
        onClose={() => {
          setOpenArticlesEntry(false);
        }}
      >
        <>
          <ArticlesEntry setOpen={setOpenArticlesEntry} orderId={orderSelectedId} />
        </>
      </Modal>
      <Modal open={openUpdateOrderModal} onClose={() => setOpenUpdateOrderModal(false)}>
        <>
          <UpdateDirectlyPurchaseOrder
            setOpen={setOpenUpdateOrderModal}
            initialProvidersFromOrder={providersForEdition}
            initialArticles={articlesForEdition}
          />
        </>
      </Modal>
    </>
  );
};
