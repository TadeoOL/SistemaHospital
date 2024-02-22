import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
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
import { shallow } from "zustand/shallow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SearchBar } from "../../Inputs/SearchBar";
import { useWaitAuthPurchasePagination } from "../../../store/purchaseStore/waitAuthPurchasePagination";
import { changePurchaseStatus } from "../../../api/api.routes";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const useGetAllData = () => {
  const {
    pageIndex,
    pageSize,
    count,
    fetchPurchaseOrders,
    search,
    data,
    setPageSize,
    setPageIndex,
    isLoading,
    handleChangePurchaseOrder,
    cleanPurchaseOrderData,
    setSearch,
    refetch,
  } = useWaitAuthPurchasePagination(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      fetchPurchaseOrders: state.fetchPurchaseOrders,
      search: state.search,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      handleChangePurchaseOrder: state.handleChangePurchaseOrder,
      cleanPurchaseOrderData: state.cleanPurchaseOrderData,
      setSearch: state.setSearch,
      refetch: state.fetchPurchaseOrders,
    }),
    shallow
  );

  useEffect(() => {
    fetchPurchaseOrders();
  }, [pageIndex, pageSize, search, handleChangePurchaseOrder]);

  return {
    isLoading,
    data,
    count,
    setPageIndex,
    setPageSize,
    search,
    pageIndex,
    pageSize,
    cleanPurchaseOrderData,
    setSearch,
    refetch,
  };
};

export const WaitAuthPurchase = () => {
  const {
    count,
    data,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    setSearch,
    refetch,
  } = useGetAllData();

  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleRemoveOrder = async (idOrdenCompra: string) => {
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
          refetch();
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

  return (
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
                      <TableCell>{auth.fechaSolicitud.split("T")[0]}</TableCell>
                      <TableCell>${auth.precioTotalOrden}</TableCell>
                      <TableCell>
                        <Tooltip title="Eliminar">
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
                                <TableCell>${order.precioProveedor}</TableCell>
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
  );
};
