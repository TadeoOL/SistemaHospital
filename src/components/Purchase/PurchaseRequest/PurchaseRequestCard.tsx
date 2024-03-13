import { Box, Modal } from "@mui/material";
import { AlertArticlesTable } from "./SubComponents/AlertArticlesTable";
import { RequestPurchasedOrderModal } from "./Modal/RequestPurchasedOrderModal";
import { useArticlesAlertPagination } from "../../../store/purchaseStore/articlesAlertPagination";
import { shallow } from "zustand/shallow";

export const PurchaseRequestCard = () => {
  const userRole = "supplyRoles";
  const { handleOpen, setHandleOpen } = useArticlesAlertPagination(
    (state) => ({
      handleOpen: state.handleOpen,
      setHandleOpen: state.setHandleOpen,
      cleanAllData: state.cleanAllData,
    }),
    shallow
  );

  return (
    <>
      <Box sx={{ minWidth: { xs: 950, xl: 0 } }}>
        <AlertArticlesTable userRole={userRole} />
      </Box>

      <Modal
        open={handleOpen}
        onClose={() => {
          setHandleOpen(false);
        }}
      >
        <>
          <RequestPurchasedOrderModal open={setHandleOpen} isAlert={true} />
        </>
      </Modal>
    </>
  );
};
