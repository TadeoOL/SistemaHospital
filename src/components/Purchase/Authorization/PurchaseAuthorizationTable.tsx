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

export const PurchaseAuthorizationTable = () => {
  const { data, count, isLoading, pageIndex, pageSize, setPageSize } =
    useGetAllData();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [viewArticles, setViewArticles] = useState(false);

  console.log({ data });
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
                        {!viewArticles ? (
                          <IconButton
                            onClick={() => setViewArticles(!viewArticles)}
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => setViewArticles(!viewArticles)}
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
                            onClick={() => {}}
                          >
                            <CheckIcon sx={{ color: "green" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton size="small" onClick={() => {}}>
                            <CloseIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    <Collapse in={viewArticles}>
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
                              <TableCell>{order.precioProveedor}</TableCell>
                            </TableRow>
                          </TableBody>
                        ))}
                      </Table>
                    </Collapse>
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
