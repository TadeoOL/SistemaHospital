import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWarehouseById } from '../../../api/api.routes';
import LoadingView from '../../../views/LoadingView/LoadingView';
import { Box, Stack, Typography } from '@mui/material';
import { WarehouseTabs } from './WarehouseTabs';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { WarehouseArticles } from './TabsView/WarehouseArticles';
import { SubWarehouses } from './TabsView/SubWarehouses';
import { NotFoundPage } from '../../../views/404Page';

const GetWarehouseView: React.FC = () => {
  const tabValue = useWarehouseTabsNavStore(useShallow((state) => state.tabValue));
  switch (tabValue) {
    case 0:
      return <WarehouseArticles />;
    case 1:
      return <SubWarehouses />;
    default:
      break;
  }
};

const useGetWarehouseSelected = (warehouseId: string | undefined) => {
  const [isLoadingWarehouse, setIsLoadingWarehouse] = useState(true);
  const [error, setError] = useState(false);
  const setWarehouseData = useWarehouseTabsNavStore(useShallow((state) => state.setWarehouseData));

  useEffect(() => {
    if (!warehouseId) return;
    const fetch = async () => {
      setIsLoadingWarehouse(true);
      try {
        const warehouse = await getWarehouseById(warehouseId);
        setWarehouseData(warehouse);
      } catch (error) {
        console.log('error');
        setError(true);
      } finally {
        setIsLoadingWarehouse(false);
      }
    };
    fetch();
  }, [warehouseId]);
  return { isLoadingWarehouse, error };
};

const WarehouseSelected = () => {
  const { warehouseId } = useParams();
  const { isLoadingWarehouse, error } = useGetWarehouseSelected(warehouseId);
  const warehouseData = useWarehouseTabsNavStore(useShallow((state) => state.warehouseData));

  console.log({ warehouseData });
  if (isLoadingWarehouse) return <LoadingView />;
  if (error) return <NotFoundPage />;
  return (
    <Stack>
      <Typography variant="h2">Almacén {warehouseData.nombre}</Typography>
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <WarehouseTabs />
        <Box sx={{ p: 2 }}>
          <GetWarehouseView />
        </Box>
      </Stack>
    </Stack>
  );
};
export default WarehouseSelected;