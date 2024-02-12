import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";

export const PurchaseAuthorization = () => {
  const [open, setOpen] = useState(false);
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
          overflowX: "auto",
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            minWidth: { xs: 950, xl: 0 },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
            }}
          >
            <Typography fontWeight={700} fontSize={24}>
              Cotizaciones realizadas
            </Typography>
          </Stack>
          <SearchBar
            title="Busca el articulo existente..."
            searchState={() => {}}
          />
          <Divider sx={{ my: 1 }} />
          <PurchaseAuthorizationTable />
        </Box>
      </Box>
    </>
  );
};
