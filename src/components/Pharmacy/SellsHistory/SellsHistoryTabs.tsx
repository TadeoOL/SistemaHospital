import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useSellsHistoryTabNavStore } from '../../../store/pharmacy/sellsHistory/sellsHistoryTabNav';

export const SellsHistoryTabs = () => {
  const tabValue = useSellsHistoryTabNavStore((state) => state.tabValue);
  const setTabValue = useSellsHistoryTabNavStore((state) => state.setTabValue);

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
          <Tab label="Historial de cortes de caja" value={1} />
          <Tab label="Historial de ventas" value={2} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
