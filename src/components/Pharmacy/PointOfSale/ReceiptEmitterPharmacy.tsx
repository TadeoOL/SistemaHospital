import { Card, Modal, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCheckoutDataStore } from '../../../store/checkout/checkoutData';
//import { useCheckoutUserEmitterPaginationStore } from '../../../store/checkout/checkoutUserEmitterPagination';
import { GenerateReceiptModal } from '../../Checkout/Modal/GenerateReceiptModal';
import { CheckoutTableComponent } from '../../Checkout/CheckoutTableComponent';
import { useCheckoutPaginationStore } from '@/store/checkout/checkoutPagination';

const useGetData = () => {
  const fetch = useCheckoutPaginationStore((state) => state.fetchData);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const search = useCheckoutPaginationStore((state) => state.search);
  const sort = useCheckoutPaginationStore((state) => state.sort);
  const setConceptoVenta = useCheckoutPaginationStore((state) => state.setConcept);
  const setStatus = useCheckoutPaginationStore((state) => state.setStatus);

  useEffect(() => {
    setStatus(null)
    setConceptoVenta(1);
    fetch();
  }, [pageIndex, pageSize, search, sort, setConceptoVenta]);
};

export const ReceiptEmitterPharmacy = () => {
  const setIdCaja = useCheckoutDataStore((state) => state.setIdCaja);
  useEffect(() => {
    setIdCaja('');
  }, []);
  useGetData();
  const data = useCheckoutPaginationStore((state) => state.data);
  const count = useCheckoutPaginationStore((state) => state.count);
  const pageIndex = useCheckoutPaginationStore((state) => state.pageIndex);
  const pageSize = useCheckoutPaginationStore((state) => state.pageSize);
  const setPageIndex = useCheckoutPaginationStore((state) => state.setPageIndex);
  const setPageSize = useCheckoutPaginationStore((state) => state.setPageSize);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={4}>
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
