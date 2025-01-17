import { Box, Button, Modal, Stack } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useState } from 'react';
import { CategoryTable } from './CategoryTable';
import { AddCategoryModal } from './Modal/AddCategoryModal';
import { useCategoryPagination } from '../../../../store/purchaseStore/categoryPagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';

const Category = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setEnabled, setSearch } = useCategoryPagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
  }));

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
          }}
        >
          <SearchBar title="Busca la categoría..." searchState={setSearch} sx={{ width: '30%' }} />
          <Button
            onClick={() => {
              setEnabled(!enabled);
            }}
            startIcon={<ClassOutlinedIcon />}
          >
            {enabled ? 'Mostrar categorías deshabilitadas' : 'Mostrar categorías habilitados'}
          </Button>
          <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => setOpen(!open)}>
            Agregar
          </Button>
        </Stack>
      </Box>
      <CategoryTable />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddCategoryModal open={setOpen} />
        </div>
      </Modal>
    </Box>
  );
};

export default Category;
