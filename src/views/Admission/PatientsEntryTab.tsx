import { AppBar, Box, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { usePatientEntryTabStore } from '../../store/admission/usePatientEntryTab';

export const PatientsEntryTab = () => {
  const tabValue = usePatientEntryTabStore((state) => state.tabValue);
  const setTabValue = usePatientEntryTabStore((state) => state.setTabValue);

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
          <Tab label="Admision" value={1} />
          <Tab label="SAMI" value={2} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
