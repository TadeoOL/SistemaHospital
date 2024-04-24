import {
  Box,
  Button,
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
  Tooltip,
  Typography,
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ExpandLess, ExpandMore, FilterListOff, Info, Warning } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';
import { warning } from '../../../theme/colors';
import { useExistingArticlePagination } from '../../../store/warehouseStore/existingArticlePagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { SearchBar } from '../../Inputs/SearchBar';
import { IExistingArticle, IExistingArticleList } from '../../../types/types';
import { returnExpireDate } from '../../../utils/expireDate';
import { ArticlesExitModal } from './Modal/ArticlesExitModal';
import { SortComponent } from '../../Commons/SortComponent';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 1),
    fontWeight: 'bold',
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    border: 'hidden',
  },
  [`&.${tableCellClasses.root}`]: {
    width: '25%',
  },
}));

const useGetExistingArticles = (warehouseId: string) => {
  const {
    data,
    setSearch,
    search,
    fetchExistingArticles,
    setWarehouseId,
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
  } = useExistingArticlePagination(
    (state) => ({
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
      clearFilters: state.clearFilters,
      setPageIndex: state.setPageIndex,
      setPageSize: state.setPageSize,
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
  }, [warehouseId]);

  useEffect(() => {
    setWarehouseId(warehouseId);
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters, sort]);

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
  };
};
export const ArticlesPharmacyTable = () => {
  const {
    data,
    setSearch,
    setEndDate,
    setStartDate,
    clearFilters,
    setPageIndex,
    setPageSize,
    setSort,
    startDate,
    endDate,
    isLoading,
  } = useGetExistingArticles('fc6d0fdd-8cfa-49a7-863e-206a7542a5e5'); //hardcodeo tranqui
  const [openModal, setOpenModal] = useState(false);

  if (isLoading && data.length === 0)
    return (
      <Box sx={{ display: 'flex', flex: 1, p: 4 }}>
        <CircularProgress size={30} />
      </Box>
    );
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
                value={endDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <IconButton onClick={() => clearFilters()}>
                <FilterListOff />
              </IconButton>
              <Button
                sx={{ minWidth: 180 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={() => setOpenModal(!openModal)}
              >
                Salida de artículos
              </Button>
            </Box>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <SortComponent tableCellLabel="Nombre" headerName="nombre" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Stock mínimo" headerName="stockMinimo" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent tableCellLabel="Stock" headerName="stockActual" setSortFunction={setSort} />
                    </TableCell>
                    <TableCell>
                      <SortComponent
                        tableCellLabel="Precio Compra"
                        headerName="precioCompra"
                        setSortFunction={setSort}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.map((article) => <TableRowComponent article={article} key={article.id} />)}
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
                count={0}
                onPageChange={(e, value) => {
                  e?.stopPropagation();
                  setPageIndex(value);
                }}
                onRowsPerPageChange={(e: any) => {
                  setPageSize(e.target.value);
                }}
                page={0}
                rowsPerPage={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página"
              />
            </TableContainer>
          </Card>
        </Stack>
      </Stack>
      <Modal open={openModal} onClose={() => setOpenModal(!openModal)}>
        <>
          <ArticlesExitModal
            setOpen={setOpenModal}
            warehouseId={'fc6d0fdd-8cfa-49a7-863e-206a7542a5e5'} //hardcodeo criminal
          />
        </>
      </Modal>
    </>
  );
};

interface TableRowComponentProps {
  article: IExistingArticle;
}
const TableRowComponent: React.FC<TableRowComponentProps> = ({ article }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setOpen(!open)}>
              {article.listaArticuloExistente && article.listaArticuloExistente.length > 0 && !open ? (
                <ExpandMore />
              ) : (
                <ExpandLess />
              )}
            </IconButton>
            {article.nombre}
          </Box>
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
        <TableCell>$ {article.precioCompra}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ padding: 0 }}>
          <Collapse in={open} unmountOnExit>
            <SubItemsTable article={article.listaArticuloExistente} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

interface SubItemsTableProps {
  article: IExistingArticleList[];
}
const SubItemsTable: React.FC<SubItemsTableProps> = ({ article }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Fecha de compra de lote</StyledTableCell>
            <StyledTableCell align="center">Fecha de caducidad</StyledTableCell>
            <StyledTableCell align="center">Stock</StyledTableCell>
            <StyledTableCell align="center">Código de barras</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {article.map((a) => (
            <TableRow key={a.id}>
              <StyledTableCell align="center">{a.fechaCompraLote}</StyledTableCell>
              <StyledTableCell align="center">{returnExpireDate(a.fechaCaducidad)}</StyledTableCell>
              <StyledTableCell align="center">{a.cantidad}</StyledTableCell>
              <StyledTableCell align="center">{a.codigoBarras}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
