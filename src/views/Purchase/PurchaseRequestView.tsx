import { Box, Button, Container, Modal } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PurchaseTabNav } from "../../components/Purchase/PurchaseRequest/SubComponents/PurchaseTabNav";
import { useEffect, useState } from "react";
import { DirectlyPurchaseOrder } from "../../components/Purchase/PurchaseRequest/Modal/DirectlyPurchaseOrder";
import { useDirectlyPurchaseRequestOrderStore } from "../../store/purchaseStore/directlyPurchaseRequestOrder";

export const PurchaseRequestView = () => {
  const [openPurchaseRequestOrder, setOpenPurchaseRequestOrder] =
    useState(false);
  const clearStates = useDirectlyPurchaseRequestOrderStore(
    (state) => state.clearAllStates
  );

  useEffect(() => {
    if (openPurchaseRequestOrder) return;
    clearStates();
  }, [openPurchaseRequestOrder]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          mr: 6,
          mt: -4,
        }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={() => setOpenPurchaseRequestOrder(true)}
        >
          Solicitud de orden de compra
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, px: 3, py: 1 }}>
        <Container maxWidth="xl">
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
            {<Outlet />}
          </Box>
        </Container>
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
