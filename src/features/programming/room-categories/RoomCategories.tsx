import { MainCard } from '@/common/components';
import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/material';
import { useState } from 'react';
import OperatingRoomType from './operating-room-categories/screens/OperatingRoomTab';
import NormalRoomTab from './normal-room-categories/screens/NormalRoomCategoriesTab';

const RoomCategories = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [<NormalRoomTab />, <OperatingRoomType />];

  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setSelectedTab(newValue);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={onChangeTab} variant="fullWidth">
          <Tab label="Categorías de Cuartos" />
          <Tab label="Categoria de Quirofanos" />
        </Tabs>
      </Box>
      {tabs[selectedTab]}
    </MainCard>
  );
};

export default RoomCategories;
