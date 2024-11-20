import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { usePurchaseRequestNav } from '../../../../store/purchaseStore/purchaseRequestNav';
import { shallow } from 'zustand/shallow';

export const PurchaseTabNav = () => {
  const { tabValue, setTabValue } = usePurchaseRequestNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: 'auto' }}>
      <AppBar
        position="static"
        sx={{
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
          <Tab label={`Ordenes de Compra`} />
          {/* <Tab label={`Solicitudes en Proceso `} /> */}
          {/* <Tab label={`Alertas de Producto `} /> */}
        </Tabs>
      </AppBar>
    </Box>
  );
};
