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
  IconButton,
  TablePagination,
  Button,
  Modal,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SearchBar } from '../../../Inputs/SearchBar';
import { Info } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { merchandiseEntryPagination } from '../../../../store/warehouseStore/merchandiseEntry';
import { AddMerchandisePetitionModal } from './Modal/AddMerchandisePetition';
import { SortComponent } from '../../../Commons/SortComponent';

export const WarehousePurchases = () => {
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
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
    setSearch,
    search,
    setSort,
    sort,
  } = merchandiseEntryPagination((state) => ({
    data: state.data,
    fetchMerchandiseEntries: state.fetchMerchandiseEntries,
    isLoading: state.isLoading,
    pageCount: state.pageCount,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    count: state.count,
    setSearch: state.setSearch,
    search: state.search,
    setPageIndex: state.setPageIndex,
    setPageSize: state.setPageSize,
    setSort: state.setSort,
    sort: state.sort,
  }));

  useEffect(() => {
    fetchMerchandiseEntries();
  }, [pageCount, pageSize, pageIndex, search, sort]);

  return (
    <React.Fragment>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar petición de almacén..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
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
                    <TableCell>
                      <SortComponent tableCellLabel="Folio de Solicitud" headerName="folio" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Almacen Solicitado"
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
                        tableCellLabel="Fecha de Solicitud"
                        headerName="fechaSolicitud"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Estatus" headerName="estatus" setSortFunction={setSort} />
                    </TableCell>
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
                            <Typography>{petition.folio}</Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.almacenOrigen}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.solicitadoPor}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>{petition.fechaSolicitud}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            {petition.estatus === 1 ? 'Espera' : 'Completado'}
                          </TableCell>
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
                      <TableCell align="center" colSpan={5}>
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
          <AddMerchandisePetitionModal setOpen={setOpenModal} refetch={fetchMerchandiseEntries} />
        </React.Fragment>
      </Modal>
    </React.Fragment>
  );
};
