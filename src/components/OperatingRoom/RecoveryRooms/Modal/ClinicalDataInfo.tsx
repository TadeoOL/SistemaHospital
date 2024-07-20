import { Box, Button } from '@mui/material';
import { HistorialClinico } from '../../../../types/admissionTypes';
import { EventClinicalHistoryDetails } from '../../../Programming/RegisterSteps/EventsModal/EventClinicalHistoryDetails';
import { HeaderModal } from '../../../Account/Modals/SubComponents/HeaderModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 370, sm: 550, md: 800 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

export const ClinicalDataInfo = (props: { clinicalData: HistorialClinico; setOpen: Function }) => {
  return (
    <Box sx={style}>
      <HeaderModal setOpen={props.setOpen} title="Datos clínicos" />
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <EventClinicalHistoryDetails clinicalHistory={props.clinicalData} />
      </Box>
      <Box sx={{ p: 1, bgcolor: 'background.paper', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Button variant="contained" onClick={() => props.setOpen(false)}>
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};
