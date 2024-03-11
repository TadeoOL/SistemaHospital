import {
  Box,
  Card,
  Chip,
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
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { changePurchaseStatus } from "../../../../api/api.routes";
import { usePurchaseOrderRequestPagination } from "../../../../store/purchaseStore/purchaseOrderRequestPagination";
import Swal from "sweetalert2";
import { SearchBar } from "../../../Inputs/SearchBar";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { PurchaseOrderModal } from "./Modal/PurchaseOrderModal";
import { ProviderQuoteModal } from "./Modal/ProviderQuoteModal";
import {
  IPurchaseAuthorization,
  StatusPurchaseRequest,
} from "../../../../types/types";
import { usePurchaseOrderRequestModals } from "../../../../store/purchaseStore/purchaseOrderRequestModals";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AddMoreProviders } from "./Modal/AddMoreProviders";
import { primary, error } from "../../../../theme/colors";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { MatchPrices } from "./Modal/MatchPrices";
import { useDirectlyPurchaseRequestOrderStore } from "../../../../store/purchaseStore/directlyPurchaseRequestOrder";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { Info } from "@mui/icons-material";

const handleRemoveOrder = async (idOrdenCompra: string) => {
  const { fetch } = usePurchaseOrderRequestPagination.getState();
  Swal.fire({
    title: "Advertencia",
    text: "¿Desea cancelar la solicitud de compra seleccionada?.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: primary.main,
    cancelButtonColor: error.main,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Aceptar",
    reverseButtons: true,
    customClass: {
      container: "swal-container",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await changePurchaseStatus(idOrdenCompra, 0, "Cancelada");
        fetch();
        Swal.fire({
          title: "Operación Exitosa",
          text: "Tu orden de compra ha sido cancelada.",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Error al cancelar la compra, consulte con su administrador.",
          icon: "error",
        });
      }
    }
  });
};

const useGetAllData = () => {
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
    startDate,
    endDate,
    setStatus,
    setEndDate,
    setStartDate,
  } = usePurchaseOrderRequestPagination((state) => ({
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
    startDate: state.startDate,
    endDate: state.endDate,
    setStatus: state.setStatus,
    setEndDate: state.setEndDate,
    setStartDate: state.setStartDate,
  }));
  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, handleChange, status, startDate, endDate]);
  return {
    isLoading,
    data,
    count,
    setPageIndex,
    setPageSize,
    search,
    pageIndex,
    pageSize,
    setSearch,
    status,
    startDate,
    endDate,
    setStatus,
    setEndDate,
    setStartDate,
  };
};

