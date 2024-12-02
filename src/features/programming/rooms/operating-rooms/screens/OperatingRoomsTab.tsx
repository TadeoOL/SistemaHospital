import { MainCard, TablePaginated, TableTop } from '@/common/components';
import { SearchBar } from '@/components/Inputs/SearchBar';
import { useRef, useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const OperatingRoomsTab = () => {
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
            Agregar categoría de cuartos
          </Button>
        </TableTop>
        <TablePaginated
          ref={tableRef}
          columns={columns}
          fetchData={getNormalRoomCategories}
          params={{
            habilitado: true,
            search,
          }}
        />
      </MainCard>
      <NormalRoomCategoriesModal
        open={modalOpen}
        defaultData={selectedItem}
        onClose={handleModalClose}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default OperatingRoomsTab;
