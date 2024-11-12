import { Box, Card, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
import { useCheckoutUserEmitterPaginationStore } from '../../../store/checkout/checkoutUserEmitterPagination';
import { GenerateReceiptModal } from '../../Checkout/Modal/GenerateReceiptModal';
import { CheckoutTableComponent } from '../../Checkout/CheckoutTableComponent';

const useGetData = () => {
  const fetch = useCheckoutUserEmitterPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const search = useCheckoutUserEmitterPaginationStore((state) => state.search);
  const sort = useCheckoutUserEmitterPaginationStore((state) => state.sort);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search, sort]);
};

export const ReceiptEmitterPharmacy = () => {
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);
  useEffect(() => {
    setIdCaja('');
  }, []);
  useGetData();
  const data = useCheckoutUserEmitterPaginationStore((state) => state.data);
  const count = useCheckoutUserEmitterPaginationStore((state) => state.count);
  const pageIndex = useCheckoutUserEmitterPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutUserEmitterPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutUserEmitterPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutUserEmitterPaginationStore((state) => state.setPageSize);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Departamento</Typography>
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={false}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
            fromPointOfSale={true}
          />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <GenerateReceiptModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
