import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { AnesthesiologistTable } from './AnesthesiologistTable';
import { AddAndEditAnesthesiologist } from './Modal/AddAndEditAnesthesiologist';
import { useState } from 'react';

export const Anesthesiologist = () => {
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
          <SearchBar searchState={() => {}} title="Buscar el anestesiólogo..." />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar
          </Button>
        </Box>
        <AnesthesiologistTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddAndEditAnesthesiologist setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
