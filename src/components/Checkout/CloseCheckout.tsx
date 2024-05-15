import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';
import { useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { Report } from '../Commons/Report/Report';
import { hashPaymentsToString } from '../../utils/checkoutUtils';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search]);
};

export const CloseCheckout = () => {
  useGetData();
  const navigate = useNavigate();
  const data = useCheckoutPaginationStore((state) => state.data);
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);

  const formatData = (info: any) => {
    const formatedData = info.map((obj: any) => ({
      folio: obj.folio,
      modulo: obj.moduloProveniente,
      paciente: obj.paciente,
      tipoPago: hashPaymentsToString[obj.tipoPago] || 'Sin tipo de pago',
      totalVenta: obj.totalVenta,
    }));
    return formatedData;
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                sx={{ mr: 3 }}
                variant="contained"
                onClick={() => {
                  setIdCaja('');
                  navigate(`../ventas/historial-cortes`);
                }}
              >
                Regresar
              </Button>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Caja del dia</Typography>
            </Box>
            <Report data={formatData(data)} headers={['Folio', 'Modulo', 'Paciente', 'Tipo de pago', 'Total venta']} />
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={false}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            hideActions
          />
        </Stack>
      </Card>
    </>
  );
};
