import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useDailyOperatingTabNavStore } from '../../../store/operatingRoom/dailyOperatingTabNav';

export const DailyOperatingTabs = () => {
  const tabValue = useDailyOperatingTabNavStore((state) => state.tabValue);
  const setTabValue = useDailyOperatingTabNavStore((state) => state.setTabValue);

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
          <Tab label="Cirugías del dia" value={0} />
          <Tab label="Historial de cirugías" value={1} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
