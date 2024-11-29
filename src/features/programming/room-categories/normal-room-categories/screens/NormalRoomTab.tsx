import { MainCard, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { useNormalRoomsPaginationStore } from '../../stores/useNormalRoomPagination';
import { getRoomCategories } from '../../services/room-categories';
import EditIcon from '@mui/icons-material/Edit';

const NormalRoomTab = () => {
  const [articleId, setArticleId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const tableRef = useRef<any>();

  const handleAdd = () => {
    setArticleId('');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setArticleId('');
  };

  const handleEdit = (row: any) => {
    setArticleId('');
    setArticleId(row.id);
    setModalOpen(true);
  };

  const { search, setSearch } = useNormalRoomsPaginationStore((state) => ({
    setSearch: state.setSearch,
    search: state.search,
  }));

  const columns: any[] = [
    {
      header: 'Nombre',
      value: 'nombre',
    },
    {
      header: 'Precio',
      value: 'precio',
    },
    // intervaloReservacion
    {
      header: 'Descripción',
      value: 'descripcion',
    },
    {
      header: 'Intervalo de reservación',
      value: 'intervaloReservacion',
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
          {/* <Tooltip title={enabled ? 'Deshabilitar' : 'Habilitar'}>
            <IconButton size="small" onClick={() => disableArticle(row.id)}>
              {enabled ? <RemoveCircleIcon sx={{ color: 'red' }} /> : <CheckIcon sx={{ color: 'green' }} />}
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
  ];

  return (
    <>
      <MainCard content={false}>
        <TableTop>
          <SearchBar title="Buscar espacio hospitalario..." searchState={setSearch} />
          <Button variant="contained" onClick={handleAdd}>
            Agregar espacio hospitalario
          </Button>
        </TableTop>
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getRoomCategories}
          params={{
            enabled: true,
            search,
          }}
        />
      </MainCard>
    </>
  );
};

export default NormalRoomTab;
