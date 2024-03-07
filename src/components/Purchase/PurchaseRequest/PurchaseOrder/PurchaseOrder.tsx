import {
  Box,
  Card,
  Chip,
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
  Tooltip,
  Typography,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { SearchBar } from "../../../Inputs/SearchBar";
import { StatusPurchaseOrder } from "../../../../types/types";
import { changeOrderStatus } from "../../../../api/api.routes";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { usePurchaseOrderPagination } from "../../../../store/purchaseStore/purchaseOrderPagination";
import { RequestPurchasedOrderModal } from "../Modal/RequestPurchasedOrderModal";
import { useArticlesAlertPagination } from "../../../../store/purchaseStore/articlesAlertPagination";
import { QuoteModal } from "./Modal/QuoteModal";
import { OrderModal } from "./Modal/OrderModal";
import Swal from "sweetalert2";

const handleRemoveOrder = async (Id_OrdenCompra: string) => {
  Swal.fire({
    title: "Estas seguro?",
    text: "No puedes revertir este cambio!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, cancélalo!",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await changeOrderStatus(Id_OrdenCompra, 0, "Cancelada");
        usePurchaseOrderPagination.getState().fetch();
        Swal.fire({
          title: "Cancelada!",
          text: "Tu orden de compra ha sido cancelada!",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Error al cancelar la orden!",
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
  }));
  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, handleChange]);
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
  };
};

export const PurchaseOrder = () => {
  const {
    count,
    data,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    setSearch,
  } = useGetAllData();

  const [openQuoteModal, setOpenQuoteModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [orderSelected, setOrderSelected] = useState<{
    folio: string;
    OrderId: string;
  }>({ folio: "", OrderId: "" });

  const { openNewOrderPurchase, setOpenNewOrderPurchase } =
    useArticlesAlertPagination((state) => ({
      openNewOrderPurchase: state.handleOpen,
      setOpenNewOrderPurchase: state.setHandleOpen,
    }));

  useEffect(() => {
    if (openNewOrderPurchase) return;
    useArticlesAlertPagination.setState({
      step: 0,
      checkedArticles: [],
      alertArticlesChecked: [],
      articlesPurchased: [],
      warehouseSelected: "",
    });
  }, [openNewOrderPurchase]);

  console.log({ data });

  return (
    <>
      <Stack spacing={2} sx={{ p: 2, overflowY: "auto" }}>
        <SearchBar title="Buscar orden de compra..." searchState={setSearch} />
        <Card sx={{ overflowX: "auto" }}>
          <TableContainer sx={{ minWidth: { xs: 950, xl: 0 } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Orden de compra</TableCell>
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
                  : data.map((order) => (
                      <React.Fragment key={order.id_OrdenCompra}>
                        <TableRow>
                          <TableCell>
                            {!viewArticles[order.id_OrdenCompra] ? (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [order.id_OrdenCompra]:
                                      !viewArticles[order.id_OrdenCompra],
                                  })
                                }
                              >
                                <ExpandMoreIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  setViewArticles({
                                    [order.id_OrdenCompra]:
                                      !viewArticles[order.id_OrdenCompra],
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
                            <Chip
                              key={order.proveedor.id_Proveedor}
                              label={order.proveedor.nombre}
                            />
                          </TableCell>
                          <TableCell>
                            {order.fechaSolicitud.split("T")[0]}
                          </TableCell>
                          <TableCell>${order.precioTotalOrden}</TableCell>
                          <TableCell>
                            {StatusPurchaseOrder[order.estatus]}
                          </TableCell>
                          <TableCell>
                            {StatusPurchaseOrder[order.estatus] ===
                            "Necesita elegir proveedor" ? (
                              <Tooltip title="Seleccionar proveedores">
                                <IconButton
                                  onClick={() => {
                                    setOrderSelected({
                                      folio: order.folio_Extension,
                                      OrderId: order.id_OrdenCompra,
                                    });
                                  }}
                                >
                                  <PersonAddIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
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
                                      setProviders([order.proveedor]);
                                    }}
                                  >
                                    <UploadFileIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Cancelar">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  console.log("info", order);
                                  handleRemoveOrder(order.id_OrdenCompra);
                                }}
                              >
                                <CloseIcon sx={{ color: "red" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[order.id_OrdenCompra]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">
                                      Articulo
                                    </TableCell>
                                    <TableCell align="center">
                                      Cantidad
                                    </TableCell>
                                    <TableCell align="center">Precio</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {order.ordenCompraArticulo.map(
                                    (orderArticle) => (
                                      <TableRow
                                        key={
                                          orderArticle.id_OrdenCompraArticulo
                                        }
                                      >
                                        <TableCell align="center">
                                          {orderArticle.nombre}
                                        </TableCell>
                                        <TableCell align="center">
                                          {orderArticle.cantidad}
                                        </TableCell>
                                        <TableCell align="center">
                                          {orderArticle.precioProveedor}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
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
        open={openNewOrderPurchase}
        onClose={() => setOpenNewOrderPurchase(false)}
      >
        <>
          <RequestPurchasedOrderModal
            open={setOpenNewOrderPurchase}
            isAlert={false}
          />
        </>
      </Modal>
      <Modal open={openOrderModal} onClose={() => setOpenOrderModal(false)}>
        <>
          <OrderModal purchaseData={orderSelected} open={setOpenOrderModal} />
        </>
      </Modal>

      <Modal open={openQuoteModal} onClose={() => setOpenQuoteModal(false)}>
        <>
          <QuoteModal
            idFolio={orderSelected}
            open={setOpenQuoteModal}
            providers={providers}
          />
        </>
      </Modal>
    </>
  );
};
