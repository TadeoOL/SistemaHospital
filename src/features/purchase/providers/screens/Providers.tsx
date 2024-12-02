import { useRef, useState } from 'react';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';

import { SearchBar } from '@/components/Inputs/SearchBar';
import { useSubCategoryPagination } from '../stores/subCategoryPagination';

import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Typography } from '@mui/material';

import { TableTop, TablePaginated, MainCard } from '@/common/components';

import { useDisableProvider } from '../hooks/useDisableProvider';
import { getProviders } from '../services/providers';
import { ProvidersModal } from '../components/ProvidersModal';

const Providers = () => {
  const [selectedId, setSelectedId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { search, enabled, setSearch, setEnabled } = useSubCategoryPagination((state) => ({
    search: state.search,
    enabled: state.enabled,
    setSearch: state.setSearch,
    setEnabled: state.setEnabled,
  }));

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();
  const disableSubCategory = useDisableProvider(onSuccess);

  const handleAdd = () => {
    setSelectedId('');
    setModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelectedId('');
    setSelectedId(row.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedId('');
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
              <IconButton size="small" onClick={() => disableSubCategory(row.id)}>
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
          <SearchBar title="Busca al proveedor categoría..." searchState={setSearch} sx={{ width: '30%' }} />
          <Grid>
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
            <Button
              sx={{ height: '40px', ml: 2 }}
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={handleAdd}
            >
              <Typography variant="button">Agregar</Typography>
            </Button>
          </Grid>
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
        <ProvidersModal open={modalOpen} itemId={selectedId} onClose={handleModalClose} onSuccess={onSuccess} />
      </MainCard>
    </>
  );
};

export default Providers;
