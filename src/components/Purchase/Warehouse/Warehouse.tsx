import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../../Inputs/SearchBar";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { PurchaseWarehouseTable } from "./WarehouseTable";
import { useWarehousePagination } from "../../../store/purchaseStore/warehousePagination";
import { AddPurchaseWarehouseModal } from "./Modal/AddWarehouseModal";

export const Warehouse = () => {
  const [open, setOpen] = useState(false);
  const { setSearch, enabled, setEnabled } = useWarehousePagination(
    (state) => ({
      setSearch: state.setSearch,
      setEnabled: state.setEnabled,
      enabled: state.enabled,
    })
  );
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
              alignItems: "center",
              p: 3,
            }}
          >
            <Typography fontWeight={700} fontSize={24}>
              {enabled ? "Almacenes" : "Almacenes deshabilitados"}
            </Typography>
            <Stack sx={{ flexDirection: "row", columnGap: 2 }}>
              <Button
                onClick={() => {
                  setEnabled(!enabled);
                }}
              >
                {enabled
                  ? "Mostrar almacenes deshabilitados"
                  : "Mostrar almacenes habilitados"}
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpen(!open)}
                startIcon={<AddCircleOutlinedIcon />}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
          <SearchBar title="Buscar el almacén..." searchState={setSearch} />
          <Divider sx={{ my: 1 }} />
          <PurchaseWarehouseTable />
        </Box>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddPurchaseWarehouseModal open={setOpen} />
        </div>
      </Modal>
    </>
  );
};
