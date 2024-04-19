import { Box, Button, Divider, Modal, Stack } from '@mui/material';
import { useState } from 'react';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { SearchBar } from '../../../Inputs/SearchBar';
import { usePackagePaginationStore } from '../../../../store/warehouseStore/packagesPagination'; //QUITAR CAMBIAR
import { PackageCatalogueTable } from './PackageCatalogueTable';
import { PackageModal } from './Modal/PackageModal';

const PackageCatalogue = () => {
  const [open, setOpen] = useState(false);
  const { setSearch } = usePackagePaginationStore((state) => ({
    setSearch: state.setSearch,
  }));

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
            <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%' }} />
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <PackageModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};

export default PackageCatalogue;
