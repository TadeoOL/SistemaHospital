import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { useWarehouseTabsNavStore } from '../../../store/warehouseStore/warehouseTabsNav';
import { useShallow } from 'zustand/react/shallow';
import { ArticlesPharmacyTable } from './ArticlesInPharmacyTable';
import { PackageTabs } from './PackageTabs';
import { WarehouseHistoryPharmacy } from './WarehouseHistoryPharmacy';
import { WaitingPackages } from './WaitingPackages';
import { NurseRequestManagementTable } from './NurseRequestManagementTable';
import { SelectWarehouseModal } from './Modal/SelectWarehouseModal';
import { useState } from 'react';
import { IWarehouseData } from '../../../types/types';
import { WarehousePurchases } from '../../Warehouse/WarehouseSelected/TabsView/WarehousePurchases';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

const GetWarehouseView: React.FC = () => {
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  const warehouseIdSeted = usePosTabNavStore((state) => state.warehouseId);

  const tabValue = useWarehouseTabsNavStore(useShallow((state) => state.tabValue));
  switch (tabValue) {
    case 0:
      return <ArticlesPharmacyTable />;
    case 1:
      return <NurseRequestManagementTable />;
    case 2:
      return <WaitingPackages pharmacyFlag={true} />;
    case 3:
      return <WarehousePurchases idWarehouse={warehouseSL?.id_Almacen != null ? warehouseSL.id_Almacen : warehouseIdSeted  } />;
    case 4:
      return <WarehouseHistoryPharmacy />;
    default:
      break;
  }
};

export const PackageView = () => {
  const [openModal, setOpenModal] = useState(localStorage.getItem('pharmacyWarehouse_Selected') == null);//verdarero si aun no se declara/selecciona almacen
  const warehouseSL: IWarehouseData | null = JSON.parse(localStorage.getItem('pharmacyWarehouse_Selected') as string);
  return (
    <Stack>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          mb: 1,
          columnGap: 1,
        }}
      >
        <Typography variant="h4" fontWeight={"bold"} sx={{ mr: 'auto' }} >
          Almacen: {warehouseSL?.nombre}
        </Typography>
        <Button
          size="large"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          Cambiar almacen
        </Button>
      </Box>
      <Stack sx={{ bgcolor: 'background.paper' }}>
        <PackageTabs />
        <Box sx={{ p: 2 }}>
          {<>
            <GetWarehouseView />
            <Modal open={openModal}>
              <SelectWarehouseModal
                setOpen={setOpenModal} />
            </Modal>
          </>}
        </Box>
      </Stack>
    </Stack>
  );
};
