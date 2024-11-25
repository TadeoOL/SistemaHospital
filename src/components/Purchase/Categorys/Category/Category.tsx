import { Button, Stack } from '@mui/material';
import { SearchBar } from '../../../Inputs/SearchBar';
import { useRef, useState } from 'react';
import { useCategoryPagination } from '../../../../store/purchaseStore/categoryPagination';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { useGetAlmacenes } from '../../../../hooks/useGetAlmacenes';
import { TableTop } from '../../../../common/components/TableTop';
import { TablePaginated } from '../../../../common/components/TablePaginated';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';
import { useDisableCategory } from './hooks/useDisableCategory';
import { CategoryModal } from './CategoryModal';
import { SelectBasic } from '../../../../common/components/SelectBasic';
import { getCategories } from '../../../../api/categories';

const Category = () => {
  const [categoryId, setCategoryId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { search, enabled, setEnabled, setSearch, setWarehouseId } = useCategoryPagination((state) => ({
    enabled: state.enabled,
    search: state.search,
    setEnabled: state.setEnabled,
    setWarehouseId: state.setWarehouseId,
    setSearch: state.setSearch,
  }));
  const { almacenes, isLoadingAlmacenes } = useGetAlmacenes();
  const [warehouseSelected, setWarehouseSelected] = useState('');

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef.current.fetchData();
  const disableCategory = useDisableCategory(onSuccess);

  const handleAdd = () => {
    setCategoryId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setCategoryId('');
    setCategoryId(row.id_Categoria);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCategoryId('');
  };

  const columns = [
    {
      header: 'Nombre',
      value: 'nombre',
      width: 'auto',
    },
    {
      header: 'Descripción',
      value: 'descripcion',
      width: 'auto',
    },
    {
      header: 'Almacén',
      value: 'almacen',
      width: 'auto',
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
              <IconButton size="small" onClick={() => disableCategory(row.id_Categoria)}>
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
      <TableTop>
        <SearchBar title="Busca la categoría..." searchState={setSearch} sx={{ width: '30%' }} />
        <Stack sx={{ display: 'flex', flex: 1, maxWidth: 300 }}>
          <SelectBasic
            value={warehouseSelected}
            label="Busqueda por almacén"
            options={almacenes}
            uniqueProperty="id_Almacen"
            displayProperty="nombre"
            onChange={(e: any) => {
              //setWarehouseSelected(e.target.value);
              setWarehouseSelected(e.target.value);
              if (e.target.value === 'Todos') {
                setWarehouseId('');
                return;
              }
              setWarehouseId(e.target.value ?? '');
            }}
          />
        </Stack>
        <Button
          sx={{
            height: '40px',
            mx: 1,
          }}
          onClick={() => {
            setEnabled(!enabled);
          }}
          startIcon={<ClassOutlinedIcon />}
        >
          {enabled ? 'Mostrar deshabilitadas' : 'Mostrar habilitados'}
        </Button>
        <Button
          sx={{ height: '40px', mt: '8px', marginRight: '20px' }}
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAdd}
        >
          Agregar
        </Button>
      </TableTop>

      {!warehouseSelected && !isLoadingAlmacenes && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <h2>Selecciona un almacén para ver las categorias</h2>
        </div>
      )}

      {warehouseSelected && !isLoadingAlmacenes && (
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getCategories}
          params={{
            search,
            habilitado: true,
            Id_Almacen: warehouseSelected || null,
          }}
        ></TablePaginated>
      )}
      <CategoryModal open={modalOpen} itemId={categoryId} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default Category;
