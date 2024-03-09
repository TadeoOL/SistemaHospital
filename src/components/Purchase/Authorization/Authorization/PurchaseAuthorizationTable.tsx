import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Mensaje from "./Modal/Mensaje";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
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
} from "@mui/material";
import { usePurchaseAuthorizationPagination } from "../../../../store/purchaseStore/purchaseAuthorizationPagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Swal from "sweetalert2";
import { changePurchaseStatus } from "../../../../api/api.routes";
import { StatusPurchaseRequest } from "../../../../types/types";
import { Checklist, Info } from "@mui/icons-material";
import { MatchProvidersAndArticles } from "./Modal/MatchProvidersAndArticles";
import { useMatchProvidersAndArticles } from "../../../../store/purchaseStore/matchProvidersAndArticles";
import { primary, error, warning } from "../../../../theme/colors";

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
  Id_SolicitudCompra: string,
  Mensaje: string = "Aceptada"
) => {
  const { fetchPurchaseAuthorization } =
    usePurchaseAuthorizationPagination.getState();
  Swal.fire({
    icon: "warning",
    title: "Advertencia",
    text: "Seleccione una de las siguientes opciones para la solicitud de compra.",
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: "Salir",
    denyButtonText: "Autorizar compra",
    confirmButtonText: "Solicitar licitación",
    confirmButtonColor: warning.main,
    denyButtonColor: primary.main,
    cancelButtonColor: error.main,
    reverseButtons: true,
    customClass: {
      container: "swal-container",
    },
  }).then(async (result) => {
    try {
      if (result.isConfirmed) {
        await changePurchaseStatus(Id_SolicitudCompra, 3, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire("Compra enviada a licitación!", "", "success");
      } else if (result.isDenied) {
        await changePurchaseStatus(Id_SolicitudCompra, 6, Mensaje);
        fetchPurchaseAuthorization();
        Swal.fire("Compra aprobada correctamente!", "", "success");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al autorizar la compra!", "", "error");
    }
  });
};

export const declinePurchaseAuthorization = async (
  Id_SolicitudCompra: string,
  Mensaje: string = "Rechazada"
) => {
  try {
    await changePurchaseStatus(Id_SolicitudCompra, 0, Mensaje);
    const { fetchPurchaseAuthorization } =
      usePurchaseAuthorizationPagination.getState();
    await fetchPurchaseAuthorization();
    console.log("Compra rechazada correctamente");
  } catch (error) {
    console.error("Error al rechazar la orden:", error);
  }
};

export const PurchaseAuthorizationTable = () => {
  const { data, count, isLoading, pageIndex, pageSize, setPageSize } =
    useGetAllData();
  const [openModal, setOpenModal] = useState(false);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [folio, setFolio] = useState("");
  const [openMensajeModal, setOpenMensajeModal] = useState(false);
  const [purchaseRequestId, setPurchaseRequestId] = useState("");

  useEffect(() => {
    if (openModal) return;
    useMatchProvidersAndArticles.setState({
      formattedData: null,
      purchaseOrderMatched: null,
    });
  }, [openModal]);

  return (
    <>
      <Card sx={{ m: 2, overflowX: "auto" }}>
        <TableContainer component={Paper} sx={{ minWidth: 950 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Solicitud de Compra</TableCell>
                <TableCell>Creado por</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Fecha de Solicitud</TableCell>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewArticles({
                                  [auth.id_SolicitudCompra]:
                                    !viewArticles[auth.id_SolicitudCompra],
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
                                  [auth.id_SolicitudCompra]:
                                    !viewArticles[auth.id_SolicitudCompra],
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
                          "Cancelado" ? (
                            <Tooltip
                              title={
                                <Typography variant="body1">
                                  {auth.notas}
                                </Typography>
                              }
                            >
                              <Info sx={{ color: "gray" }} />
                            </Tooltip>
                          ) : StatusPurchaseRequest[auth.estatus] ===
                            "Selección de productos por proveedor" ? (
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
                              <Tooltip title="Aceptar">
                                <IconButton
                                  size="small"
                                  sx={{ color: "neutral.700" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    acceptPurchaseAuthorization(
                                      auth.id_SolicitudCompra
                                    );
                                  }}
                                >
                                  <CheckIcon sx={{ color: "green" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rechazar">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPurchaseRequestId(
                                      auth.id_SolicitudCompra
                                    );
                                    setOpenMensajeModal(true);
                                  }}
                                >
                                  <CloseIcon sx={{ color: "red" }} />
                                </IconButton>
                              </Tooltip>
                            </>
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
                            {auth.solicitudProveedor[0].solicitudCompraArticulos.map(
                              (request) => (
                                <TableBody key={request.id}>
                                  <TableRow>
                                    <TableCell align="center">
                                      {request.articulo.nombre}
                                    </TableCell>
                                    <TableCell align="center">
                                      {request.cantidadCompra}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              )
                            )}
                          </Table>
                        </Collapse>
                      </TableCell>
                    </React.Fragment>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <MatchProvidersAndArticles setOpen={setOpenModal} folio={folio} />
        </div>
      </Modal>
      <Modal open={openMensajeModal} onClose={() => setOpenMensajeModal(false)}>
        <>
          <Mensaje
            open={() => setOpenMensajeModal(false)}
            idSolicitudCompra={purchaseRequestId}
          />
        </>
      </Modal>
    </>
  );
};
