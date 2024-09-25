import { Box, Button, Modal } from '@mui/material';
import { SearchBar } from '../../Inputs/SearchBar';
import { BiomedicalEquipmentTable } from './BiomedicalEquipmentTable';
import { AddAndEditBiomedicalEquipment } from './Modal/AddAndEditBiomedicalEquipment';
import { useState } from 'react';

export const BiomedicalEquipment = () => {
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
          <SearchBar searchState={() => {}} title="Buscar el equipo Biomédico..." />
          <Button variant="contained" onClick={() => setOpen(true)}>
            Agregar
          </Button>
        </Box>
        <BiomedicalEquipmentTable />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddAndEditBiomedicalEquipment setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
