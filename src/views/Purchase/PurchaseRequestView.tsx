import { Box, Button, Modal } from '@mui/material';
import { PurchaseTabNav } from '../../components/Purchase/PurchaseRequest/SubComponents/PurchaseTabNav';
import { useEffect, useState } from 'react';
import { useDirectlyPurchaseRequestOrderStore } from '../../store/purchaseStore/directlyPurchaseRequestOrder';
import { PurchaseOrderRequest } from '../../components/Purchase/PurchaseRequest/PurchaseOrderRequest/PurchaseOrderRequest';
import { PurchaseOrder } from '../../components/Purchase/PurchaseRequest/PurchaseOrder/PurchaseOrder';
import { PurchaseRequestCard } from '../../components/Purchase/PurchaseRequest/PurchaseRequestCard';
import { usePurchaseRequestNav } from '../../store/purchaseStore/purchaseRequestNav';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { shallow } from 'zustand/shallow';
import { DirectlyPurchaseOrder } from '../../components/Purchase/PurchaseRequest/Modal/DirectlyPurchaseOrder';
import { PurchaseWithoutProvider } from '../../components/Purchase/PurchaseRequest/Modal/PurchaseWithoutProvider';

const getTabView = (value: number) => {
  switch (value) {
    case 0:
      return <PurchaseOrder />;
    // case 1:
    //   return <PurchaseOrderRequest />;
    case 2:
      return <PurchaseRequestCard />;
    default:
      break;
  }
};

const PurchaseRequestView = () => {
  const { clearStates, openPurchaseRequestOrder, setOpenPurchaseRequestOrder } = useDirectlyPurchaseRequestOrderStore(
    (state) => ({
      clearStates: state.clearAllStates,
      openPurchaseRequestOrder: state.openPurchaseRequestOrder,
      setOpenPurchaseRequestOrder: state.setOpenPurchaseRequestOrder,
    }),
    shallow
  );
  const tabValue = usePurchaseRequestNav((state) => state.tabValue);
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
          {/* <Button
            size="large"
            variant="contained"
            onClick={() => setOpenPurchaseWithoutProvider(true)}
            startIcon={<RequestPageIcon />}
          >
            Solicitud sin proveedor
          </Button> */}
          <Button
            size="large"
            variant="contained"
            onClick={() => setOpenPurchaseRequestOrder(true)}
            startIcon={<RequestPageIcon />}
          >
            Orden de compra
          </Button>
        </Box>
        <PurchaseTabNav />
        <Box
          sx={{
            boxShadow: 10,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflowX: 'auto',
            bgcolor: 'white',
          }}
        >
          {getTabView(tabValue)}
        </Box>
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
