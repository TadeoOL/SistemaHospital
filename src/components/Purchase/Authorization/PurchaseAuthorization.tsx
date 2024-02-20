import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";
import { PurchaseConfigModal } from "./Modal/PurchaseConfigModal";

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
              alignItems: "end",
              p: 3,
            }}
          >
            <Typography fontWeight={700} fontSize={24}>
              Autorización de ordenes de compra
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Configuración ordenes de compra
            </Button>
          </Stack>
          <SearchBar
            title="Busca la orden de compra..."
            searchState={() => {}}
          />
          <Divider sx={{ my: 1 }} />
          <PurchaseAuthorizationTable />
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <PurchaseConfigModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};
