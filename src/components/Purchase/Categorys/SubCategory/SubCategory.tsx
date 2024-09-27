import { Box, Button, CircularProgress, Divider, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useState } from 'react';
import { SubCategoryTable } from './SubCategoryTable';
import { AddSubCategoryModal } from './Modal/AddSubCategoryModal';
import { useSubCategoryPagination } from '../../../../store/purchaseStore/subCategoryPagination';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { useGetCategories } from '../../../../hooks/useGetCategories';
import { ICategory } from '../../../../types/types';

const SubCategory = () => {
  const [open, setOpen] = useState(false);
  const { enabled, setSearch, setEnabled, setCategoryId } = useSubCategoryPagination((state) => ({
    enabled: state.enabled,
    setSearch: state.setSearch,
    setEnabled: state.setEnabled,
    setCategoryId: state.setCategoryId
  }));
  const { almacenes } = useGetAlmacenes();
  const [warehouseSelected, setWarehouseSelected] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading: isLoadingCategories} = useGetCategories();
  
  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
        <SearchBar title="Busca la sub categoría..." searchState={setSearch} sx={{ width: '30%' }} />
        <Stack
          sx={{
            flexDirection: 'row',
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2
          }}
        >
          <Divider sx={{ my: 1 }} />
          <Stack sx={{ display: 'flex', flex: 1, maxWidth: 150 }}>
              <TextField
                select
                label="Busqueda por almacén"
                size="small"
                value={warehouseSelected}
                onChange={(e: any) => {
                  setWarehouseSelected(e.target.value);
                }}
              >
                {almacenes.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            {
                isLoadingCategories ?
                  (<CircularProgress />)
                  :
                  (
                  <TextField
                    sx={{ width: 200 }}
                    select
                    label="Categoria"
                    size="small"
                    //helperText={'Selecciona un almacén'}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value ?? null);
                      if(e.target.value !== null){
                        setCategoryId(e.target.value)
                      }
                      else{
                        setCategoryId('')
                      }
                    }}
                  >
                    {categories.filter((cat)=> cat.id_Almacen === warehouseSelected).map((warehouse: ICategory) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.nombre}
                      </MenuItem>
                    ))}
                  </TextField>)
              }
          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            <Button
              onClick={() => {
                setEnabled(!enabled);
              }}
              startIcon={<ClassOutlinedIcon />}
            >
              {enabled ? 'Mostrar sub categorías deshabilitadas' : 'Mostrar sub categorías habilitados'}
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlinedIcon />} onClick={() => setOpen(!open)}>
              Agregar
            </Button>
          </Stack>
        </Stack>
      </Box>
      <SubCategoryTable />
      <Modal open={open} onClose={() => setOpen(false)}>
        <div>
          <AddSubCategoryModal open={setOpen} />
        </div>
      </Modal>
    </Box>
  );
};

export default SubCategory;
