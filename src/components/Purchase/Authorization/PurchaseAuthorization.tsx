import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../Inputs/SearchBar";
import { PurchaseAuthorizationTable } from "./PurchaseAuthorizationTable";
import { PurchaseConfigModal } from "./Modal/PurchaseConfigModal";
import Mensaje from "./Modal/Mensaje";

export const PurchaseAuthorization = () => {
  const [open, setOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

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
          <Box>
            <Button
              sx={{ marginRight: "5px" }}
              variant="contained"
              onClick={() => setMessageModalOpen(true)}
            >
              Mensaje personalizado
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Configuración ordenes de compra
            </Button>
          </Box>
        </Stack>
        <SearchBar title="Busca la orden de compra..." searchState={() => {}} />
        <Divider sx={{ my: 1 }} />
        <PurchaseAuthorizationTable />
      </Box>
      <Modal
        open={messageModalOpen}
        onClose={() => {
          setMessageModalOpen(false);
        }}
      >
        <>
          <Mensaje open={setMessageModalOpen} />
        </>
      </Modal>
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
