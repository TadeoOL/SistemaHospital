import { Box, Button } from '@mui/material';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';
import { EventPatientDetails } from '../../RegisterSteps/EventsModal/EventPatientDetails';
import { FullscreenLoader } from '../../../../common/components/FullscreenLoader';
import { useGetPatientInfo } from '../../../../hooks/admission/useGetPatientInfo';

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
  maxHeight: { xs: 650, sm: 750, md: 900 },
};

interface PatientInfoModalProps {
  setOpen: Function;
  id_IngresoPaciente: string;
}

export const PatientInfoModal = (props: PatientInfoModalProps) => {
  const { data, isLoading } = useGetPatientInfo(props.id_IngresoPaciente);

  if (isLoading) return <FullscreenLoader />;
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title={`Información del Paciente`} />
      <Box sx={{ bgcolor: 'background.paper', p: 3, overflowY: 'auto' }}>
        <EventPatientDetails patientData={data} />
      </Box>
      <Box sx={{ bgcolor: 'background.paper', display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button variant="outlined" color="error" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
