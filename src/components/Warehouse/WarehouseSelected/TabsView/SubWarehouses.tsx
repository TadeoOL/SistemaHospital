import { Delete, Info } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AddSubWarehouseModal } from "./Modal/AddSubWarehouseModal";
import { useSubWarehousePaginationStore } from "../../../../store/warehouseStore/subWarehousePagination";
import { ISubWarehouse } from "../../../../types/types";

const useGetWarehouses = () => {
  const {
    data,
    fetchSubWarehouse,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
  } = useSubWarehousePaginationStore((state) => ({
    data: state.data,
    fetchSubWarehouse: state.fetchSubWarehouse,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
  }));

  useEffect(() => {
    fetchSubWarehouse();
  }, [pageCount, pageSize, pageIndex]);

  return {
    data,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
  };
};

export const SubWarehouses = () => {
  const { data, count, pageIndex, pageSize, isLoading } = useGetWarehouses();
  const [openModal, setOpenModal] = useState(false);
  console.log({ data });
  return (
    <>
      <Stack spacing={2} sx={{ py: 0.5 }}>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Nuevo SubAlmacén
          </Button>
        </Box>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Encargado de almacén</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((sw) => (
                    <TableRowComponent subWarehouse={sw} key={sw.id} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          display: "flex",
                          flex: 1,
                          justifyContent: "center",
                          p: 2,
                          columnGap: 1,
                        }}
                      >
                        {isLoading && !data ? (
                          <CircularProgress size={25} />
                        ) : (
                          <>
                            <Info
                              sx={{ width: 40, height: 40, color: "gray" }}
                            />
                            <Typography variant="h2" color="gray">
                              No hay subalmacenes
                            </Typography>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={count}
              onPageChange={(e, value) => {
                e?.stopPropagation();
                console.log({ value });
                // setPageIndex(value);
              }}
              onRowsPerPageChange={(e: any) => {
                console.log({ e });
                // setPageSize(e.target.value);
              }}
              page={pageIndex}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </TableContainer>
        </Card>
      </Stack>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <React.Fragment>
          <AddSubWarehouseModal />
        </React.Fragment>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  subWarehouse: ISubWarehouse;
}

const TableRowComponent: React.FC<TableRowComponentProps> = ({
  subWarehouse,
}) => {
  return (
    <TableRow>
      <TableCell>{subWarehouse.nombre}</TableCell>
      <TableCell>{subWarehouse.descripcion}</TableCell>
      <TableCell>{subWarehouse.usuarioEncargado}</TableCell>
      <TableCell>
        <IconButton>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
