import { Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useEffect, useRef, useState } from 'react';
import { ArticleModal } from './ArticleModal';
import { useArticlePagination } from '../../../../store/purchaseStore/articlePagination';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { useGetCategories } from '../../../../hooks/useGetCategories';
import { ISubCategory } from '../../../../types/types';
import { FilterListOff } from '@mui/icons-material';
import { TableTop } from '../../../../common/components/TableTop';
import { useDisableArticle } from './hooks/useDisableArticle';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import { getArticles } from '../../../../api/articles';
import { TablePaginated } from '../../../../common/components/TablePaginated';
import { SelectBasic } from '../../../../common/components/SelectBasic';

const Article = () => {
  const [articleId, setArticleId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    setArticleId('');
  };

  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();

  useEffect(() => {
    setWarehouseSelected(almacenes[0]?.id_Almacen);
  }, [isLoadingAlmacenes]);

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

  const handleAdd = () => {
    setArticleId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setArticleId('');
    setArticleId(row.id);
    setModalOpen(true);
  };

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
      sort: true,
      width: 'auto',
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
      width: '100px',
    },
    {
      header: 'Precio Venta Externo',
      value: 'precioVentaExterno',
      sort: true,
      width: '100px',
    },
    {
      header: 'Precio Venta Interno',
      value: 'precioVentaInterno',
      sort: true,
      width: '100px',
    },
    {
      header: 'Sub categoria',
      value: 'subCategoria',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Unidades por caja',
      value: (row: any) => row.unidadesCaja ?? 'N/A',
      sort: true,
    },
    {
      header: 'Usa Factor',
      value: (row: any) => (row.Factor ? 'Si' : 'No'),
      sort: true,
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handleEdit(row)}>
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
          value={warehouseSelected}
          sx={{ width: '25%', px: 1 }}
          label="Busqueda por almacén"
          options={almacenes}
          uniqueProperty="id_Almacen"
          displayProperty="nombre"
          onChange={(e: any) => {
            setWarehouseSelected(e.target.value);
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
              placeholder=""
              displayProperty="nombre"
              onChange={(e: any) => {
                const value = e.target.value;
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
              onChange={(e: any) => {
                const value = e.target.value;
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
            setWarehouseSelected(null);
            setSubcategory('');
            setSelectedCategory(null);
            setSelectedCategorySubcategories(null);
            setSelectedSubcategory(null);
          }}
        >
          <FilterListOff />
        </IconButton>
        <Button
          sx={{
            height: '40px',
            mx: 1,
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

      {!warehouseSelected && !isLoadingAlmacenes && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h2>Selecciona un almacén para ver los artículos</h2>
        </div>
      )}

      {warehouseSelected && !isLoadingAlmacenes && (
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getArticles}
          params={{
            search,
            id_AlmacenPrincipal: warehouseSelected || null,
            id_Almacen: warehouseSelected || null,
            Id_SubCategoria: subcategory || null,
            habilitado: enabled,
          }}
        ></TablePaginated>
      )}

      <ArticleModal open={modalOpen} itemId={articleId} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default Article;
