import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { useState } from 'react';
import { MedicTable } from './MedicTable';
import { AddAndEditMedic } from './Modal/AddAndEditMedic';
import { useMedicPaginationStore } from '../../../store/hospitalization/medicPagination';

export const Medic = () => {
  const [open, setOpen] = useState(false);
  const setSearch = useMedicPaginationStore((state) => state.setSearch);
  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 4,
          boxShadow: 4,
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchBar searchState={setSearch} title="Buscar el medico..." sx={{ flex: 1 }} />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar
          </Button>
        </Box>
        <MedicTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddAndEditMedic setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
