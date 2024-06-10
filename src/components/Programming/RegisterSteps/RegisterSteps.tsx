import { Box } from '@mui/material';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useEffect } from 'react';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { ClinicalDataForm } from './ClinicalDataForm';
import { RoomReservationModal } from './RoomReservationModal';

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
      return <RoomReservationModal setOpen={setOpen} />;
    case 1:
      return <PatientRegistrationForm setOpen={setOpen} />;
    case 2:
      return <ClinicalDataForm setOpen={setOpen} />;
    default:
      return;
  }
};

export const RegisterSteps = (props: RegisterStepsProps) => {
  const clearAllData = useProgrammingRegisterStore((state) => state.clearAllData);
  const clearEvents = useProgrammingRegisterStore((state) => state.clearEvents);
  const step = useProgrammingRegisterStore((state) => state.step);

  useEffect(() => {
    return () => {
      clearAllData();
      clearEvents();
    };
  }, []);

  return <Box sx={style}>{renderStepView(step, props.setOpen)}</Box>;
};
