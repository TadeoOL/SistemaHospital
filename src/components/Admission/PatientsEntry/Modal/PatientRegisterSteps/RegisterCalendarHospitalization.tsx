import { Box, Button, Typography } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';
import { useGetHospitalizationAppointments } from '../../../../../hooks/admission/useGetHospitalizationAppointments';
import { useState } from 'react';
import { CalendarHospitalizationPatientRegisterComponent } from './Calendar/CalendarHospitalizationPatientRegisterComponent';
import { toast } from 'react-toastify';

interface RegisterCalendarHospitalizationProps {
  setOpen: Function;
  hospitalization?: boolean;
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

export const RegisterCalendarHospitalization = ({ setOpen, hospitalization }: RegisterCalendarHospitalizationProps) => {
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const hospitalizationEvents = usePatientEntryRegisterStepsStore((state) => state.hospitalizationEvents);
  const originalHospitalizationEvents = usePatientEntryRegisterStepsStore(
    (state) => state.originalHospitalizationEvents
  );
  const setHospitalizationEvents = usePatientEntryRegisterStepsStore((state) => state.setHospitalizationEvents);
  const setOriginalHospitalizationEvents = usePatientEntryRegisterStepsStore(
    (state) => state.setOriginalHospitalizationEvents
  );
  const roomsRegistered = usePatientEntryRegisterStepsStore((state) => state.roomsRegistered);
  const [day, _] = useState(new Date());
  useGetHospitalizationAppointments(
    day,
    setHospitalizationEvents,
    hospitalizationEvents,
    0,
    originalHospitalizationEvents,
    setOriginalHospitalizationEvents
  );

  const handleBackStep = () => {
    if (hospitalization) {
      setOpen(false);
      return;
    }
    setStep(step - 1);
  };
  const handleNextStep = () => {
    if (roomsRegistered.length < 1 || (!roomsRegistered.some((r) => r.tipoCuarto == 1) && !hospitalization))
      if (!hospitalization) {
        return toast.warning('Es necesario seleccionar un quirófano y/o espacio hospitalario para continuar');
      } else {
        return toast.warning('Es necesario seleccionar un espacio hospitalario para continuar');
      }
    setStep(step + 1);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Seleccionar Espacio Hospitalario" />
      <Box sx={{ bgcolor: 'background.paper', p: 1, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h3" color={'CaptionText'}>
            Selección de Espacio Hospitalario
          </Typography>
        </Box>

        <CalendarHospitalizationPatientRegisterComponent />
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
        <Button variant="outlined" onClick={handleBackStep}>
          {hospitalization ? 'Cancelar' : 'Regresar'}
        </Button>
        <Button variant="contained" onClick={handleNextStep}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};
