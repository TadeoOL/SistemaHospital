import { Box, Card, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useAuthorizationTabNav } from '../../../store/purchaseStore/authorizationTabNav';
import { shallow } from 'zustand/shallow';
import PurchaseAuthorization from './Authorization/PurchaseAuthorization';
import { PurchaseHistoryAuthorization } from './AuthorizationHistory/PurchaseAuthorization';

export const AuthorizationTabNav = () => {
  const { tabValue, setTabValue } = useAuthorizationTabNav(
    (state) => ({ tabValue: state.tabValue, setTabValue: state.setTabValue }),
    shallow
  );

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setTabValue(newValue);
  }, []);

  const getTabView = () => {
    switch (tabValue) {
      case 0:
        return <PurchaseAuthorization />;
      case 1:
        return <PurchaseHistoryAuthorization />;
    }
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
          <Tab label="Autorizaciones" />
          <Tab label="Historial de Autorizaciones" />
        </Tabs>
      </Box>
      {getTabView()}
    </Card>
  );
};
