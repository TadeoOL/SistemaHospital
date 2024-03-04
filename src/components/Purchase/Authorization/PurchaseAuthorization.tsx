import { Box, Divider, Stack, Typography } from "@mui/material";
import { SearchBar } from "../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";

export const PurchaseAuthorization = () => {
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
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
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
            p: 3,
          }}
        >
          <Typography fontWeight={700} fontSize={24}>
            Autorización de ordenes de compra
          </Typography>
        </Stack>
        <SearchBar title="Busca la orden de compra..." searchState={() => {}} />
        <Divider sx={{ my: 1 }} />
        <PurchaseAuthorizationTable />
      </Box>
    </>
  );
};
