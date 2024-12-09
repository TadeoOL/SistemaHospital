import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useWarehousePagination } from '../stores/useWarehousePagination';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { MainCard, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useRef, useState } from 'react';
import { useDisableWarehouse } from '../hooks/useDisableWarehouse';
import { getPurchaseWarehouse } from '../services/warehouses';
import WarehouseModal from '../components/WarehouseModal';

const Warehouse = () => {
  const [selectedId, setSelectedId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { enabled, search, setEnabled, setSearch } = useWarehousePagination((state) => ({
    enabled: state.enabled,
    setEnabled: state.setEnabled,
    setSearch: state.setSearch,
    search: state.search,
  }));

  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();
  const disableWarehouse = useDisableWarehouse(onSuccess);

  const handles = {
    edit: (row: any) => {
      setSelectedId('');
      setSelectedId(row.id);
      setModalOpen(true);
    },
    add: () => {
      setSelectedId('');
      setModalOpen(true);
    },
    close: () => {
      setModalOpen(false);
      setSelectedId('');
    },
    disable: (row: any) => {
      disableWarehouse(row.id);
    },
  };

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Descripcion',
      value: 'descripcion',
      sort: true,
      width: 'auto',
    },
    {
      header: 'Acciones',
      value: (row: any) => (
        <>
          <Tooltip title="Editar">
            <IconButton size="small" sx={{ color: 'neutral.700' }} onClick={() => handles.edit(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
            <IconButton size="small" onClick={() => handles.disable(row)}>
              {enabled ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <MainCard content={false}>
        <TableTop>
          <SearchBar title="Busca el almacen..." searchState={setSearch} sx={{ width: '30%' }} />
          <Grid>
            <Button
              sx={{
                height: '40px',
                mx: 2,
              }}
              onClick={() => {
                setEnabled(!enabled);
              }}
              variant="outlined"
              startIcon={<ArticleOutlinedIcon />}
            >
              {enabled ? 'Mostrar almacenes deshabilitados' : 'Mostrar almacenes habilitados'}
            </Button>
            <Button
              sx={{ height: '40px' }}
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={handles.add}
            >
              <Typography variant="button">Agregar</Typography>
            </Button>
          </Grid>
        </TableTop>
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getPurchaseWarehouse}
          params={{
            nombre: search,
            habilitado: enabled,
          }}
        ></TablePaginated>
      </MainCard>
      <WarehouseModal open={modalOpen} itemId={selectedId} onClose={handles.close} onSuccess={onSuccess} />
    </>
  );
};

export default Warehouse;
