import { Box, Button } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { CalendarPatientRegisterComponent } from './Calendar/CalendarPatientRegisterComponent';
import { useGetHospitalizationAppointments } from '../../../../../hooks/admission/useGetHospitalizationAppointments';
import { useState } from 'react';

interface RegisterCalendarHospitalizationProps {
  setOpen: Function;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900, lg: 1100 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 550, xl: 900 },
};

export const RegisterCalendarHospitalization = ({ setOpen }: RegisterCalendarHospitalizationProps) => {
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const [day, _] = useState(new Date());
  useGetHospitalizationAppointments(day);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Ingresar Paciente" />
      <Box sx={{ bgcolor: 'background.paper', p: 1, overflowY: 'auto' }}>
        <CalendarPatientRegisterComponent />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          bgcolor: 'background.paper',
        }}
      >
        <Button color="error" variant="outlined" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};
