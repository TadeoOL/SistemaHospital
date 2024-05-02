import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  // TextField,
  Typography,
  alpha,
  styled,
  tableCellClasses,
} from '@mui/material';
import { ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { IArticleSell, ISell } from '../../types/types';
import { SearchBar } from '../Inputs/SearchBar';
import { getSellStatus, getSellType } from '../../utils/pointOfSaleUtils';
// import { useGetSellsHistory } from '../../../hooks/useGetSellsHistory';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(`${theme.palette.grey[50]}`, 0.8),
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

interface SellsTableProps extends PaginationProps {
  sells: ISell[];
}

interface SellTableBodyProps {
  sells: ISell[];
}

interface SellRowProps {
  sell: ISell;
}

interface ArticlesSoldTableProps {
  articles: IArticleSell[];
}

interface ArticlesSoldTableBodyProps {
  articles: IArticleSell[];
}

interface ArticlesSoldTableRowProps {
  article: IArticleSell;
}

interface PaginationProps {
  count: number;
  pageSize: number;
  pageIndex: number;
  setPageIndex: Function;
  setPageSize: Function;
}
interface ArticlesSoldTableComponentProps extends PaginationProps {
  clearData: Function;
  setSearch: Function;
  data: any[];
  isLoading: boolean;
}

export const ArticlesSoldHistoryTableComponent = (props: ArticlesSoldTableComponentProps) => {
  const { clearData, data, isLoading, setSearch, count, pageIndex, pageSize, setPageIndex, setPageSize } = props;
  // const setSearch = usePosSellsHistoryDataStore((state) => state.setSearch);
  // const clearData = usePosSellsHistoryDataStore((state) => state.clearData);
  // const sellStates = [0, 2];
  // const { isLoading, sellsHistory } = useGetSellsHistory(sellStates);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 4, rowGap: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <SearchBar searchState={setSearch} title="Buscar ventas..." sx={{ flex: 1 }} />
        {/* <Box sx={{ display: 'flex', columnGap: 2, flex: 2 }}>
          <TextField
            label="Fecha inicio"
            size="small"
            type="date"
            // value={startDate}
            InputLabelProps={{ shrink: true }}
            // onChange={(e) => {
            //   setStartDate(e.target.value);
            // }}
          />
          <TextField
            label=" Fecha final"
            size="small"
            type="date"
            // value={endDate}
            InputLabelProps={{ shrink: true }}
            // onChange={(e) => {
            //   setEndDate(e.target.value);
            // }}
          />
        </Box> */}
      </Box>
      {isLoading && data.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            p: 4,
            alignItems: 'center',
            columnGap: 1.5,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h4">Cargando ventas...</Typography>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <SellsTable
          sells={data as ISell[]}
          count={count}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      )}
    </Box>
  );
};

export const SellsTable = (props: SellsTableProps) => {
  const { count, pageIndex, pageSize, setPageIndex, setPageSize } = props;
  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <SellTableHead />
            <SellTableBody sells={props.sells} />
            {props.sells.length > 0 && (
              <SellTableFooter
                count={count}
                pageIndex={pageIndex}
                pageSize={pageSize}
                setPageIndex={setPageIndex}
                setPageSize={setPageSize}
              />
            )}
          </Table>
        </TableContainer>
        {props.sells.length === 0 && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1, p: 6, color: 'gray' }}
          >
            <Info sx={{ width: 50, height: 50 }} />
            <Typography variant="h2">No hay ventas</Typography>
          </Box>
        )}
      </Card>
    </>
  );
};

const SellTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Folio</TableCell>
        <TableCell>Tipo de pago</TableCell>
        <TableCell>Estatus</TableCell>
        <TableCell>Total</TableCell>
      </TableRow>
    </TableHead>
  );
};

const SellTableBody = (props: SellTableBodyProps) => {
  return (
    <TableBody>
      {props.sells.map((sell) => (
        <SellRow sell={sell} key={sell.id} />
      ))}
    </TableBody>
  );
};

export const SellTableFooter = (props: PaginationProps) => {
  const { count, pageIndex, pageSize, setPageIndex, setPageSize } = props;
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
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
      </TableRow>
    </TableFooter>
  );
};

const SellRow = (props: SellRowProps) => {
  const { sell } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', columnGap: 0.5 }}>
            <IconButton onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
            {sell.folio}
          </Box>
        </TableCell>
        <TableCell>{getSellType(sell.tipoPago)}</TableCell>
        <TableCell>{getSellStatus(sell.estadoVenta)}</TableCell>
        <TableCell>${sell.totalVenta}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0 }}>
          <Collapse in={open} unmountOnExit>
            <ArticlesSoldTable articles={sell.articulosVendidos} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ArticlesSoldTable = (props: ArticlesSoldTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <StyledTableCell>Nombre</StyledTableCell>
          <StyledTableCell>Cantidad</StyledTableCell>
          <StyledTableCell>Precio Unitario</StyledTableCell>
        </TableRow>
      </TableHead>
      <ArticlesSoldTableBody articles={props.articles} />
    </Table>
  );
};

const ArticlesSoldTableBody = (props: ArticlesSoldTableBodyProps) => {
  return (
    <TableBody>
      {props.articles.map((article) => (
        <ArticlesSoldTableRow key={article.id} article={article} />
      ))}
    </TableBody>
  );
};

const ArticlesSoldTableRow = (props: ArticlesSoldTableRowProps) => {
  const { article } = props;
  return (
    <TableRow>
      <StyledTableCell>{article.nombre}</StyledTableCell>
      <StyledTableCell>{article.cantidad}</StyledTableCell>
      <StyledTableCell>${article.precioUnitario}</StyledTableCell>
    </TableRow>
  );
};
