import { useRef, useState } from 'react';
import { useOperatingRoomCategoriesPaginationStore } from '../stores/useOperatingRoomCategoriesPaginationStore';
import { Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { MainCard, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import OperatingRoomCategoriesModal from '../components/OperatingRoomCategoriesModal';
import { getOperatingRoomCategories } from '../services/operating-room-categories';

const OperatingRoomType = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const tableRef = useRef<any>();
  const onSuccess = () => tableRef?.current?.fetchData();

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

  const { search, setSearch } = useOperatingRoomCategoriesPaginationStore((state) => ({
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
          <SearchBar title="Buscar quirofano..." searchState={setSearch} />
          <Button variant="contained" onClick={handleAdd}>
            Agregar categoria de quirofanos
          </Button>
        </TableTop>
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getOperatingRoomCategories}
          params={{
            habilitado: true,
            search,
          }}
        />
      </MainCard>
      <OperatingRoomCategoriesModal
        open={modalOpen}
        defaultData={selectedItem}
        onClose={handleModalClose}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default OperatingRoomType;
