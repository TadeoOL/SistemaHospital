import { Edit, Info, Delete } from '@mui/icons-material';
import {
  Box,
  Stack,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  Collapse,
  IconButton,
  Tooltip,
  Modal,
} from '@mui/material';
import { IArticlesPackage } from '../../../../types/types';
import React, { useState, useEffect } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { usePackagePaginationStore } from '../../../../store/warehouseStore/packagesPagination';
import { shallow } from 'zustand/shallow';
import { UpdatePackageModal } from './Modal/UpdatePackageModal';
const useGetAllData = () => {
  const {
    isLoading,
    count,
    data,
    enabled,
    pageIndex,
    pageSize,
    search,
    setPageIndex,
    setPageSize,
    fetchWarehousePackages,
    startDate,
    endDate,
  } = usePackagePaginationStore(
    (state) => ({
      pageIndex: state.pageIndex,
      pageSize: state.pageSize,
      count: state.count,
      search: state.search,
      enabled: state.enabled,
      data: state.data,
      setPageSize: state.setPageSize,
      setPageIndex: state.setPageIndex,
      isLoading: state.isLoading,
      startDate: state.startDate,
      endDate: state.endDate,
      fetchWarehousePackages: state.fetchWarehousePackages,
    }),
    shallow
  );

  useEffect(() => {
    fetchWarehousePackages();
  }, [pageIndex, pageSize, search, enabled, startDate, endDate]);

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

export const PackageCatalogueTable = () => {
  const { data, count, isLoading, pageIndex, pageSize, setPageIndex, setPageSize } = useGetAllData();
  const [viewArticles, setViewArticles] = useState<{ [key: string]: boolean }>({});
  const handleDelete = () => {
    console.log('no hace nada en hd');
  };
  const [open, setOpen] = useState(false);
  const [packageSelected, setPackageSelected] = useState<IArticlesPackage>({
    id_Almacen: '',
    contenido: [],
    descripcion: '',
    id_PaqueteArticulo: '',
    nombre: '',
  });

  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Nombre paquete</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data?.length > 0 &&
                    data.map((pack, i) => (
                      <React.Fragment key={(pack.id_PaqueteArticulo, i)}>
                        <TableRow>
                          <TableCell
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              textAlign: 'center',
                            }}
                          >
                            {!viewArticles[pack.id_PaqueteArticulo] ? (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewArticles({
                                    [pack.id_PaqueteArticulo]: !viewArticles[pack.id_PaqueteArticulo],
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
                                    [pack.id_PaqueteArticulo]: !viewArticles[pack.id_PaqueteArticulo],
                                  });
                                }}
                              >
                                <ExpandLessIcon />
                              </IconButton>
                            )}
                            <Typography> {pack.nombre} </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => {
                                  console.log('Paquete a editar', pack);
                                  setPackageSelected(pack);
                                  setOpen(true);
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton onClick={() => handleDelete()}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={viewArticles[pack.id_PaqueteArticulo]}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">Articulo</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {pack.contenido &&
                                    pack.contenido?.length > 0 &&
                                    pack.contenido.map((articleInPackage, i) => (
                                      <TableRow key={(articleInPackage.nombre, i)}>
                                        <TableCell align="center">{articleInPackage.nombre}</TableCell>
                                        <TableCell align="center">{articleInPackage.cantidad}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
              {!data ||
                (data.length === 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 5,
                      columnGap: 1,
                    }}
                  >
                    <Info sx={{ width: 40, height: 40, color: 'gray' }} />
                    <Typography variant="h2" color="gray">
                      No hay paquetes existentes
                    </Typography>
                  </Box>
                ))}
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <UpdatePackageModal setOpen={setOpen} package={packageSelected} />
        </>
      </Modal>
    </>
  );
};
