import { Box, Button, Modal, Stack } from "@mui/material";
import { useState } from "react";
import { AlertArticlesTable } from "./SubComponents/AlertArticlesTable";
import { RequestPurchasedOrderModal } from "./Modal/RequestPurchasedOrderModal";

export const PurchaseRequestCard = () => {
  const [openDirectlyPurchase, setOpenDirectlyPurchase] = useState(false);
  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          overflowX: "auto",
          bgcolor: "white",
        }}
      >
        <Box sx={{ minWidth: { xs: 950, xl: 0 } }}>
          <Stack spacing={4} sx={{ p: 2 }}>
            <Stack
              sx={{
                flexDirection: "row",
                display: "flex",
                flexGrow: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={() => setOpenDirectlyPurchase(true)}
              >
                Solicitar orden de compra
              </Button>
            </Stack>
            <Stack>
              <AlertArticlesTable />
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Modal
        open={openDirectlyPurchase}
        onClose={() => setOpenDirectlyPurchase(false)}
      >
        <>
          <RequestPurchasedOrderModal open={setOpenDirectlyPurchase} />
        </>
      </Modal>
    </>
  );
};
