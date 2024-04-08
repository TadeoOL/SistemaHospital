import {
  Box,
  Button,
  Card,
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
import { useWarehouseTabsNavStore } from '../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import React, { useEffect, useRef, useState } from 'react';
import { IExistingArticle, IExistingArticleList } from '../../../../types/types';
import { Edit, ExpandLess, ExpandMore, FilterListOff, Info, Save, Warning } from '@mui/icons-material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { shallow } from 'zustand/shallow';
import { ArticlesView } from './Modal/ArticlesOutput';
import { toast } from 'react-toastify';
import { isValidInteger } from '../../../../utils/functions/dataUtils';
import { modifyMinStockExistingArticle } from '../../../../api/api.routes';
import { warning } from '../../../../theme/colors';
import { returnExpireDate } from '../../../../utils/expireDate';

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
    }),
    shallow
  );

  useEffect(() => {
    setWarehouseId(warehouseId);
    fetchExistingArticles();
  }, [search, startDate, endDate, clearFilters]);

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
  };
};
export const WarehouseArticles = () => {
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const { data, setSearch, setEndDate, setStartDate, clearFilters, setPageIndex, setPageSize, startDate, endDate } =
    useGetExistingArticles(warehouseData.id);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Stack sx={{ overflowX: 'auto' }}>
        <Stack spacing={2} sx={{ minWidth: 950 }}>
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
              <Button variant="contained" onClick={() => setOpenModal(!openModal)}>
                Salida de artículos
              </Button>
            </Box>
          </Box>
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre articulo</TableCell>
                    <TableCell>Stock Mínimo</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Precio de compra</TableCell>
                    <TableCell>Precio de venta</TableCell>
                    <TableCell>Acciones</TableCell>
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
          <ArticlesView setOpen={setOpenModal} />
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
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>();
  const articlesData = useExistingArticlePagination(useShallow((state) => state.data));

  const handleSaveValue = async () => {
    if (!textRef.current || textRef.current.value === '') return;
    if (!isValidInteger(textRef.current.value)) return toast.error('Para guardar el valor escribe un numero valido!');
    const value = textRef.current.value;
    const modified = {
      stockMinimo: value,
      id_almacen: useWarehouseTabsNavStore.getState().warehouseData.id,
      id_articulo: article.id,
    };
    try {
      await modifyMinStockExistingArticle(modified);
      modifyArticle(value);
      toast.success('Articulo actualizado con exito!');
    } catch (error) {
      console.log(error);
    }
  };

  const modifyArticle = (stockMin: string) => {
    const newArticle = {
      ...article,
      stockMinimo: parseInt(stockMin),
    };
    const newArticlesList = articlesData.map((a) => {
      if (a.id === newArticle.id) {
        return { ...newArticle };
      }
      return { ...a };
    });
    useExistingArticlePagination.setState({ data: newArticlesList });
  };

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
          {isEditing ? (
            <TextField
              inputProps={{ className: 'tableCell' }}
              className="tableCell"
              placeholder="stock mínimo"
              inputRef={textRef}
            />
          ) : (
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
          )}
        </TableCell>
        <TableCell>{article.stockActual}</TableCell>
        <TableCell>{article.precioCompra}</TableCell>
        <TableCell>{article.precioVenta}</TableCell>
        <TableCell>
          <IconButton
            onClick={() => {
              if (isEditing) {
                handleSaveValue();
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? <Save /> : <Edit />}
          </IconButton>
        </TableCell>
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
