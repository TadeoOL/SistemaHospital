import { Box } from '@mui/material';
import { CalenderRegister } from './CalenderRegister';
import { useHospitalizationRegisterStore } from '../../../store/hospitalization/hospitalizationRegister';
import { useEffect } from 'react';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { ClinicalDataForm } from './ClinicalDataForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 380, sm: 550, md: 900 },
  borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: { xs: 900 },
};

interface RegisterStepsProps {
  setOpen: Function;
}
const renderStepView = (step: number, setOpen: Function) => {
  switch (step) {
    case 0:
      return <CalenderRegister setOpen={setOpen} />;
    case 1:
      return <PatientRegistrationForm />;
    case 2:
      return <ClinicalDataForm setOpen={setOpen} />;
    default:
      return;
  }
};

export const RegisterSteps = (props: RegisterStepsProps) => {
  const clearData = useHospitalizationRegisterStore((state) => state.clearAllData);
  useEffect(() => {
    return () => clearData();
  }, []);

  const step = useHospitalizationRegisterStore((state) => state.step);
  return <Box sx={style}>{renderStepView(step, props.setOpen)}</Box>;
};
