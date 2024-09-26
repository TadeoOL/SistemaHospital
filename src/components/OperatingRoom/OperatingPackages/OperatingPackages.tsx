import { Box, Button, CircularProgress, Divider, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
//import { RecoveryRoomsTable } from './RecoveryRoomsTable';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { PackageModal } from '../../Warehouse/WarehouseSelected/TabsView/Modal/PackageModal';
import { PackageCatalogueTable } from './PackageCatalogueTable';
import { useState } from 'react';
import { usePackagePaginationStore } from '../../../store/warehouseStore/packagesPagination';
import { useGetAlmacenes } from '../../../hooks/useGetAlmacenes';
import { usePosTabNavStore } from '../../../store/pharmacy/pointOfSale/posTabNav';

    {/*<Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 4,
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <SearchBar searchState={setSearch} title="Buscar la sala de recuperación..." sx={{ flex: 1 }} />
      </Box>
      <RecoveryRoomsTable />
    
    </Box>*/}

export const OperatingPackages = () => {
    const [open, setOpen] = useState(false);
    const warehouseIdSeted: string = usePosTabNavStore((state) => state.warehouseId);
    const { setSearch } = usePackagePaginationStore((state) => ({
      setSearch: state.setSearch,
    }));
    const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const warehouseId = usePosTabNavStore((state) => state.warehouseId);
  const [warehouseSelected, setWarehouseSelected] = useState<string>(warehouseId);
console.log(warehouseIdSeted);
  return (
        <>
      <Box
        sx={{
          boxShadow: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          overflowX: 'auto',
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            minWidth: { xs: 950, xl: 0 },
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              pt: 3,
            }}
          >
            <SearchBar title="Busca el paquete por nombre..." searchState={setSearch} sx={{ width: '30%' }} />
            <Stack>
        {
        isLoadingAlmacenes ?
        (<CircularProgress />)
        :
        (<TextField
          sx={{ width:150 }}
          select
          label="Almacén"
          size="small"
          //helperText={'Selecciona un almacén'}
          value={warehouseSelected}
          onChange={(e) => {
            setWarehouseSelected(e.target.value);
          }}
        >
          {almacenes.map((warehouse) => (
            <MenuItem key={warehouse.id} value={warehouse.id}>
              {warehouse.nombre}
            </MenuItem>
          ))}
        </TextField>)}
      </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
              <Button
                sx={{ height: '75%', mt: '8px', marginRight: '20px' }}
                variant="contained"
                startIcon={<AddCircleOutlinedIcon />}
                onClick={() => setOpen(!open)}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>

          <PackageCatalogueTable />
        </Box>
      </Box>
      <Modal open={open} >
        <>
          <PackageModal setOpen={setOpen} warehouseId={warehouseSelected} />
        </>
      </Modal>
    </>
  );
};
