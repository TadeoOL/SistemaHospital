import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

export const PackageTabs = () => {
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
          <Tab label="Catalogo" value={0}/>
          <Tab label="Artículos" value={1}/>
        </Tabs>
      </AppBar>
    </Box>
  );
};
