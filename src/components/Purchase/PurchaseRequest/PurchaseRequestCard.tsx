import { Box, Button, Modal, Stack } from "@mui/material";
import { AlertArticlesTable } from "./SubComponents/AlertArticlesTable";
import { RequestPurchasedOrderModal } from "./Modal/RequestPurchasedOrderModal";
import { useArticlesAlertPagination } from "../../../store/purchaseStore/articlesAlertPagination";

export const PurchaseRequestCard = () => {
  const { handleOpen, setHandleOpen } = useArticlesAlertPagination((state) => ({
    handleOpen: state.handleOpen,
    setHandleOpen: state.setHandleOpen,
  }));
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
          <AlertArticlesTable />
        </Box>
      </Box>
      <Modal open={handleOpen} onClose={() => setHandleOpen(false)}>
        <>
          <RequestPurchasedOrderModal open={setHandleOpen} />
        </>
      </Modal>
    </>
  );
};
