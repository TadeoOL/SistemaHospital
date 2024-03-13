import { Box, Button, Modal } from "@mui/material";
import { PurchaseTabNav } from "../../components/Purchase/PurchaseRequest/SubComponents/PurchaseTabNav";
import { useEffect, useState } from "react";
import { DirectlyPurchaseOrder } from "../../components/Purchase/PurchaseRequest/Modal/DirectlyPurchaseOrder";
import { useDirectlyPurchaseRequestOrderStore } from "../../store/purchaseStore/directlyPurchaseRequestOrder";
import { PurchaseOrderRequest } from "../../components/Purchase/PurchaseRequest/PurchaseOrderRequest/PurchaseOrderRequest";
import { PurchaseOrder } from "../../components/Purchase/PurchaseRequest/PurchaseOrder/PurchaseOrder";
import { PurchaseRequestCard } from "../../components/Purchase/PurchaseRequest/PurchaseRequestCard";
import { usePurchaseRequestNav } from "../../store/purchaseStore/purchaseRequestNav";
import RequestPageIcon from "@mui/icons-material/RequestPage";

const getTabView = (value: number) => {
  switch (value) {
    case 0:
      return <PurchaseOrder />;
    case 1:
      return <PurchaseOrderRequest />;
    case 2:
      return <PurchaseRequestCard />;
    default:
      break;
  }
};

export const PurchaseRequestView = ({ userRole }: { userRole: any }) => {
  const [openPurchaseRequestOrder, setOpenPurchaseRequestOrder] =
    useState(false);
  const clearStates = useDirectlyPurchaseRequestOrderStore(
    (state) => state.clearAllStates
  );
  const tabValue = usePurchaseRequestNav((state) => state.tabValue);

  useEffect(() => {
    if (openPurchaseRequestOrder) return;
    clearStates();
  }, [openPurchaseRequestOrder]);

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          {userRole === "supplyRoles" && (
            <Button
              size="large"
              variant="contained"
              onClick={() => setOpenPurchaseRequestOrder(true)}
              startIcon={<RequestPageIcon />}
            >
              Solicitud de Compra
            </Button>
          )}
        </Box>
        <PurchaseTabNav />
        <Box
          sx={{
            boxShadow: 10,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflowX: "auto",
            bgcolor: "white",
          }}
        >
          {getTabView(tabValue)}
        </Box>
      </Box>
      <Modal
        open={openPurchaseRequestOrder}
        onClose={() => setOpenPurchaseRequestOrder(false)}
      >
        <>
          <DirectlyPurchaseOrder setOpen={setOpenPurchaseRequestOrder} />
        </>
      </Modal>
    </>
  );
};
