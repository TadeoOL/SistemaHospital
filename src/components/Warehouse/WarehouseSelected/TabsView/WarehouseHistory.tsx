import { Info } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  Box,
  Card,
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
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AddSubWarehouseModal } from './Modal/AddSubWarehouseModal';
import { useWarehouseMovementPaginationStore } from '../../movimientoAlmacenPaginacion';

const useGetMovements = () => {
  const { data, fetchWareHouseMovements, isLoading, pageCount, pageIndex, pageSize, count } =
    useWarehouseMovementPaginationStore((state) => ({
      data: state.data,
      fetchWareHouseMovements: state.fetchWarehouseMovements,
      isLoading: state.isLoading,
      pageCount: state.pageCount,
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
    }));

  useEffect(() => {
    fetchWareHouseMovements();
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

export const WarehouseHistory = () => {
  const [openModal, setOpenModal] = useState(false);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const { data, count, pageIndex, pageSize, isLoading } = useGetMovements();
  return (
    <>
      <Stack spacing={2} sx={{ py: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography fontWeight={'bold'} fontSize={16}>
            Historial de movimiento
          </Typography>
        </Box>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Almacén Proveniente</TableCell>
                  <TableCell>Almacén dirigido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((movimiento) => (
                    <React.Fragment key={movimiento.id}>
                      <TableRow>
                        <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          {!viewArticles[movimiento.id] ? (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [movimiento.id]: !viewArticles[movimiento.id],
                                })
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [movimiento.id]: !viewArticles[movimiento.id],
                                })
                              }
                            >
                              <ExpandLessIcon />
                            </IconButton>
                          )}
                          <Typography>{movimiento.almacenOrigen}</Typography>
                        </TableCell>
                        <TableCell>{movimiento.almacenDestino}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={viewArticles[movimiento.id]}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Articulo</TableCell>
                                  <TableCell align="center">Cantidad</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {movimiento?.historialArticulos &&
                                  movimiento?.historialArticulos?.length > 0 &&
                                  movimiento.historialArticulos.map((movimientoArticuclo) => (
                                    <TableRow key={movimientoArticuclo.nombre}>
                                      <TableCell align="center">{movimientoArticuclo.nombre}</TableCell>
                                      <TableCell align="center">{movimientoArticuclo.cantidad}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          flex: 1,
                          justifyContent: 'center',
                          p: 2,
                          columnGap: 1,
                        }}
                      >
                        {isLoading && !data ? (
                          <CircularProgress size={25} />
                        ) : (
                          <>
                            <Info sx={{ width: 40, height: 40, color: 'gray' }} />
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
          <AddSubWarehouseModal setOpen={setOpenModal} />
        </React.Fragment>
      </Modal>
    </>
  );
};
