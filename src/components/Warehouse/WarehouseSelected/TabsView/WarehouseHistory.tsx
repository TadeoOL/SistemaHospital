import FilterListOffIcon from '@mui/icons-material/FilterListOff';
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
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { AddSubWarehouseModal } from './Modal/AddSubWarehouseModal';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useWarehouseMovementPaginationStore } from '../../../../store/warehouseStore/movimientoAlmacenPaginacion';
import { SortComponent } from '../../../Commons/SortComponent';
import { returnExpireDate } from '../../../../utils/expireDate';
// import { sortComponent } from '../../../Commons/sortComponent';

export const WarehouseHistory = () => {
  const [openModal, setOpenModal] = useState(false);
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const {
    data,
    fetchWareHouseMovements,
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
    setSort,
    sort,
  } = useWarehouseMovementPaginationStore((state) => ({
    data: state.data,
    fetchWareHouseMovements: state.fetchWarehouseMovements,
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
    setSort: state.setSort,
    sort: state.sort,
  }));

  useEffect(() => {
    fetchWareHouseMovements();
  }, [pageCount, pageSize, pageIndex, startDate, endDate, search, sort]);

  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Stack sx={{ display: 'flex', flex: 1 }}>
              <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
                <SearchBar
                  title="Buscar movimiento de articulos..."
                  searchState={setSearch}
                  sx={{ display: 'flex', flex: 1 }}
                  size="small"
                />
                <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
                  <TextField
                    label="Fecha inicio"
                    size="small"
                    type="date"
                    value={startDate}
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
                </Box>
              </Box>
            </Stack>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortComponent tableCellLabel="Folio" headerName="folio" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Proveniente de"
                        headerName="almacenProveniente"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Solicitado Por"
                        headerName="solicitadoPor"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Autorizado Por"
                        headerName="autorizadoPor"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Dirigido a"
                        headerName="almacenDirigido"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Fecha de Solicitud"
                        headerName="fechaSolicitud"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Estado" headerName="estado" setSortFunction={setSort} />
                    </TableCell>
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
                            <Typography> {movimiento.folio} </Typography>
                          </TableCell>
                          <TableCell>
                            {movimiento.almacenOrigen == null
                              ? movimiento.conceptoSolicitud
                              : movimiento.almacenOrigen}
                          </TableCell>
                          <TableCell> {movimiento.solicitadoPor} </TableCell>
                          <TableCell> {movimiento.autorizadoPor} </TableCell>
                          <TableCell>
                            {movimiento.almacenDestino == movimiento.almacenOrigen && movimiento.salidaMotivo != null
                              ? movimiento.salidaMotivo
                              : movimiento.almacenDestino}
                          </TableCell>
                          <TableCell>{movimiento.fechaSolicitud}</TableCell>
                          <TableCell>
                            {movimiento.estatus === 0
                              ? 'Cancelada'
                              : movimiento.estatus === 2 || movimiento.estatus === 3
                                ? 'Aceptada'
                                : 'en espera'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[movimiento.id]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="center">Fecha Caducidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {movimiento?.historialArticulos &&
                                    movimiento?.historialArticulos?.length > 0 &&
                                    movimiento.historialArticulos.map((movimientoArticuclo) => (
                                      <TableRow key={movimientoArticuclo.nombre}>
                                        <TableCell align="center">{movimientoArticuclo.nombre}</TableCell>
                                        <TableCell align="center">{movimientoArticuclo.cantidad}</TableCell>
                                        <TableCell align="center">
                                          {returnExpireDate(movimientoArticuclo.fechaCaducidad || '')}
                                        </TableCell>
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
                      <TableCell align="center" colSpan={7}>
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
                                No hay movimientos
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
                labelRowsPerPage="Filas por página"
              />
            </TableContainer>
          </Card>
        </Stack>
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
