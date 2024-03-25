import {
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import React, { useEffect, useState } from 'react';
import { IExistingArticle, IExistingArticleList } from '../../../../types/types';
import { Edit, ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useExistingArticlePagination } from '../../../../store/warehouseStore/existingArticlePagination';
import { shallow } from 'zustand/shallow';

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
    width: '33.33%',
  },
}));

const useGetExistingArticles = (warehouseId: string) => {
  const { data, setSearch, search, fetchExistingArticles, setWarehouseId } = useExistingArticlePagination(
    (state) => ({
      data: state.data,
      setSearch: state.setSearch,
      search: state.search,
      fetchExistingArticles: state.fetchExistingArticles,
      setWarehouseId: state.setWarehouseId,
    }),
    shallow
  );

  useEffect(() => {
    setWarehouseId(warehouseId);
    fetchExistingArticles();
  }, [search]);

  return {
    data,
    setSearch,
  };
};
export const WarehouseArticles = () => {
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));
  const { data, setSearch } = useGetExistingArticles(warehouseData.id);
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <SearchBar title="Buscar artículos..." sx={{ display: 'flex', flex: 1 }} searchState={setSearch} />
        <Box sx={{ display: 'flex', flex: 2, justifyContent: 'flex-end' }}>
          <Button variant="contained">Salida de artículos</Button>
        </Box>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>Nombre articulo</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Precio de compra</TableCell>
                <TableCell>Factor aplicado</TableCell>
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
              // setPageIndex(value);
              console.log({ value });
            }}
            onRowsPerPageChange={(e: any) => {
              console.log({ e });
              // setPageSize(e.target.value);
            }}
            page={0}
            rowsPerPage={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      </Card>
    </Stack>
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
          <Checkbox />
        </TableCell>
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
        <TableCell>{article.stockMinimo}</TableCell>
        <TableCell>{article.stockActual}</TableCell>
        <TableCell>{article.precioCompra}</TableCell>
        <TableCell>{article.factorAplicado}</TableCell>
        <TableCell>{article.precioVenta}</TableCell>
        <TableCell>
          <IconButton>
            <Edit />
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
          </TableRow>
        </TableHead>
        <TableBody>
          {article.map((a) => (
            <TableRow key={a.id}>
              <StyledTableCell align="center">{a.fechaCompraLote}</StyledTableCell>
              <StyledTableCell align="center">{a.fechaCaducidad}</StyledTableCell>
              <StyledTableCell align="center">{a.cantidad}</StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
