import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';
import { useCallback } from 'react';

export const PointOfSaleTabs = () => {
  const tabValue = usePosTabNavStore((state) => state.tabValue);
  const setTabValue = usePosTabNavStore((state) => state.setTabValue);

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
          <Tab label="Venta" value={0} />
          <Tab label="Confirmación de pago" value={1} />
          <Tab label="Historial de Ventas" value={2} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
