import { useRef, useState } from 'react';
import { Button, IconButton, Tooltip, CircularProgress, Grid } from '@mui/material';

import { SearchBar } from '@/components/Inputs/SearchBar';
import { useSubCategoryPagination } from '../stores/subCategoryPagination';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';

import { TableTop, TablePaginated, SelectBasic, MainCard } from '@/common/components';
import { useGetAlmacenes } from '@/hooks/useGetAlmacenes';
import { useGetCategories } from '@/hooks/useGetCategories';

import { useDisableSubCategory } from '../hooks/useDisableSubCategory';
import { getSubCategories } from '../services/subcategories';
import { SubCategoryModal } from '../components/SubCategoryModal';

const SubCategory = () => {
  const [categoryId, setCategoryId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { search, enabled, setSearch, setEnabled } = useSubCategoryPagination((state) => ({
    search: state.search,
    enabled: state.enabled,
    setSearch: state.setSearch,
    setEnabled: state.setEnabled,
  }));

  const [warehouseSelected, setWarehouseSelected] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const { categories, isLoading: isLoadingCategories } = useGetCategories();

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();
  const disableSubCategory = useDisableSubCategory(onSuccess);

  const handleAdd = () => {
    setCategoryId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setCategoryId('');
    setCategoryId(row.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCategoryId('');
  };

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
    },
    {
      header: 'Descripción',
      value: 'descripcion',
    },
    {
      header: 'Categoria',
      value: 'categoria',
    },
    {
      header: 'IVA',
      value: (row: any) => (row.iva ? 'Si' : 'No'),
    },
    {
      header: 'Acciones',
      value: (row: any) => {
        return (
          <>
            <Tooltip title="Editar">
              <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
              <IconButton size="small" onClick={() => disableSubCategory(row.id_Categoria)}>
                {enabled ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
              </IconButton>
            </Tooltip>
          </>
        );
      },
      width: 'auto',
    },
  ];

  return (
    <>
      <MainCard content={false}>
        <TableTop>
          <SearchBar title="Busca la sub categoría..." searchState={setSearch} sx={{ width: '30%' }} />
          <SelectBasic
            sx={{ width: '25%', px: 1 }}
            value={warehouseSelected}
            label="Busqueda por almacén"
            options={almacenes}
            uniqueProperty="id_Almacen"
            displayProperty="nombre"
            onChange={(e: any) => {
              setSelectedCategory(null);
              setWarehouseSelected(e.target.value);
            }}
          />
          {isLoadingCategories ? (
            <CircularProgress />
          ) : (
            <SelectBasic
              sx={{ width: '25%', px: 1 }}
              value={selectedCategory}
              label="Categoria"
              options={categories.filter((cat) => cat.id_Almacen === warehouseSelected)}
              uniqueProperty="id_Categoria"
              displayProperty="nombre"
              onChange={(e: any) => {
                setSelectedCategory(e.target.value);
              }}
            />
          )}
          <Button
            sx={{
              height: '40px',
            }}
            onClick={() => {
              setEnabled(!enabled);
            }}
            startIcon={<ClassOutlinedIcon />}
          >
            {enabled ? 'Mostrar deshabilitadas' : 'Mostrar habilitadas'}
          </Button>
          <Grid>
            <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleAdd()}>
              Agregar
            </Button>
          </Grid>
        </TableTop>

        {(!warehouseSelected || !selectedCategory) && !isLoadingAlmacenes && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <h2>Selecciona almacén y categoria para ver las subcategorias</h2>
          </div>
        )}

        {warehouseSelected && selectedCategory && !isLoadingAlmacenes && (
          <TablePaginated
            ref={tableRef}
            columns={columns}
            fetchData={getSubCategories}
            params={{
              search,
              habilitado: enabled,
              Id_Categoria: selectedCategory || null,
            }}
          ></TablePaginated>
        )}
        <SubCategoryModal open={modalOpen} itemId={categoryId} onClose={handleModalClose} onSuccess={onSuccess} />
      </MainCard>
    </>
    // <Box sx={{ pt: 2 }}>
    //   <Box sx={{ display: 'flex', flex: 1, columnGap: 2 }}>
    //   </Box>
    //   <SubCategoryTable />
    //   <Modal open={open} onClose={() => setOpen(false)}>
    //     <div>
    //       <AddSubCategoryModal open={setOpen} />
    //     </div>
    //   </Modal>
    // </Box>
  );
};

export default SubCategory;
