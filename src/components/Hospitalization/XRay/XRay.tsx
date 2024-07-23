import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { useState } from 'react';
import { AddAndEditXRay } from './Modal/AddAndEditXRay';
import { XRayTable } from './XRayTable';

export const XRay = () => {
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
          <SearchBar searchState={() => {}} title="Buscar la solicitud..." />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar
          </Button>
        </Box>
        <XRayTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddAndEditXRay setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
