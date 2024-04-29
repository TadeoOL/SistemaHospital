import { Box, Stack } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { ArticlesPharmacyTable } from './ArticlesInPharmacyTable';
import { PackageTabs } from './PackageTabs';
import { WarehouseHistoryPharmacy } from './WarehouseHistoryPharmacy';
import { WaitingPackages } from './WaitingPackages';

const GetWarehouseView: React.FC = () => {
  const tabValue = useWarehouseTabsNavStore(useShallow((state) => state.tabValue));
  switch (tabValue) {
    case 0:
      return <ArticlesPharmacyTable />;
    case 1:
      return <WaitingPackages />;
    case 2:
      return <WarehouseHistoryPharmacy />;
    default:
      break;
  }
};

export const PackageView = () => {
  return (
    <Stack>
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <PackageTabs />
        <Box sx={{ p: 2 }}>
          <GetWarehouseView />
        </Box>
      </Stack>
    </Stack>
  );
};
