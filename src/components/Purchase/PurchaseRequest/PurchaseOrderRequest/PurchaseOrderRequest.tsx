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
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
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

const handleRemoveOrder = async (idOrdenCompra: string) => {
  const { fetch } = usePurchaseOrderRequestPagination.getState();
  Swal.fire({
    title: "Estas seguro?",
    text: "No puedes revertir este cambio!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si cancela lo!",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await changePurchaseStatus(idOrdenCompra, 0, "Cancelada");
        fetch();
        Swal.fire({
          title: "Cancelada!",
          text: "Tu orden de compra ha sido cancelada!",
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Error al cancelar la compra!",
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
  } = useGetAllData();
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openPurchaseOrder, setOpenPurchaseOrder] = useState(false);
  const [openProviderQuote, setOpenProviderQuote] = useState(false);
  const [orderSelected, setOrderSelected] = useState("");
  const [providers, setProviders] = useState<any[]>([]);

  return (
    <>
      <Stack spacing={2} sx={{ p: 2 }}>
        <SearchBar title="Buscar orden de compra..." searchState={setSearch} />
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Orden de compra</TableCell>
                <TableCell>Creado por</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Fecha de solicitud</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0
                ? null
                : isLoading
                ? null
                : data.map((auth) => (
                    <React.Fragment key={auth.id_OrdenCompra}>
                      <TableRow>
                        <TableCell>
                          {!viewArticles[auth.id_OrdenCompra] ? (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [auth.id_OrdenCompra]:
                                    !viewArticles[auth.id_OrdenCompra],
                                })
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [auth.id_OrdenCompra]:
                                    !viewArticles[auth.id_OrdenCompra],
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
                        <TableCell>${auth.precioTotalOrden}</TableCell>
                        <TableCell>
                          <Tooltip title="Ver orden de compra">
                            <IconButton
                              onClick={() => {
                                setOrderSelected(auth.folio);
                                setOpenPurchaseOrder(true);
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Subir cotización">
                            <IconButton
                              onClick={() => {
                                setOrderSelected(auth.folio);
                                setProviders(auth.solicitudProveedor);
                                setOpenProviderQuote(true);
                              }}
                            >
                              <UploadFileIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar">
                            <IconButton
                              size="small"
                              onClick={() => {
                                handleRemoveOrder(auth.id_OrdenCompra);
                              }}
                            >
                              <CloseIcon sx={{ color: "red" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={viewArticles[auth.id_OrdenCompra]}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Articulo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {auth.ordenCompraArticulo.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell>{order.articulo.nombre}</TableCell>
                                  <TableCell>{order.cantidadCompra}</TableCell>
                                  <TableCell>
                                    ${order.precioProveedor}
                                  </TableCell>
                                </TableRow>
                              ))}
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
              sx={{ display: "flex", flex: 1, justifyContent: "center", p: 4 }}
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
              setPageIndex(value);
            }}
            onRowsPerPageChange={(e: any) => {
              setPageSize(e.target.value);
            }}
            page={pageIndex}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      </Stack>
      <Modal
        open={openPurchaseOrder}
        onClose={() => setOpenPurchaseOrder(false)}
      >
        <>
          <PurchaseOrderModal
            idFolio={orderSelected}
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
    </>
  );
};
