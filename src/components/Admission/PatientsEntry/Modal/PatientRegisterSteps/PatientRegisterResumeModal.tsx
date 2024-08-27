import { Box, Button } from '@mui/material';
import { HeaderModal } from '../../../../Account/Modals/SubComponents/HeaderModal';
import { usePatientEntryRegisterStepsStore } from '../../../../../store/admission/usePatientEntryRegisterSteps';

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

interface PatientRegisterResumeModalProps {
  setOpen: Function;
}

export const PatientRegisterResumeModal = ({ setOpen }: PatientRegisterResumeModalProps) => {
  const step = usePatientEntryRegisterStepsStore((state) => state.step);
  const setStep = usePatientEntryRegisterStepsStore((state) => state.setStep);

  const handleSubmit = () => {};

  const handleReturn = () => {
    setStep(step - 1);
  };

  return (
    <Box sx={style}>
      <HeaderModal setOpen={setOpen} title="Resumen de registro" />
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      ></Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Button variant="outlined" onClick={handleReturn}>
          Regresar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Ingresar Paciente
        </Button>
      </Box>
    </Box>
  );
};
