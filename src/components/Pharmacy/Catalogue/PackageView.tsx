import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWarehouseById } from '../../../api/api.routes';
import LoadingView from '../../../views/LoadingView/LoadingView';
import { Box, Stack } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { NotFoundPage } from '../../../views/404Page';
import PackageCatalogue from './PackageCatalogue';
import { PackageCatalogueTable } from './PackageCatalogueTable';
import { PackageTabs } from './PackageTabs';

const GetWarehouseView: React.FC = () => {
  const tabValue = useWarehouseTabsNavStore(useShallow((state) => state.tabValue));
  switch (tabValue) {
    case 0:
      return <PackageCatalogue />;
    case 1:
      return <PackageCatalogueTable />;
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
}
