import { Box, Card, IconButton, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutClosesTableComponent } from './CheckoutCloseTableComponent';
import { useCheckoutClosePaginationStore } from '../../store/checkout/checkoutClosePagination';
import { Report } from '../Commons/Report/Report';
import { formatDate } from '../../utils/pointOfSaleUtils';
import { SearchBar } from '../Inputs/SearchBar';
import { FilterListOff } from '@mui/icons-material';

export const CloseCheckoutHistory = () => {
  const fetch = useCheckoutClosePaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutClosePaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutClosePaginationStore((state) => state.pageSize);
  const search = useCheckoutClosePaginationStore((state) => state.search);
  const count = useCheckoutClosePaginationStore((state) => state.count);
  const data = useCheckoutClosePaginationStore((state) => state.data);
  const setSearch = useCheckoutClosePaginationStore((state) => state.setSearch);
  const setStartDate = useCheckoutClosePaginationStore((state) => state.setStartDate);
  const setEndDate = useCheckoutClosePaginationStore((state) => state.setEndDate);
  const endDate = useCheckoutClosePaginationStore((state) => state.endDate);
  const startDate = useCheckoutClosePaginationStore((state) => state.startDate);
  const clearFilters = useCheckoutClosePaginationStore((state) => state.clearFilters);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, count, endDate, startDate]);

  const formatData = (info: any) => {
    const formatedData = info.map((obj: any) => ({
      usuario: obj.nombreUsuario,
      dineroInicial: obj.dineroInicial,
      debito: obj.debito,
      credito: obj.credito,
      transferencia: obj.transferencia,
      efectivo: obj.efectivo,
      totalVenta: obj.ventaTotal,
      dineroC: obj.dineroAlCorte,
      fechaC: formatDate(obj.diaHoraCorte),
    }));
    return formatedData;
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <SearchBar
              title="Buscar Corte de caja por nombre..."
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
              <Report
                data={formatData(data)}
                headers={[
                  'Usuario',
                  'Dinero Inicial',
                  'Debito',
                  'Credito',
                  'Transferencia',
                  'Efectivo',
                  'Total venta',
                  'Dinero al corte',
                  'Fecha del corte',
                ]}
              />
            </Box>
          </Box>
          <CheckoutClosesTableComponent />
        </Stack>
      </Card>
    </>
  );
};
