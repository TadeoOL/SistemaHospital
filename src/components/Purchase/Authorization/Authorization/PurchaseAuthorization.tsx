import { Box, Divider, Stack } from "@mui/material";
import { SearchBar } from "../../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";

const PurchaseAuthorization = () => {
  //   const { enabled, setEnabled, setSearch } = useExistingArticlePagination(
  //     (state) => ({
  //       enabled: state.enabled,
  //       setEnabled: state.setEnabled,
  //       setSearch: state.setSearch,
  //     })
  //   );

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
        <SearchBar title="Busca la orden de compra..." searchState={() => {}} />
        <Divider sx={{ my: 1 }} />
        <PurchaseAuthorizationTable />
      </Box>
    </>
  );
};
export default PurchaseAuthorization;
