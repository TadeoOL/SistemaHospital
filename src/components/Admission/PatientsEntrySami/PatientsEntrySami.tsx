import { Box, Button, Card, Modal, Stack } from '@mui/material';
import { PatientsEntrySamiTable } from './PatientsEntrySamiTable';
import { Add } from '@mui/icons-material';
import { AddPatientsEntrySami } from './Modal/AddPatientsEntrySami';
import { useState } from 'react';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const PatientsEntrySami = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card sx={{ px: 2, pt: 1, pb: 2 }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
              Agregar
            </Button>
          </Box>
          <PatientsEntrySamiTable />
        </Stack>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <>
          <AddPatientsEntrySami setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
