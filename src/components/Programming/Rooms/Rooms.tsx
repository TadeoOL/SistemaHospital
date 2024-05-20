import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { RoomsTable } from './RoomsTable';
import { useState } from 'react';
import { AddRoomModal } from './Modal/AddRoomModal';
import { useRoomsPaginationStore } from '../../../store/programming/roomsPagination';

export const Rooms = () => {
  const [open, setOpen] = useState(false);
  const setSearch = useRoomsPaginationStore((state) => state.setSearch);
  return (
    <>
      <Box sx={{ bgcolor: 'background.paper', p: 4, rowGap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'start', justifyContent: 'space-between' }}>
          <SearchBar title="Buscar cuarto..." searchState={setSearch} />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar cuarto
          </Button>
        </Box>
        <RoomsTable />
      </Box>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <>
          <AddRoomModal setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
