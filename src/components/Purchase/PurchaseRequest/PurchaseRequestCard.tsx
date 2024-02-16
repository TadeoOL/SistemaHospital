import { Box, Button, Modal, Stack } from "@mui/material";
import { AlertArticlesTable } from "./SubComponents/AlertArticlesTable";
import { RequestPurchasedOrderModal } from "./Modal/RequestPurchasedOrderModal";
import { SearchBar } from "../../Inputs/SearchBar";
import { useArticlesAlertPagination } from "../../../store/purchaseStore/articlesAlertPagination";

export const PurchaseRequestCard = () => {
  const { handleOpen, setHandleOpen } = useArticlesAlertPagination((state) => ({
    handleOpen: state.handleOpen,
    setHandleOpen: state.setHandleOpen,
  }));
  const setSearch = useArticlesAlertPagination((state) => state.setSearch);
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
              <Button variant="contained" onClick={() => setHandleOpen(true)}>
                Solicitar orden de compra
              </Button>
            </Stack>
            <SearchBar title="Buscar el articulo..." searchState={setSearch} />
            <Stack>
              <AlertArticlesTable />
            </Stack>
          </Stack>
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
