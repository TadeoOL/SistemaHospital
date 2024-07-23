import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { useNavigate } from 'react-router-dom';
import { useCheckoutDataStore } from '../../store/checkout/checkoutData';
import { useCheckoutUserEmitterPaginationStore } from '../../store/checkout/checkoutUserEmitterPagination';
import { ReporteCaja } from '../Commons/Report/ReporteCaja';

const useGetData = () => {
  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const search = useCheckoutUserEmitterPaginationStore((state) => state.search);
  const sort = useCheckoutUserEmitterPaginationStore((state) => state.sort);
  const setStatus = useCheckoutUserEmitterPaginationStore((state) => state.setStatus);
  useEffect(() => {
    setStatus(404);
    fetch();

    return () => {
      setStatus(1);
    };
  }, [pageIndex, pageSize, search, sort]);
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
  const idCaja = useCheckoutDataStore((state) => state.idCajaSearch);

  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);

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
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Caja del dia 5</Typography>
            </Box>
            <ReporteCaja id_CajaPrincipal={idCaja} />
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={true}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            hideActions
            enableEditNote
            refetch={fetch}
            fromPointOfSale={false}
          />
        </Stack>
      </Card>
    </>
  );
};
