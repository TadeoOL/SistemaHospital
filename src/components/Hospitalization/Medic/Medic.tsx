import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { useState } from 'react';
import { MedicTable } from './MedicTable';
import { AddAndEditMedic } from './Modal/AddAndEditMedic';

export const Medic = () => {
  const [open, setOpen] = useState(false);
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
          <SearchBar searchState={() => {}} title="Buscar el medico..." />
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
