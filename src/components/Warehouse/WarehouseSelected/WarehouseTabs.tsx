import { AppBar, Box, Tab, Tabs } from "@mui/material";
import { useWarehouseTabsNavStore } from "../../../store/warehouseStore/warehouseTabsNav";
import { useCallback } from "react";

export const WarehouseTabs = () => {
  const { tabValue, setTabValue } = useWarehouseTabsNavStore((state) => ({
    tabValue: state.tabValue,
    setTabValue: state.setTabValue,
  }));

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      event.stopPropagation();
      setTabValue(newValue);
    },
    []
  );
  return (
    <Box sx={{ width: "auto" }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Tabs variant="fullWidth" value={tabValue} onChange={handleChange}>
          <Tab label="Articulos" />
          <Tab label="Subalmacenes" />
          <Tab label="Ingreso de mercancia" />
          <Tab label="Historial de movimiento" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
