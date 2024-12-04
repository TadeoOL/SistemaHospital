import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

export const PackageTabs = () => {
  const { tabValue, setTabValue } = useWarehouseTabsNavStore(
    (state) => ({
      tabValue: state.tabValue,
      setTabValue: state.setTabValue,
      warehouseData: state.warehouseData,
    }),
    shallow
  );

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  }, []);
  return (
    <Box sx={{ width: 'auto' }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Tabs variant="fullWidth" value={tabValue} onChange={handleChange}>
          <Tab label="Artículos" value={0} />
          <Tab label="Solicitudes de Enfermeros" value={1} />
          <Tab label="Paquetes en espera" value={2} />
          <Tab label="Solicitud de Almacenes" value={3} />
          <Tab label="Movimientos" value={4} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