export const PurchaseOrderRequest = () => {
  const {
    count,
    data,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    setSearch,
    status,
    startDate,
    endDate,
    setStatus,
    setStartDate,
    setEndDate,
  } = useGetAllData();
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openPurchaseOrder, setOpenPurchaseOrder] = useState(false);
  const [openProviderQuote, setOpenProviderQuote] = useState(false);
  const [openAddMoreProviders, setOpenAddMoreProviders] = useState(false);
  const [orderSelected, setOrderSelected] = useState<{
    folio: string;
    purchaseOrderId: string;
  }>({ folio: "", purchaseOrderId: "" });
  const [providers, setProviders] = useState<any[]>([]);
  const [openMatchPrices, setOpenMatchPrices] = useState(false);
  const [orderData, setOrderData] = useState<IPurchaseAuthorization | null>(
    null
  );

  useEffect(() => {
    if (openProviderQuote) return;
    usePurchaseOrderRequestModals.setState({
      step: 0,
      providerSelected: "",
      dataOrderRequest: null,
      precios: {},
      registerOrderPurchase: null,
      provider: null,
    });
  }, [openProviderQuote]);

  useEffect(() => {
    if (openMatchPrices) return;
    useDirectlyPurchaseRequestOrderStore.getState().clearAllStates();
  }, [openMatchPrices]);

  const values = useMemo(() => {
    const statusPurchaseOrderValues: string[] = [];

    for (const value in StatusPurchaseRequest) {
      if (!isNaN(Number(StatusPurchaseRequest[value]))) {
        statusPurchaseOrderValues.push(StatusPurchaseRequest[value]);
      }
    }
    return statusPurchaseOrderValues;
  }, []);

  const returnArticles = useCallback((order: IPurchaseAuthorization) => {
    return order.solicitudProveedor
      .flatMap((p) => p.solicitudCompraArticulos)
      .map((a) => {
        return {
          id: a.articulo.id_Articulo,
          name: a.articulo.nombre,
          price: a.precioProveedor,
          amount: a.cantidadCompra,
        };
      });
  }, []);

  return (
    <>
      <Stack spacing={2} sx={{ p: 2, overflowY: "auto" }}>
        <Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
          <SearchBar
            title="Buscar solicitud de compra..."
            searchState={setSearch}
            sx={{ display: "flex", flex: 2 }}
          />
          <Box sx={{ display: "flex", flex: 1, columnGap: 2 }}>
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
          </Box>
          <Box sx={{ display: "flex", flex: 1 }}>
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
                  {StatusPurchaseRequest[v]}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <IconButton
              onClick={() =>
                usePurchaseOrderRequestPagination.getState().clearFilters()
              }
            >
              <FilterListOffIcon />
            </IconButton>
          </Box>
        </Box>
        <Card sx={{ overflowX: "auto" }}>
          <TableContainer sx={{ minWidth: { xs: 950, xl: 0 } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Solicitud de Compra</TableCell>
                  <TableCell>Creado por</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Fecha de solicitud</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estatus</TableCell>
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
                                onClick={() =>
                                  setViewArticles({
                                    [auth.id_SolicitudCompra]:
                                      !viewArticles[auth.id_SolicitudCompra],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [auth.id_SolicitudCompra]:
                                      !viewArticles[auth.id_SolicitudCompra],
                                  })
                                }
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            {auth.folio}
                          </TableCell>
                          <TableCell>{auth.usuarioSolicitado}</TableCell>
                          <TableCell>
                            {auth.solicitudProveedor.map((i) => (
                              <Chip
                                key={i.proveedor.id_Proveedor}
                                label={i.proveedor.nombre}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            {auth.fechaSolicitud.split("T")[0]}
                          </TableCell>
                          <TableCell>${auth.precioSolicitud}</TableCell>
                          <TableCell>
                            {StatusPurchaseRequest[auth.estatus]}
                          </TableCell>
                          <TableCell>
                            {StatusPurchaseRequest[auth.estatus] ===
                            "Necesita elegir proveedor" ? (
                              <Tooltip title="Seleccionar proveedores">
                                <IconButton
                                  onClick={() => {
                                    setProviders(auth.solicitudProveedor);
                                    setOrderSelected({
                                      folio: auth.folio,
                                      purchaseOrderId: auth.id_SolicitudCompra,
                                    });
                                    setOpenAddMoreProviders(true);
                                  }}
                                >
                                  <PersonAddIcon />
                                </IconButton>
                              </Tooltip>
                            ) : StatusPurchaseRequest[auth.estatus] ===
                              "Solicitud necesita precios" ? (
                              <Tooltip title="Selección de precios">
                                <IconButton
                                  onClick={() => {
                                    setOrderData(auth);
                                    useDirectlyPurchaseRequestOrderStore.setState(
                                      { articles: returnArticles(auth) }
                                    );
                                    setOpenMatchPrices(true);
                                  }}
                                >
                                  <PriceChangeIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              StatusPurchaseRequest[auth.estatus] !==
                                "Selección de productos por proveedor" &&
                              StatusPurchaseRequest[auth.estatus] !==
                                "Cancelado" && (
                                <>
                                  <Tooltip title="Ver orden de compra">
                                    <IconButton
                                      onClick={() => {
                                        setOrderSelected({
                                          folio: auth.folio,
                                          purchaseOrderId:
                                            auth.id_SolicitudCompra,
                                        });
                                        setOpenPurchaseOrder(true);
                                      }}
                                    >
                                      <DownloadIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )
                            )}
                            {auth.solicitudProveedor.length > 1 && (
                              <Tooltip title="Subir Cotización">
                                <IconButton
                                  onClick={() => {
                                    setOrderSelected({
                                      folio: auth.folio,
                                      purchaseOrderId: auth.id_SolicitudCompra,
                                    });
                                    setProviders(auth.solicitudProveedor);
                                    setOpenProviderQuote(true);
                                    usePurchaseOrderRequestModals.setState({
                                      dataOrderRequest: auth,
                                    });
                                  }}
                                >
                                  <UploadFileIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {StatusPurchaseRequest[auth.estatus] !==
                              "Selección de productos por proveedor" &&
                              StatusPurchaseRequest[auth.estatus] !==
                                "Cancelado" && (
                                <Tooltip title="Cancelar">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleRemoveOrder(
                                        auth.id_SolicitudCompra
                                      );
                                    }}
                                  >
                                    <CloseIcon sx={{ color: "red" }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {StatusPurchaseRequest[auth.estatus] ===
                              "Cancelado" && (
                              <Tooltip title={auth?.notas}>
                                <IconButton>
                                  <Info sx={{ color: "gray" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={viewArticles[auth.id_SolicitudCompra]}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Articulo</TableCell>
                                  <TableCell align="center">Cantidad</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {auth.solicitudProveedor[0].solicitudCompraArticulos.map(
                                  (request) => (
                                    <TableRow key={request.id}>
                                      <TableCell align="center">
                                        {request.articulo.nombre}
                                      </TableCell>
                                      <TableCell align="center">
                                        {request.cantidadCompra}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </React.Fragment>
                    ))}
              </TableBody>
            </Table>
            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {data.length === 0 && !isLoading && (
              <Card
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                  columnGap: 1,
                }}
              >
                <RemoveCircleIcon
                  sx={{ color: "neutral.400", width: "40px", height: "40px" }}
                />
                <Typography
                  sx={{ color: "neutral.400" }}
                  fontSize={24}
                  fontWeight={500}
                >
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
            />
          </TableContainer>
        </Card>
      </Stack>
      <Modal
        open={openPurchaseOrder}
        onClose={() => setOpenPurchaseOrder(false)}
      >
        <>
          <PurchaseOrderModal
            purchaseData={orderSelected}
            open={setOpenPurchaseOrder}
          />
        </>
      </Modal>
      <Modal
        open={openProviderQuote}
        onClose={() => setOpenProviderQuote(false)}
      >
        <>
          <ProviderQuoteModal
            idFolio={orderSelected}
            open={setOpenProviderQuote}
            providers={providers}
          />
        </>
      </Modal>
      <Modal
        open={openAddMoreProviders}
        onClose={() => {
          setOpenAddMoreProviders(false);
        }}
      >
        <>
          <AddMoreProviders
            providersData={providers}
            requestPurchaseInfo={orderSelected}
            setOpen={setOpenAddMoreProviders}
          />
        </>
      </Modal>
      <Modal
        open={openMatchPrices}
        onClose={() => {
          setOpenMatchPrices(false);
        }}
      >
        <>
          <MatchPrices data={orderData} setOpen={setOpenMatchPrices} />
        </>
      </Modal>
    </>
  );
};
