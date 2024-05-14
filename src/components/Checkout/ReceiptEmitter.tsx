import { Box, Button, Card, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CheckoutTableComponent } from './CheckoutTableComponent';
import { GenerateReceiptModal } from './Modal/GenerateReceiptModal';
import { useCheckoutPaginationStore } from '../../store/checkout/checkoutPagination';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);

  useEffect(() => {
    console.log(pageIndex);
    fetch();
  }, [pageIndex, pageSize, search]);
};

export const ReceiptEmitter = () => {
  useGetData();
  const data = useCheckoutPaginationStore((state) => state.data);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Departamento</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Generar pase a caja
            </Button>
          </Box>
          <CheckoutTableComponent data={data} />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <GenerateReceiptModal setOpen={setOpen} from="toluca" />
        </>
      </Modal>
    </>
  );
};
