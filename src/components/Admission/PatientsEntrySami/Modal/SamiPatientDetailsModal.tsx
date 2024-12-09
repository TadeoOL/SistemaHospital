import { Box, Button } from '@mui/material';
import { EventPatientDetails } from '../../../Programming/RegisterSteps/EventsModal/EventPatientDetails';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { Paciente } from '@/types/admission/admissionTypes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 650 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 650, md: 800 },
};

export const SamiPatientDetailsModal = (props: { patient: Paciente; setOpen: Function }) => {
  const { patient } = props;
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Informacion del paciente" />
      <Box sx={{ bgcolor: 'background.paper', p: 2, overflowY: 'auto' }}>
        <EventPatientDetails
          patientData={{
            ...patient,
            id_IngresoPaciente: '',
          }}
        />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button variant="contained" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
