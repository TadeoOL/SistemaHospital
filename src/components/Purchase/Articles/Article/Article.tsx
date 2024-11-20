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
import { TableTop } from '../../../../common/components/TableCardTop';
import { SelectBasic } from '../../../../common/components/SelectBasic';
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
      <TableTop>
        <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%', px: 0 }} />
        <SelectBasic
          sx={{ width: '20%' }}
          label="Busqueda por almacén"
          options={almacenes}
          uniqueProperty="id_Almacen"
          displayProperty="nombre"
          onChange={(value) => {
            setWarehouseSelected(value);
          }}
        />
        {isLoadingCategories ? (
          <CircularProgress />
        ) : (
          <>
            <SelectBasic
              sx={{ width: 150 }}
              label="Categoria"
              options={categories.filter((cat) => cat.id_Almacen === warehouseSelected)}
              uniqueProperty="id_Categoria"
              displayProperty="nombre"
              onChange={(value) => {
                console.log('value:', value);
                setSelectedCategory(value);
                if (!value) {
                  setSelectedCategorySubcategories(null);
                  return;
                }
                const subCategories = categories.find((cat) => cat.id_Categoria === value)?.subcategorias ?? null;
                console.log('categories:', categories);
                console.log('subCategories:', subCategories);
                setSelectedCategorySubcategories(subCategories);
              }}
            />
            <SelectBasic
              sx={{ width: 150 }}
              label="Subcategoria"
              options={selectedCategorySubcategories}
              uniqueProperty="id_Subcategoria"
              displayProperty="nombre"
              onChange={(value) => {
                setSelectedSubcategory(value);
                setSubcategory(value);
              }}
            />
          </>
        )}
        <IconButton
          sx={{
            height: '40px',
          }}
          onClick={() => {
            cleanArticles();
            setSubcategory('');
            setSelectedCategory(null);
            setSelectedCategorySubcategories(null);
          }}
        >
          <FilterListOff />
        </IconButton>
        <Divider sx={{ my: 1 }} />
        <Button
          sx={{
            height: '40px',
          }}
          onClick={() => {
            setEnabled(!enabled);
          }}
          startIcon={<ArticleOutlinedIcon />}
        >
          {enabled ? 'Mostrar deshabilitados' : 'Mostrar habilitados'}
        </Button>
        <Button
          sx={{ height: '40px', mt: '8px', marginRight: '20px' }}
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={() => setOpen(!open)}
        >
          Agregar
        </Button>
      </TableTop>

      <ArticleTable />
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddArticleModal open={setOpen} />
        </>
      </Modal>
    </>
  );
};

export default Article;
