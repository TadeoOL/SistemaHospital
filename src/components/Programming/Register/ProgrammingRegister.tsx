import { Box, Button, Card, Modal, Stack, Typography } from '@mui/material';
import { TableHospitalization } from './TableHospitalization';
import { useState } from 'react';
// import { RegisterSteps } from '../RegisterSteps/RegisterSteps';
import { CalendarRegister } from '../RegisterSteps/CalenderRegister';
import { SearchBar } from '../../Inputs/SearchBar';
import { usePatientRegisterPaginationStore } from '../../../store/programming/patientRegisterPagination';

export const HospitalizationRegister = () => {
  const [open, setOpen] = useState(false);
  const setSearch = usePatientRegisterPaginationStore((state) => state.setSearch);
  return (
    <>
      <Card sx={{ px: 2, pt: 4, pb: 2 }}>
        <Stack spacing={2}>
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Registro</Typography>
          <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <SearchBar searchState={setSearch} title="Buscar registro" sx={{ flex: 1 }} />
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
          <CalendarRegister setOpen={setOpen} />
        </>
      </Modal>
    </>
  );
};
