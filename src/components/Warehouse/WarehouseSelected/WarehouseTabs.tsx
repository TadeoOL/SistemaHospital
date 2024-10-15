import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

export const WarehouseTabs = () => {
  const { tabValue, setTabValue, warehouseData } = useWarehouseTabsNavStore(
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
          <Tab label="Artículos" />
          {!warehouseData.esSubAlmacen && <Tab label="Sub Almacenes" />}
          <Tab label="Solicitud de Productos" value={2} />
          {/*<Tab label="Autorización de Salidas" value={3} />*/}
          <Tab label="Historial de Movimiento" value={4} />
          {/*<Tab label="Paquete de Artículos" value={5} />*/}
        </Tabs>
      </AppBar>
    </Box>
  );
};
