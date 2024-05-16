import { Box, Button, Card, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CheckoutCloseModal } from './Modal/CheckoutCloseModal';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);

  useEffect(() => {
    fetch();
  }, [pageIndex, pageSize, search]);
};

export const PointOfSaleCheckout = () => {
  useGetData();
  const [open, setOpen] = useState(false);
  const data = useCheckoutPaginationStore((state) => state.data);
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Caja del dia</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Cerrar caja
            </Button>
          </Box>
          <CheckoutTableComponent
            data={data}
            admin={true}
            count={count}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageIndex={setPageIndex}
            setPageSize={setPageSize}
          />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <CheckoutCloseModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
