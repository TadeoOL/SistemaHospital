import { MainCard, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import { useRef, useState } from 'react';
import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getNormalRoomsPagination } from '../services/normal-rooms';
import { useNormalRoomPaginationStore } from '../stores/useNormalRoomPagination';
import { useDisableNormalRoom } from '../hooks/useDisableNormalRoom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckIcon from '@mui/icons-material/Check';
import NormalRoomsModal from '../components/NormalRoomsModal';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

const NormalRoomsTab = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();
  const disableNormalRoom = useDisableNormalRoom(onSuccess);

  const handleAdd = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (row: any) => {
    setSelectedItem(null);
    setSelectedItem(row);
    setModalOpen(true);
  };

  const { enabled, setEnabled, search, setSearch } = useNormalRoomPaginationStore((state) => ({
    setSearch: state.setSearch,
    search: state.search,
    enabled: state.enabled,
    setEnabled: state.setEnabled,
  }));

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
    },
    {
      header: 'Tipo de cuarto',
      value: 'tipoCuarto',
    },
    {
      header: 'Descripción',
      value: 'descripcion',
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
            <IconButton size="small" onClick={() => disableNormalRoom(row.id_Cuarto)}>
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
          <SearchBar title="Buscar cuarto..." searchState={setSearch} />
          <div className="col"></div>
          <Button
            sx={{
              height: '40px',
              mx: 1,
            }}
            onClick={() => {
              setEnabled(!enabled);
            }}
            variant="outlined"
            startIcon={<ArticleOutlinedIcon />}
          >
            {enabled ? 'Mostrar deshabilitados' : 'Mostrar habilitados'}
          </Button>

          <Grid>
            <Button
              sx={{ height: '40px', mt: '8px' }}
              variant="contained"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={handleAdd}
            >
              <Typography variant="button">Agregar cuarto</Typography>
            </Button>
          </Grid>
        </TableTop>
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getNormalRoomsPagination}
          params={{
            habilitado: enabled,
            search,
          }}
        />
      </MainCard>
      <NormalRoomsModal open={modalOpen} defaultData={selectedItem} onClose={handleModalClose} onSuccess={onSuccess} />
    </>
  );
};

export default NormalRoomsTab;
