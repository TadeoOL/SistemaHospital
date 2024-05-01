import {
  Box,
  Card,
  CircularProgress,
  // Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // TextField,
  Typography,
} from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { Info } from '@mui/icons-material';
import { useEffect } from 'react';
import { useCheckoutHistoryPaginationStore } from '../../../store/pharmacy/sellsHistory/checkoutHistoryPagination';
import { SellTableFooter } from '../ArticlesSoldHistoryTableComponent';
import { ICheckoutHistory } from '../../../types/types';
import { formatDate } from '../../../utils/pointOfSaleUtils';

const isLoading = false;

interface Pagination {
  count: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: Function;
  setPageSize: Function;
}
interface SellTableBodyProps {
  data: ICheckoutHistory[];
}

interface CheckoutHistoryTableProps extends Pagination {
  data: ICheckoutHistory[];
}

interface CheckoutHistoryRowProps {
  checkout: ICheckoutHistory;
}
const useGetAllData = () => {
  const fetchData = useCheckoutHistoryPaginationStore((state) => state.fetchData);
  const startDate = useCheckoutHistoryPaginationStore((state) => state.startDate);
  const setStartDate = useCheckoutHistoryPaginationStore((state) => state.setStartDate);
  const endDate = useCheckoutHistoryPaginationStore((state) => state.endDate);
  const setEndDate = useCheckoutHistoryPaginationStore((state) => state.setEndDate);
  const pageSize = useCheckoutHistoryPaginationStore((state) => state.pageSize);
  const pageIndex = useCheckoutHistoryPaginationStore((state) => state.pageIndex);
  const count = useCheckoutHistoryPaginationStore((state) => state.count);
  const data = useCheckoutHistoryPaginationStore((state) => state.data);
  const setPageIndex = useCheckoutHistoryPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutHistoryPaginationStore((state) => state.setPageSize);
  const clearData = useCheckoutHistoryPaginationStore((state) => state.clearData);
  const setSearch = useCheckoutHistoryPaginationStore((state) => state.setSearch);
  const search = useCheckoutHistoryPaginationStore((state) => state.search);
  const sellValue = useCheckoutHistoryPaginationStore((state) => state.sellValue);
  const setSellValue = useCheckoutHistoryPaginationStore((state) => state.setSellValue);
  const minValue = useCheckoutHistoryPaginationStore((state) => state.minValue);
  const maxValue = useCheckoutHistoryPaginationStore((state) => state.maxValue);

  useEffect(() => {
    fetchData();
  }, [pageSize, startDate, endDate, pageIndex, search]);
  return {
    data,
    isLoading,
    count,
    pageIndex,
    pageSize,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPageIndex,
    setPageSize,
    clearData,
    setSearch,
    sellValue,
    setSellValue,
    minValue,
    maxValue,
  };
};
export const CheckoutCloseHistory = () => {
  const {
    data,
    count,
    setPageIndex,
    setPageSize,
    pageSize,
    pageIndex,
    clearData,
    // setStartDate,
    // setEndDate,
    // startDate,
    // endDate,
    setSearch,
    // setSellValue,
    // sellValue,
    // minValue,
    // maxValue,
  } = useGetAllData();

  useEffect(() => {
    return () => clearData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 4, rowGap: 2, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <SearchBar searchState={setSearch} title="Buscar..." sx={{ flex: 1 }} />
        {/* <Box sx={{ display: 'flex', columnGap: 2, flex: 1 }}>
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
        </Box>
        <Box sx={{ width: 300, flex: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Rango de ventas</Typography>
          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={sellValue}
            onChange={(e, val) => {
              e.preventDefault();
              setSellValue(val as number[]);
            }}
            valueLabelDisplay="auto"
            getAriaValueText={() => 'Hola'}
            title="Holaaa"
            min={minValue}
            max={maxValue}
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
          <Typography variant="h4">Cargando cajas...</Typography>
          <CircularProgress size={30} />;
        </Box>
      ) : (
        <CheckoutHistoryTable
          data={data}
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

const CheckoutHistoryTable = (props: CheckoutHistoryTableProps) => {
  const { count, pageIndex, pageSize, setPageIndex, setPageSize, data } = props;
  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <SellTableHead />
            <SellTableBody data={data} />
            {data.length > 0 && (
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
        {data.length === 0 && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1, p: 6, color: 'gray' }}
          >
            <Info sx={{ width: 50, height: 50 }} />
            <Typography variant="h2">No hay cortes de caja</Typography>
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
        <TableCell>Nombre Usuario</TableCell>
        <TableCell>Fecha Cierre</TableCell>
        <TableCell>Ventas Efectivo</TableCell>
        <TableCell>Ventas Débito</TableCell>
        <TableCell>Ventas Crédito</TableCell>
        <TableCell>Ventas Transferencia</TableCell>
        <TableCell>Total Venta</TableCell>
      </TableRow>
    </TableHead>
  );
};

const SellTableBody = (props: SellTableBodyProps) => {
  return (
    <TableBody>
      {props.data.map((checkout) => (
        <CheckoutHistoryRow checkout={checkout} key={checkout.id} />
      ))}
    </TableBody>
  );
};

const CheckoutHistoryRow = (props: CheckoutHistoryRowProps) => {
  const { checkout } = props;

  return (
    <TableRow>
      <TableCell>{checkout.nombreUsuario}</TableCell>
      <TableCell>{formatDate(checkout.diaCorte)}</TableCell>
      <TableCell>${checkout.efectivo}</TableCell>
      <TableCell>${checkout.debito}</TableCell>
      <TableCell>${checkout.credito}</TableCell>
      <TableCell>${checkout.transferencia}</TableCell>
      <TableCell>${checkout.ventaTotal}</TableCell>
    </TableRow>
  );
};
