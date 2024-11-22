import { Button, CircularProgress, Divider, IconButton, Tooltip } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useEffect, useRef, useState } from 'react';
import { ArticleModal } from './Modal/ArticleModal';
import { useArticlePagination } from '../../../../store/purchaseStore/articlePagination';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { useGetCategories } from '../../../../hooks/useGetCategories';
import { ISubCategory } from '../../../../types/types';
import { FilterListOff } from '@mui/icons-material';
import { TableTop } from '../../../../common/components/TableTop';
import { SelectBasic } from '../../../../common/components/SelectBasic';
import { useDisableArticle } from './hooks/useDisableArticle';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import { getArticles } from '../../../../api/articles';
import { TablePaginated } from '../../../../common/components/TablePaginated';

const Article = () => {
  const [articleId, setArticleId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const { almacenes } = useGetAlmacenes();

  const {
    enabled,
    search,
    warehouseSelected,
    subcategory,
    setEnabled,
    setSearch,
    setWarehouseSelected,
    setSubcategory,
  } = useArticlePagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
    setSubcategory: state.setSubcategory,
    subcategory: state.subcategory,
    warehouseSelected: state.warehouseSelected,
    setWarehouseSelected: state.setWarehouseSelected,
    search: state.search,
  }));

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories, isLoading: isLoadingCategories } = useGetCategories();
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState<ISubCategory[] | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef.current.fetchData();
  const disableArticle = useDisableArticle(onSuccess);

  useEffect(() => {
    tableRef.current.fetchData();
  }, []);

  const handleAdd = () => {
    setArticleId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    return () => {
      setArticleId('');
      setArticleId(row.id);
      setModalOpen(true);
    };
  };

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
      sort: true,
    },
    {
      header: 'Presentacion',
      value: 'presentacion',
      sort: true,
    },
    {
      header: 'Precio Compra',
      value: 'precioCompra',
      sort: true,
    },
    {
      header: 'Precio Venta Externo',
      value: 'precioVentaExterno',
      sort: true,
    },
    {
      header: 'Precio Venta Externo',
      value: 'precioVentaInterno',
      sort: true,
    },
    {
      header: 'Sub categoria',
      value: 'subCategoria',
      sort: true,
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={handleEdit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
            <IconButton size="small" onClick={() => disableArticle(row.id)}>
              {enabled ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableTop>
        <SearchBar title="Busca el articulo..." searchState={setSearch} sx={{ width: '30%' }} />
        <SelectBasic
          sx={{ width: '25%', px: 1 }}
          label="Busqueda por almacén"
          options={almacenes}
          uniqueProperty="id_Almacen"
          displayProperty="nombre"
          onChange={(value: any) => {
            setWarehouseSelected(value);
          }}
          large
        />
        {isLoadingCategories ? (
          <CircularProgress />
        ) : (
          <>
            <SelectBasic
              sx={{ width: '25%', px: 1 }}
              value={selectedCategory}
              label="Categoria"
              options={categories.filter((cat) => cat.id_Almacen === warehouseSelected)}
              uniqueProperty="id_Categoria"
              displayProperty="nombre"
              onChange={(value: any) => {
                setSelectedCategory(value);
                if (!value) {
                  setSelectedCategorySubcategories(null);
                  return;
                }
                const subCategories = categories.find((cat) => cat.id_Categoria === value)?.subcategorias ?? null;
                setSelectedCategorySubcategories(subCategories);
              }}
              large
            />
            <SelectBasic
              value={selectedSubcategory}
              sx={{ width: '25%', px: 1 }}
              label="Subcategoria"
              options={selectedCategorySubcategories}
              uniqueProperty="id_Subcategoria"
              displayProperty="nombre"
              onChange={(value: any) => {
                setSelectedSubcategory(value);
                setSubcategory(value);
              }}
              large
            />
          </>
        )}
        <IconButton
          sx={{
            height: '40px',
          }}
          onClick={() => {
            setSubcategory('');
            setSelectedCategory(null);
            setSelectedCategorySubcategories(null);
            setSelectedSubcategory(null);
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
          onClick={handleAdd}
        >
          Agregar
        </Button>
      </TableTop>

      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getArticles}
        params={{
          habilitado: enabled,
          id_AlmacenPrincipal: warehouseSelected,
          id_Almacen: warehouseSelected,
          Id_Subcategoria: subcategory,
          search,
        }}
      />

      <ArticleModal open={modalOpen} itemId={articleId} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default Article;
