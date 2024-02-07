import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PurchaseTabNav } from "./SubComponents/PurchaseTabNav";
import { useState } from "react";
import { DirectlyPurchasedModal } from "./Modal/DirectlyPurchasedModal";

export const PurchaseRequestCard = () => {
  const [openDirectlyPurchase, setOpenDirectlyPurchase] = useState(false);
  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          mt: 4,
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={700} fontSize={18}>
                Compra de medicamentos
              </Typography>
              <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setOpenDirectlyPurchase(true)}
                >
                  Compra directa
                </Button>
                <Button variant="contained">Solicitud de compra</Button>
              </Stack>
            </Stack>
            <Stack>
              <PurchaseTabNav />
              {<Outlet />}
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Modal
        open={openDirectlyPurchase}
        onClose={() => setOpenDirectlyPurchase(false)}
      >
        <>
          <DirectlyPurchasedModal />
        </>
      </Modal>
    </>
  );
};
