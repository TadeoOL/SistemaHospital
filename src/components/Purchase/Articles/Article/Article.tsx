import { Button, CircularProgress, Divider, IconButton, MenuItem, Modal, Stack, TextField } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useEffect, useState } from 'react';
import { ArticleTable } from './ArticleTable';
import { AddArticleModal } from './Modal/AddArticleModal';
import { useArticlePagination } from '../../../../store/purchaseStore/articlePagination';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { useGetCategories } from '../../../../hooks/useGetCategories';
import { ICategory, ISubCategory } from '../../../../types/types';
import { FilterListOff } from '@mui/icons-material';
import { TableCard } from '../../../../common/components/TableCard';
import { TableCardTop } from '../../../../common/components/TableCardTop';
// import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';

const Article = () => {
  const [open, setOpen] = useState(false);
  // const [warehouseSelected, setWarehouseSelected] = useState('');
  //const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  // const { almacenes } = useGetAlmacenes();
  const { almacenes } = useGetAlmacenes();
  const {
    enabled,
    subcategory,
    setEnabled,
    setSearch,
    refetchArticles,
    cleanArticles,
    warehouseSelected,
    setWarehouseSelected,
    setSubcategory,
  } = useArticlePagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
    setSubcategory: state.setSubcategory,
    subcategory: state.subcategory,
    cleanArticles: state.cleanArticles,
    refetchArticles: state.fetchArticles,
    warehouseSelected: state.warehouseSelected,
    setWarehouseSelected: state.setWarehouseSelected,
  }));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState<ISubCategory[] | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    refetchArticles();
  }, [warehouseSelected, subcategory]);

  return (
    <>
      <TableCard>
        <TableCardTop>
          <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%' }} />
          <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
            <TextField
              select
              label="Busqueda por almacén"
              size="small"
              value={warehouseSelected}
              onChange={(e: any) => {
                console.log(e.target.value);
                setWarehouseSelected(e.target.value);
              }}
            >
              {almacenes.map((warehouse) => (
                <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                  {warehouse.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {isLoadingCategories ? (
            <CircularProgress />
          ) : (
            <>
              <TextField
                sx={{ width: 150 }}
                select
                label="Categoria"
                size="small"
                //helperText={'Selecciona un almacén'}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value ?? null);
                  if (e.target.value !== null) {
                    setSelectedCategorySubcategories(
                      categories.find((cat) => cat.id_Categoria === e.target.value)?.subCategorias ?? null
                    );
                  } else {
                    setSelectedCategorySubcategories(null);
                  }
                }}
              >
                {categories
                  .filter((cat) => cat.id_Almacen === warehouseSelected)
                  .map((warehouse: ICategory) => (
                    <MenuItem key={warehouse.id_Almacen} value={warehouse.id_Almacen}>
                      {warehouse.nombre}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                sx={{ width: 150 }}
                select
                label="Subcategoria"
                size="small"
                //helperText={'Selecciona un almacén'}
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value ?? null);
                  setSubcategory(e.target.value ?? '');
                }}
              >
                {selectedCategorySubcategories ? (
                  selectedCategorySubcategories.map((warehouse: ISubCategory) => (
                    <MenuItem key={warehouse.id_SubCategoria} value={warehouse.id_SubCategoria}>
                      {warehouse.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <></>
                )}
              </TextField>
            </>
          )}
          <IconButton
            onClick={() => {
              cleanArticles();
              setSubcategory('');
              setSelectedCategory(null);
              setSelectedCategorySubcategories(null);
            }}
          >
            <FilterListOff />
          </IconButton>
          {/* <TextField
              sx={{ width: 200 }}
              select
              label="Seleciona un almacén"
              size="small"
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
            </TextField> */}
          <Divider sx={{ my: 1 }} />
          <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
            <Button
              onClick={() => {
                setEnabled(!enabled);
              }}
              startIcon={<ArticleOutlinedIcon />}
            >
              {enabled ? 'Mostrar artículos deshabilitados' : 'Mostrar artículos habilitados'}
            </Button>
            <Button
              sx={{ height: '75%', mt: '8px', marginRight: '20px' }}
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={() => setOpen(!open)}
            >
              Agregar
            </Button>
          </Stack>
        </TableCardTop>

        <ArticleTable />
      </TableCard>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddArticleModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};

export default Article;
