import { Box, Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDirectlyPurchaseRequestOrderStore } from '../../store/purchaseStore/directlyPurchaseRequestOrder';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { shallow } from 'zustand/shallow';
import { DirectlyPurchaseOrder } from '../../components/Purchase/PurchaseRequest/Modal/DirectlyPurchaseOrder';
import { PurchaseWithoutProvider } from '../../components/Purchase/PurchaseRequest/Modal/PurchaseWithoutProvider';
import { PurchaseOrder } from '@/components/Purchase/PurchaseRequest/PurchaseOrder/PurchaseOrder';

const PurchaseRequestView = () => {
  const { clearStates, openPurchaseRequestOrder, setOpenPurchaseRequestOrder } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      clearStates: state.clearAllStates,
      openPurchaseRequestOrder: state.openPurchaseRequestOrder,
      setOpenPurchaseRequestOrder: state.setOpenPurchaseRequestOrder,
    }),
    shallow
  );
  const [openPurchaseWithoutProvider, setOpenPurchaseWithoutProvider] = useState(false);
  // const isAdminPurchase = useAuthStore(useShallow((state) => state.isAdminPurchase));

  useEffect(() => {
    if (openPurchaseRequestOrder) return;
    clearStates();
  }, [openPurchaseRequestOrder]);
  return (
    <>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            mb: 1,
            columnGap: 1,
          }}
        >
          <Button
            size="large"
            variant="contained"
            onClick={() => setOpenPurchaseRequestOrder(true)}
            startIcon={<RequestPageIcon />}
          >
            Orden de compra
          </Button>
        </Box>
        <PurchaseOrder />
      </Box>
      <Modal
        open={openPurchaseRequestOrder}
        onClose={() => {
          setOpenPurchaseRequestOrder(false);
        }}
      >
        <>
          <DirectlyPurchaseOrder setOpen={setOpenPurchaseRequestOrder} />
        </>
      </Modal>
      <Modal
        open={openPurchaseWithoutProvider}
        onClose={() => {
          setOpenPurchaseWithoutProvider(false);
        }}
      >
        <>
          <PurchaseWithoutProvider setOpen={setOpenPurchaseWithoutProvider} />
        </>
      </Modal>
    </>
  );
};
export default PurchaseRequestView;
