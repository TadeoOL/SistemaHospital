import { useRef, useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';

import { SearchBar } from '@/components/Inputs/SearchBar';
import { useSubCategoryPagination } from '../stores/subCategoryPagination';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';

import { TableTop, TablePaginated } from '@/common/components';

import { useDisableSubCategory } from '../hooks/useDisableSubCategory';
import { getProviders } from '../services/providers';
import { ProvidersModal } from '../components/ProvidersModal';

const Providers = () => {
  const [categoryId, setCategoryId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { search, enabled, setSearch, setEnabled } = useSubCategoryPagination((state) => ({
    search: state.search,
    enabled: state.enabled,
    setSearch: state.setSearch,
    setEnabled: state.setEnabled,
  }));

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
      header: 'Compañía',
      value: 'nombreCompania',
    },
    {
      header: 'Contacto',
      value: 'nombreContacto',
    },
    {
      header: 'Correo electrónico',
      value: 'correoElectronico',
    },
    {
      header: 'Telefono',
      value: 'telefono',
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
      <TableTop>
        <SearchBar title="Busca al proveedor categoría..." searchState={setSearch} sx={{ width: '30%' }} />
        <div style={{ width: '50%' }}></div>
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
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleAdd()}>
          Agregar
        </Button>
      </TableTop>
      <TablePaginated
        ref={tableRef}
        columns={columns}
        fetchData={getProviders}
        params={{
          nombre: search,
          habilitado: enabled,
        }}
      ></TablePaginated>
      <ProvidersModal open={modalOpen} itemId={categoryId} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default Providers;
