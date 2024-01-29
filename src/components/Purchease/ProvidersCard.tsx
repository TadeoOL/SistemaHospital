import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { ProvidersTable } from "./ProvidersTable";
import { AddProviderModal } from "./Modal/AddProviderModal";
import { useState } from "react";
import { SearchBar } from "../Inputs/SearchBar";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

export const ProvidersCard = () => {
  const [open, setOpen] = useState(false);
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
              Proveedores
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={() => setOpen(!open)}
                startIcon={<AddCircleOutlinedIcon />}
              >
                Agregar
              </Button>
            </Box>
          </Stack>
          <SearchBar title="Busca el proveedor..." searchState={() => {}} />
          <Divider sx={{ my: 1 }} />
          <ProvidersTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddProviderModal />
        </div>
      </Modal>
    </>
  );
};
