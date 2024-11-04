import { Box, Card, Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { Rooms } from './Rooms';
import { TypesRoom } from '../TypesRoom/TypesRoom';
import { useRoomsTabNav } from '../../../store/programming/roomsTabNav';

export const RoomsTabNav = () => {
  const { tabValue, setTabValue } = useRoomsTabNav(
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
        return <Rooms />;
      case 1:
        return <TypesRoom />;
    }
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
          <Tab label="Gestión de espacios hospitalarios" />
          <Tab label="Categorías de espacios hospitalarios" />
        </Tabs>
      </Box>
      {getTabView()}
    </Card>
  );
};
