import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { Report } from '../Commons/Report/Report';
import { hashPaymentsToString } from '../../utils/checkoutUtils';
import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';

const useGetData = () => {
  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const search = useCheckoutUserEmitterPaginationStore((state) => state.search);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search]);
};

export const CloseCheckout = () => {
  useGetData();
  const navigate = useNavigate();
  const data = useCheckoutUserEmitterPaginationStore((state) => state.data);
  const count = useCheckoutUserEmitterPaginationStore((state) => state.count);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutUserEmitterPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutUserEmitterPaginationStore((state) => state.setPageSize);
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);
  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);

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
            enableEditNote
            refetch={fetch}
          />
        </Stack>
      </Card>
    </>
  );
};
