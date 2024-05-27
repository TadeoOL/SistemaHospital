import { Box, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutClosesTableComponent } from './CheckoutCloseTableComponent';
import { useCheckoutClosePaginationStore } from '../../store/checkout/checkoutClosePagination';
import { Report } from '../Commons/Report/Report';
import { formatDate } from '../../utils/pointOfSaleUtils';

export const CloseCheckoutHistory = () => {
  const fetch = useCheckoutClosePaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutClosePaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutClosePaginationStore((state) => state.pageSize);
  const search = useCheckoutClosePaginationStore((state) => state.search);
  const count = useCheckoutClosePaginationStore((state) => state.count);
  const data = useCheckoutClosePaginationStore((state) => state.data);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, count]);

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
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Historial de Cortes</Typography>
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
          <CheckoutClosesTableComponent />
        </Stack>
      </Card>
    </>
  );
};
