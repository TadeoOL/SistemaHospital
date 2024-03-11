import { Box, Divider, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";
import { usePurchaseAuthorizationHistoryPagination } from "../../../../store/purchaseStore/purchaseAuthorizationHistoryPagination";
import { useShallow } from "zustand/react/shallow";

export const PurchaseHistoryAuthorization = () => {
  const setSearch = usePurchaseAuthorizationHistoryPagination(
    useShallow((state) => state.setSearch)
  );

  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "end",
            p: 1,
          }}
        ></Stack>
        <SearchBar
          title="Busca la orden de compra..."
          searchState={setSearch}
        />
        <Divider sx={{ my: 1 }} />
        <PurchaseAuthorizationTable />
      </Box>
    </>
  );
};
