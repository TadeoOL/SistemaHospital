import { Box } from '@mui/material';
import { useProgrammingRegisterStore } from '../../../store/programming/programmingRegister';
import { useEffect } from 'react';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { ClinicalDataForm } from './ClinicalDataForm';
import { RoomReservationModal } from './RoomReservationModal';
import { ProcedureAndDoctorSelectorModal } from './ProcedureAndDoctorSelectorModal';
import { MedicinePackageSelectorModal } from './MedicinePackageSelectorModal';
import { BiomedicalEquipmentSelectorModal } from './BiomedicalEquipmentSelectorModal';
import { ProgrammingRegisterResume } from './ProgrammingRegisterResume';

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
  maxHeight: { xs: 500 },
};

interface RegisterStepsProps {
  setOpen: Function;
}

export const RegisterSteps = (props: RegisterStepsProps) => {
  const clearAllData = useProgrammingRegisterStore((state) => state.clearAllData);
  const clearEvents = useProgrammingRegisterStore((state) => state.clearEvents);
  const step = useProgrammingRegisterStore((state) => state.step);

  const renderStepView: Record<number, JSX.Element> = {
    0: <RoomReservationModal setOpen={props.setOpen} />,
    1: <PatientRegistrationForm setOpen={props.setOpen} />,
    2: <ProcedureAndDoctorSelectorModal setOpen={props.setOpen} />,
    3: <MedicinePackageSelectorModal setOpen={props.setOpen} />,
    4: <BiomedicalEquipmentSelectorModal setOpen={props.setOpen} />,
    5: <ClinicalDataForm setOpen={props.setOpen} />,
    6: <ProgrammingRegisterResume setOpen={props.setOpen} />,
  };

  useEffect(() => {
    return () => {
      clearAllData();
      clearEvents();
      localStorage.removeItem('medicData');
      localStorage.removeItem('proceduresList');
      localStorage.removeItem('anesthesiologist');
      localStorage.removeItem('xrayList');
    };
  }, []);

  return <Box sx={style}>{renderStepView[step]}</Box>;
};
