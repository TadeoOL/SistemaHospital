import { useCallback } from 'react';
import { useInvoiceTabStore } from '../../store/invoice/invoiceTab';
import { AppBar, Box, Tab, Tabs } from '@mui/material';

export const InvoiceTabs = () => {
  const tabValue = useInvoiceTabStore((state) => state.tabValue);
  const setTabValue = useInvoiceTabStore((state) => state.setTabValue);

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
          <Tab label="Pacientes" value={0} />
          <Tab label="Hospital" value={1} />
        </Tabs>
      </AppBar>
    </Box>
  );
};
