import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  Collapse,
  CircularProgress,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  IconButton,
  TablePagination,
  Button,
  Modal,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../../../Inputs/SearchBar';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Info } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useWarehouseMovementPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaginacion';
import { merchandiseEntryPagination } from '../../../../store/warehouseStore/merchandiseEntry';
import { AddMerchandisePetitionModal } from './Modal/AddMerchandisePetition';

const useGetEntries = () => {
  const {
    data,
    fetchMerchandiseEntries,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
    setPageIndex,
    setPageSize,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setSearch,
    search,
  } = merchandiseEntryPagination((state) => ({
    data: state.data,
    fetchMerchandiseEntries: state.fetchMerchandiseEntries,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
    startDate: state.startDate,
    setStartDate: state.setStartDate,
    endDate: state.endDate,
    setEndDate: state.setEndDate,
    setSearch: state.setSearch,
    search: state.search,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
  }));

  useEffect(() => {
    fetchMerchandiseEntries();
  }, [pageCount, pageSize, pageIndex, startDate, endDate, search]);
  return {
    data,
    isLoading,
    pageCount,
    pageIndex,
    pageSize,
    count,
    setSearch,
    setStartDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    fetchMerchandiseEntries,
  };
};

export const WarehousePurchases = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
  const {
    data,
    count,
    pageIndex,
    pageSize,
    isLoading,
    setSearch,
    setStartDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    fetchMerchandiseEntries,
  } = useGetEntries();

  return (
    <React.Fragment>
      <Stack spacing={2} sx={{ py: 0.5 }}>
        <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
          <SearchBar
            title="Buscar orden de compra..."
            searchState={setSearch}
            sx={{ display: 'flex', flex: 1 }}
            size="small"
          />
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
            <TextField
              label="Fecha inicio"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
            <TextField
              label=" Fecha final"
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
            <IconButton onClick={() => useWarehouseMovementPaginationStore.getState().clearFilters()}>
              <FilterListOffIcon />
            </IconButton>

            <Button
              variant="contained"
              sx={{ width: 160 }}
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Nueva petición
            </Button>
          </Box>
        </Box>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Petición de Almacén</TableCell>
                  <TableCell>Fecha de solicitud</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((petition, i) => (
                    <React.Fragment key={i}>
                      <TableRow>
                        <TableCell sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          {!viewArticles[petition.id] ? (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [petition.id]: !viewArticles[petition.id],
                                })
                              }
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                setViewArticles({
                                  [petition.id]: !viewArticles[petition.id],
                                })
                              }
                            >
                              <ExpandLessIcon />
                            </IconButton>
                          )}
                          <Typography>{petition.almacenDestino}</Typography>
                        </TableCell>
                        <TableCell>{petition.fechaSolicitud}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={viewArticles[petition.id]}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">Articulo</TableCell>
                                  <TableCell align="center">Cantidad</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {petition?.historialArticulos &&
                                  petition?.historialArticulos?.length > 0 &&
                                  petition.historialArticulos.map((movimientoArticuclo) => (
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
                              No hay peticiones
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
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <React.Fragment>
          <AddMerchandisePetitionModal setOpen={setOpenModal} refetch={fetchMerchandiseEntries} />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};
