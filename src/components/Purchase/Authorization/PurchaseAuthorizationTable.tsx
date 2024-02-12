import React, { useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Card,
  CircularProgress,
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
  const {
    count,
    enabled,
    isLoading,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  } = useGetAllData();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [articleId, setArticleId] = useState("");

  // const handleUserChecked = (e: any) => {
  //   const { value, checked } = e.target;

  //   if (checked) {
  //     setIsChecked([...isChecked, value]);
  //   } else {
  //     setIsChecked(isChecked.filter((item) => item !== value));
  //   }
  // };

  // const handleIsUserChecked = (userId: string) => {
  //   if (isChecked.some((user) => user === userId)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const data = [
    {
      id: "1",
      ordenCompra: "HSB1021",
      fechaSolicitud: "24-10-2024",
      creadoPor: "Tadeo Osuna",
    },
  ];
  return (
    <>
      <Card sx={{ m: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Orden de compra</TableCell>
              <TableCell>Creado por</TableCell>
              <TableCell>Fecha de solicitud</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0
              ? null
              : isLoading
              ? null
              : data.map((article) => (
                  <React.Fragment key={article.id}>
                    <TableRow>
                      <TableCell>{article.ordenCompra}</TableCell>
                      <TableCell>{article.creadoPor}</TableCell>
                      <TableCell>{article.fechaSolicitud}</TableCell>
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
