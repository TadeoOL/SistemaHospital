import { Box, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutClosesTableComponent } from './CheckoutCloseTableComponent';
import { useCheckoutClosePaginationStore } from '../../store/checkout/checkoutClosePagination';
import { Report } from '../Commons/Report/Report';
import { formatDate } from '../../utils/pointOfSaleUtils';

const useGetData = () => {
  const fetch = useCheckoutClosePaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutClosePaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutClosePaginationStore((state) => state.pageSize);
  const search = useCheckoutClosePaginationStore((state) => state.search);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search]);
};

export const CloseCheckoutHistory = () => {
  useGetData();
  const data = useCheckoutClosePaginationStore((state) => state.data);

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
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Historial de cortes</Typography>
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
          <CheckoutClosesTableComponent data={data} />
        </Stack>
      </Card>
    </>
  );
};
