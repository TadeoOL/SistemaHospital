import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { AddProviderModal } from "./Modal/AddProviderModal";
import { useState } from "react";
import { SearchBar } from "../../Inputs/SearchBar";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { ProvidersTable } from "./ProvidersTable";
import { useProviderPagination } from "../../../store/purchaseStore/providerPagination";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

export const ProvidersCard = () => {
  const [open, setOpen] = useState(false);
  const { setSearch, enabled, setEnabled } = useProviderPagination((state) => ({
    setSearch: state.setSearch,
    setEnabled: state.setEnabled,
    enabled: state.enabled,
  }));
  return (
    <>
      <Box
        sx={{
          boxShadow: 10,
          borderRadius: 2,
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
              pt: 1,
            }}
          >
            <SearchBar
              title="Busca el proveedor..."
              searchState={setSearch}
              sx={{ width: "30%" }}
            />
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
                startIcon={<InventoryOutlinedIcon />}
              >
                {enabled
                  ? "Mostrar proveedores deshabilitados"
                  : "Mostrar proveedores habilitados"}
              </Button>
              <Button
                sx={{ height: "75%", mt: "8px", marginRight: "8px" }}
                variant="contained"
                onClick={() => setOpen(!open)}
                startIcon={<AddCircleOutlinedIcon />}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>

          <ProvidersTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddProviderModal setOpen={setOpen} />
        </div>
      </Modal>
    </>
  );
};
