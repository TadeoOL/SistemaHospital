import { MainCard } from '@/common/components';
import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/material';
import { useState } from 'react';
import NormalRoomsTab from './normal-rooms/screens/NormalRoomsTab';
import OperatingRoomsTab from './operating-rooms/screens/OperatingRoomsTab';

const Rooms = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [<NormalRoomsTab />, <OperatingRoomsTab />];

  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setSelectedTab(newValue);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={onChangeTab} variant="fullWidth">
          <Tab label="Cuartos" />
          <Tab label="Quirofanos" />
        </Tabs>
      </Box>
      {tabs[selectedTab]}
    </MainCard>
  );
};

export default Rooms;
