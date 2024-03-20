import { AppBar, Box, Tab, Tabs } from "@mui/material";

export const WarehouseTabs = () => {
  return (
    <Box sx={{ width: "auto" }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Tabs variant="fullWidth">
          <Tab label="Articulos" />
          <Tab label="Subalmacenes" />
          <Tab label="Ingreso de mercancia" />
          <Tab label="Historial de movimiento" />
        </Tabs>
      </AppBar>
    </Box>
  );
};
