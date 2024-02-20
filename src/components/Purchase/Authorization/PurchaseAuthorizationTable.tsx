import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { usePurchaseAuthorizationPagination } from "../../../store/purchaseStore/purchaseAuthorizationPagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Swal from "sweetalert2";
import { changePurchaseStatus } from "../../../api/api.routes";

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
    handleChangePurchaseAuthorization,
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
      handleChangePurchaseAuthorization:
        state.handleChangePurchaseAuthorization,
    }),
    shallow
  );

  useEffect(() => {
    fetchPurchaseAuthorization();
  }, [pageIndex, pageSize, search, enabled, handleChangePurchaseAuthorization]);

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

const acceptPurchaseAuthorization = (
  Id_OrdenCompra: string,
  Mensaje: string = "Aceptada"
) => {
  const { fetchPurchaseAuthorization } =
    usePurchaseAuthorizationPagination.getState();
  Swal.fire({
    icon: "warning",
    html: "Esta orden sobrepasa la cantidad para orden directa.<br><br>Selecciona una de las siguientes opciones.",
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: "Salir",
    denyButtonText: `Autorizar compra`,
    confirmButtonText: "Solicitar licitación",
    reverseButtons: true,
  }).then(async (result) => {
    try {
      if (result.isConfirmed) {
        await changePurchaseStatus(Id_OrdenCompra, 2, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire("Compra enviada a licitación!", "", "success");
      } else if (result.isDenied) {
        await changePurchaseStatus(Id_OrdenCompra, 4, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire("Compra aprobada correctamente!", "", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al autorizar la compra!", "", "error");
    }
  });
};

const declinePurchaseAuthorization = (
  Id_OrdenCompra: string,
  Mensaje: string = "Rechazada"
) => {
  Swal.fire({
    title: "¿Deseas rechazar la solicitud de orden de compra?",
    text: "Se cambiará el estatus de la solicitud de orden de compra a orden cancelada!",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#4338CA",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Rechazar orden de compra!",
    customClass: {
      confirmButton: "confirm-button-class",
      cancelButton: "cancel-button-class",
    },
    reverseButtons: true,
  }).then(async (result) => {
    const { fetchPurchaseAuthorization } =
      usePurchaseAuthorizationPagination.getState();
    if (result.isConfirmed) {
      try {
        await changePurchaseStatus(Id_OrdenCompra, 0, Mensaje);
        Swal.fire({
          title: "Rechazada",
          text: "La compra ha sido rechazada correctamente!",
          icon: "success",
        });
        fetchPurchaseAuthorization();
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Error al rechazar la compra!",
          icon: "error",
        });
      }
    }
  });
};

export const PurchaseAuthorizationTable = () => {
  const { data, count, isLoading, pageIndex, pageSize, setPageSize } =
    useGetAllData();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );

  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
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
                        <Tooltip title="Aceptar">
                          <IconButton
                            size="small"
                            sx={{ color: "neutral.700" }}
                            onClick={() => {
                              acceptPurchaseAuthorization(auth.id_OrdenCompra);
                            }}
                          >
                            <CheckIcon sx={{ color: "green" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton
                            size="small"
                            onClick={() => {
                              declinePurchaseAuthorization(auth.id_OrdenCompra);
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
                          {auth.ordenCompraArticulo.map((order) => (
                            <TableBody key={order.id}>
                              <TableRow>
                                <TableCell>{order.articulo.nombre}</TableCell>
                                <TableCell>{order.cantidadCompra}</TableCell>
                                <TableCell>${order.precioProveedor}</TableCell>
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
            <ErrorOutlineIcon
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
          onPageChange={() => {}}
          onRowsPerPageChange={(e: any) => {
            setPageSize(e.target.value);
          }}
          page={pageIndex}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <div>
          {/* <ModifyArticleModal articleId={articleId} open={setOpenEditModal} /> */}
        </div>
      </Modal>
    </>
  );
};
