import { Box, Button, Card, Modal, Stack, Typography } from '@mui/material';
import { TableHospitalization } from './TableHospitalization';
import { useState } from 'react';
import { RegisterSteps } from '../RegisterSteps/RegisterSteps';

export const HospitalizationRegister = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card sx={{ px: 2, pt: 4, pb: 2 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Registro</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
            >
              Registro de paciente
            </Button>
          </Box>
          <TableHospitalization />
        </Stack>
      </Card>
      <Modal open={open}>
        <>
          <RegisterSteps setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
