import {
  Box,
  Button,
  Card,
  CircularProgress,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Info, Warning } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import { warning } from '../../../theme/colors';
import { useExistingArticlePagination } from '../../../store/warehouseStore/existingArticlePagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { SearchBar } from '../../Inputs/SearchBar';
import { IExistingArticle, IWarehouseData } from '../../../types/types';
import { ArticlesExitModal } from './Modal/ArticlesExitModal';
import { SortComponent } from '../../Commons/SortComponent';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { ArticlesPatientAcountManagementModal } from './Modal/ArticlesPatientAcountManagementModal';
import { ArticlesPatientAcountManagementPharmacyModal } from './Modal/ArticlesPatientAcountManagemenPharmacytModal';

const useGetExistingArticles = (warehouseId: string, principalWarehouseId: string) => {
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  const {
    data,
    setSearch,
    search,
    fetchExistingArticles,
    setWarehouseId,
    setPrincipalWarehouseId,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    clearAllData,
    isLoading,
    setSort,
    sort,
    pageCount,
    pageSize,
    pageIndex,
  } = useExistingArticlePagination(
    (state) => ({
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
      setPrincipalWarehouseId: state.setPrincipalWarehouseId,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      pageSize: state.pageSize,
      pageCount: state.pageCount,
      setPageSize: state.setPageSize,
      pageIndex: state.pageIndex,
      startDate: state.startDate,
      endDate: state.endDate,
      clearAllData: state.clearAllData,
      isLoading: state.isLoading,
      sort: state.sort,
      setSort: state.setSort,
    }),
    shallow
  );

  useEffect(() => {
    clearAllData();
  }, []);

  useEffect(() => {
    setWarehouseId(warehouseSL?.id_Almacen ?? warehouseId);
    if (warehouseSL && warehouseSL?.esSubAlmacen) {
      setPrincipalWarehouseId(warehouseSL.id_AlmacenPrincipal ?? '');
    } else {
      setPrincipalWarehouseId(principalWarehouseId);
    }
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters, sort, pageIndex, pageSize]);

  return {
    data,
    setSearch,
    setStartDate,
    setEndDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    startDate,
    endDate,
    isLoading,
    setSort,
    fetchExistingArticles,
    pageIndex,
    pageSize,
    pageCount,
  };
};
export const ArticlesPharmacyTable = () => {
  const warehouseIdSeted: string = usePosTabNavStore((state) => state.warehouseId);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));

  const {
    data,
    setSearch,
    setPageIndex,
    setPageSize,
    setSort,
    fetchExistingArticles,
    isLoading,
    pageCount,
    pageSize,
    pageIndex,
  } = useGetExistingArticles(warehouseIdSeted, warehouseData.id_AlmacenPrincipal || '');
  const [openModal, setOpenModal] = useState(false);
  const [exitArticlesM, setExitArticlesM] = useState(false);
  const [entryArticlesM, setEntryArticlesM] = useState(false);

  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
          <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
            <SearchBar
              title="Buscar articulo en farmacia..."
              searchState={setSearch}
              sx={{ display: 'flex', flex: 1 }}
              size="small"
            />
            <Box sx={{ display: 'flex', flex: 1, columnGap: 2, justifyContent: 'flex-end' }}>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<TurnLeftIcon />}
                onClick={() => {
                  setExitArticlesM(true);
                  setEntryArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Salida de artículos
              </Button>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => {
                  setEntryArticlesM(true);
                  setExitArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Movimientos Hospitalarios
              </Button>
              <Button
                sx={{ minWidth: 200 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => {
                  setExitArticlesM(false);
                  setEntryArticlesM(false);
                  setOpenModal(!openModal);
                }}
              >
                Movimientos de Quirofano
              </Button>
            </Box>
          </Box>
          <Card>
            {isLoading && data.length === 0 ? (
              <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <SortComponent tableCellLabel="Nombre" headerName="nombre" setSortFunction={setSort} />
                      </TableCell>
                      <TableCell>
                        <SortComponent
                          tableCellLabel="Stock mínimo"
                          headerName="stockMinimo"
                          setSortFunction={setSort}
                        />
                      </TableCell>
                      <TableCell>
                        <SortComponent tableCellLabel="Stock" headerName="stockActual" setSortFunction={setSort} />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data && data.map((article) => <TableRowComponent article={article} key={article.id_Articulo} />)}
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
                        No hay artículos existentes
                      </Typography>
                    </Box>
                  ))}
                <TablePagination
                  component="div"
                  count={pageCount}
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
            )}
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModal}>
        <>
          {exitArticlesM ? (
            <ArticlesExitModal setOpen={setOpenModal} warehouseId={warehouseIdSeted} refetch={fetchExistingArticles} />
          ) : entryArticlesM ? (
            <ArticlesPatientAcountManagementPharmacyModal
              setOpen={setOpenModal}
              warehouseId={warehouseIdSeted}
              refetch={fetchExistingArticles}
            />
          ) : (
            <ArticlesPatientAcountManagementModal
              setOpen={setOpenModal}
              warehouseId={warehouseIdSeted}
              refetch={fetchExistingArticles}
            />
          )}
        </>
      </Modal>
      {
        //<ArticlesEntryModal setOpen={setOpenModal} warehouseId={warehouseIdSeted} refetch={fetchExistingArticles} />
      }
    </>
  );
};

interface TableRowComponentProps {
  article: IExistingArticle;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ article }) => {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{article.nombre}</Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 1 }}>
            <Box>{article.stockMinimo}</Box>
            <Box>
              {article.stockActual < article.stockMinimo ? (
                <Tooltip title="Stock bajo">
                  <Warning sx={{ color: warning.main }} />
                </Tooltip>
              ) : null}
            </Box>
          </Box>
        </TableCell>
        <TableCell>{article.stockActual}</TableCell>
      </TableRow>
    </React.Fragment>
  );
};
